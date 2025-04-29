import mongoose from "mongoose";
import Listing from "../../../models/listing.model.js";
import { errorHandler } from "../../../utils/error.js";
import {
  getCache,
  invalidateCache,
  keyBuilder,
} from "../../../utils/redis.util.js";
import { createListing, getListings } from "../../listing.controller.js";

// Mock dependencies
jest.mock("../../../models/listing.model.js");
jest.mock("../../../utils/redis.util.js");
jest.mock("../../../utils/error.js", () => ({
  errorHandler: jest.fn((status, msg) => ({
    status,
    message: msg,
  })),
}));

describe("Listing Controller", () => {
  let mockRequest;
  let mockResponse;
  let mockNext;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup request mock
    mockRequest = {
      body: {
        name: "Test Property",
        description: "Test Description",
        address: "123 Test St",
        regularPrice: 1000,
        discountedPrice: 900,
        bathrooms: 2,
        bedrooms: 3,
        furnished: true,
        parking: true,
        listingType: "rent",
        offer: true,
        imageUrls: ["http://test.com/image1.jpg"],
        userRef: new mongoose.Types.ObjectId(),
        listingStatus: "available",
      },
    };

    // Setup response mock
    mockResponse = {
      status: jest.fn().mockReturnThis(), // Explicitly use mockReturnThis()
      json: jest.fn().mockReturnValue(true), // End the chain with a value
      end: jest.fn().mockReturnValue(true), // Optional: Add end() if needed
    };

    // Setup next function mock
    mockNext = jest.fn();
  });

  describe("createListing", () => {
    it("should create listing and invalidate cache successfully", async () => {
      // Mock successful listing creation
      const mockListing = {
        ...mockRequest.body,
        _id: new mongoose.Types.ObjectId(),
      };
      Listing.create.mockResolvedValue(mockListing);

      // Call controller
      await createListing(mockRequest, mockResponse, mockNext);

      // Verify listing creation
      expect(Listing.create).toHaveBeenCalledWith(mockRequest.body);

      // Verify cache invalidation
      expect(invalidateCache).toHaveBeenCalledWith(
        keyBuilder.users.listingsInvalidate()
      );

      // Verify response
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockListing);
    });

    it("should handle case when listing creation fails", async () => {
      // Mock listing creation failure
      Listing.create.mockResolvedValue(null);

      // Mock the error object that errorHandler will return
      const expectedError = {
        statusCode: 400,
        message: "Listing not created",
      };
      errorHandler.mockReturnValue(expectedError);

      // Call controller
      await createListing(mockRequest, mockResponse, mockNext);

      // Verify errorHandler was called with correct parameters
      expect(errorHandler).toHaveBeenCalledWith(400, "Listing not created");

      // Verify next was called with the error object
      expect(mockNext).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("getListings", () => {
    it("should return cached data when available", async () => {
      // Mock cached data
      const cachedData = {
        listings: [
          {
            _id: "64f1b2c3d4e5f6a7b8c9d0e1",
            name: "Luxury Apartment",
            description: "A beautiful luxury apartment in the city center.",
            address: "456 Luxury Lane",
            regularPrice: 2000,
            discountedPrice: 1800,
            bathrooms: 2,
            bedrooms: 3,
            furnished: true,
            parking: true,
            listingType: "rent",
            offer: true,
            imageUrls: [
              "http://example.com/luxury1.jpg",
              "http://example.com/luxury2.jpg",
            ],
            userRef: "64f1b2c3d4e5f6a7b8c9d0e2",
            listingStatus: "available",
            createdAt: "2023-10-01T12:00:00Z",
            updatedAt: "2023-10-01T12:00:00Z",
          },
          {
            _id: "64f1b2c3d4e5f6a7b8c9d0e3",
            name: "Cozy Cottage",
            description: "A charming cottage in the countryside.",
            address: "789 Cozy Road",
            regularPrice: 1200,
            discountedPrice: 1000,
            bathrooms: 1,
            bedrooms: 2,
            furnished: false,
            parking: false,
            listingType: "sale",
            offer: false,
            imageUrls: ["http://example.com/cottage1.jpg"],
            userRef: "64f1b2c3d4e5f6a7b8c9d0e4",
            listingStatus: "available",
            createdAt: "2023-09-15T10:00:00Z",
            updatedAt: "2023-09-15T10:00:00Z",
          },
        ],
      };
      mockRequest.query = {
        limit: 9,
        startIndex: 0,
        offer: "true",
        furnished: "true",
        parking: "true",
        listingType: "rent",
        searchTerm: "",
        sort: "createdAt",
        order: "desc",
      };
      const cachedKey = keyBuilder.listings.search(mockRequest.query);
      getCache.mockResolvedValue(cachedData);

      // Call controller
      await getListings(mockRequest, mockResponse, mockNext);

      // Verify cache hit
      expect(getCache).toHaveBeenCalledWith(cachedKey);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(cachedData);
    });

    it("should return listings from database when cache is empty", async () => {
      // Mock database data
      const dbListings = [
        {
          _id: "64f1b2c3d4e5f6a7b8c9d0e1",
          name: "Luxury Apartment",
          description: "A beautiful luxury apartment in the city center.",
          address: "456 Luxury Lane",
          regularPrice: 2000,
          discountedPrice: 1800,
          bathrooms: 2,
          bedrooms: 3,
          furnished: true,
          parking: true,
          listingType: "rent",
          offer: true,
          imageUrls: [
            "http://example.com/luxury1.jpg",
            "http://example.com/luxury2.jpg",
          ],
          userRef: "64f1b2c3d4e5f6a7b8c9d0e2",
          listingStatus: "available",
        },
      ];

      mockRequest.query = {
        limit: "9",
        startIndex: "0",
        offer: "true",
        furnished: "true",
        parking: "true",
        listingType: "rent",
        searchTerm: "",
        sort: "createdAt",
        order: "desc",
      };

      // Mock cache miss
      getCache.mockResolvedValue(null);

      // Create chain-able query mock
      const queryChain = {
        find: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(dbListings),
      };

      // Setup mongoose query chain
      Listing.find = jest.fn().mockReturnValue(queryChain);

      // Call controller
      await getListings(mockRequest, mockResponse, mockNext);

      // Verify response
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(dbListings);
    });
  });
});

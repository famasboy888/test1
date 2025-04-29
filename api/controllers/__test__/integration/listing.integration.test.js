import mongoose from "mongoose";
import request from "supertest";
import { app, server } from "../../../index.js";
import { createTestUser, getAuthToken } from "../helpers/auth.helper.js";

describe("Listing API Integration", () => {
  let authToken;
  let testUser;

  afterAll(async () => {
    try {
      // Close Express server
      await new Promise((resolve) => {
        server.close(() => {
          console.log("Express server closed");
          resolve();
        });
      });

      // Close MongoDB connection
      await mongoose.disconnect();
      console.log("MongoDB disconnected");
    } catch (error) {
      console.error("Cleanup error:", error);
    }
  });

  beforeEach(async () => {
    testUser = await createTestUser();
    const agent = request(app);
    authToken = await getAuthToken(agent);
  });

  describe("POST /api/listing/create", () => {
    it("should create a new listing", async () => {
      const response = await request(app)
        .post("/api/listing/create")
        .set("Cookie", [authToken])
        .send({
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
          listingStatus: "available",
          userRef: testUser._id,
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("_id");
      expect(response.body.name).toBe("Test Property");
    });
  });

  describe("GET /api/listing/get-listings", () => {
    it("should get listings with filters", async () => {
      // First, create some test listings
      const testListings = [
        {
          name: "Test Property 1",
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
          listingStatus: "available",
          userRef: testUser._id,
        },
        {
          name: "Test Property 2",
          description: "Another Test",
          address: "456 Test Ave",
          regularPrice: 2000,
          discountedPrice: 1800,
          bathrooms: 3,
          bedrooms: 4,
          furnished: true,
          parking: true,
          listingType: "sale",
          offer: true,
          imageUrls: ["http://test.com/image2.jpg"],
          listingStatus: "available",
          userRef: testUser._id,
        },
      ];

      for (const listing of testListings) {
        const createResponse = await request(app)
          .post("/api/listing/create")
          .set("Cookie", [authToken])
          .send(listing);
        expect(createResponse.status).toBe(201);
      }

      // Query with correct parameter handling
      const response = await request(app)
        .get("/api/listing/get-listings")
        .query({
          searchTerm: "",
          listingType: "rent", // Must match exact value in data
        });

      // Assertions
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});

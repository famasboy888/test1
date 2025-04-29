import mongoose from "mongoose";
import Listing from "../../listing.model.js";

describe("Listing Model Test", () => {
  // Could users break this?
  describe("Input Validation", () => {
    it("should reject when negative prices", async () => {
      const listing = new Listing({
        name: "Test Property",
        description: "Test Description",
        address: "123 Test St",
        // negative price here
        regularPrice: -100,
        discountedPrice: 0,
        bathrooms: 2,
        bedrooms: 3,
        furnished: true,
        parking: true,
        listingType: "rent",
        offer: true,
        imageUrls: ["http://test.com/image1.jpg"],
        userRef: new mongoose.Types.ObjectId(),
        listingStatus: "available",
      });

      let validationError;

      try {
        await listing.validate();
      } catch (error) {
        validationError = error;
      }

      expect(validationError).toBeDefined();
      expect(validationError.errors.regularPrice).toBeDefined();
      expect(validationError.errors.regularPrice.message).toContain(
        "Price must be a positive number"
      );
    });

    it("should accept when price is positive", async () => {
      const listing = new Listing({
        name: "Test Property",
        description: "Test Description",
        address: "123 Test St",
        // negative price here
        regularPrice: 100,
        discountedPrice: 0,
        bathrooms: 2,
        bedrooms: 3,
        furnished: true,
        parking: true,
        listingType: "rent",
        offer: true,
        imageUrls: ["http://test.com/image1.jpg"],
        userRef: new mongoose.Types.ObjectId(),
        listingStatus: "available",
      });

      let validationError;

      try {
        await listing.validate();
      } catch (error) {
        validationError = error;
      }

      expect(validationError).toBeUndefined();
    });

    it("should reject when discountedPrice is higher than regularPrice", async () => {
      const listing = new Listing({
        name: "Test Property",
        description: "Test Description",
        address: "123 Test St",
        // negative price here
        regularPrice: 100,
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
      });

      let validationError;

      try {
        await listing.validate();
      } catch (error) {
        validationError = error;
      }

      expect(validationError).toBeDefined();
      expect(validationError.errors.discountedPrice).toBeDefined();
      expect(validationError.errors.discountedPrice.message).toContain(
        "Discounted price must be less than or equal to regular price"
      );
    });
  });
});

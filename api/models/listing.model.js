import mongoose from "mongoose";
import User from "./user.model.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Listing:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - address
 *         - regularPrice
 *         - discountedPrice
 *         - bathrooms
 *         - bedrooms
 *         - furnished
 *         - parking
 *         - listingType
 *         - offer
 *         - imageUrls
 *         - userRef
 *         - listingStatus
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the listing
 *         description:
 *           type: string
 *           description: A detailed description of the listing
 *         address:
 *           type: string
 *           description: The address of the listing
 *         regularPrice:
 *           type: number
 *           description: The regular price of the listing
 *         discountedPrice:
 *           type: number
 *           description: The discounted price of the listing
 *         bathrooms:
 *           type: number
 *           description: The number of bathrooms in the listing
 *         bedrooms:
 *           type: number
 *           description: The number of bedrooms in the listing
 *         furnished:
 *           type: boolean
 *           description: Whether the listing is furnished
 *         parking:
 *           type: boolean
 *           description: Whether the listing has parking available
 *         listingType:
 *           type: string
 *           enum:
 *             - rent
 *             - sale
 *           description: The type of listing (rent or sale)
 *         offer:
 *           type: boolean
 *           description: Whether the listing has an offer
 *         imageUrls:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of image URLs for the listing
 *         userRef:
 *           type: string
 *           format: ObjectId
 *           description: The ID of the user who created the listing
 *         listingStatus:
 *           type: string
 *           enum:
 *             - available
 *             - pending
 *             - deleted
 *           description: The status of the listing
 *       example:
 *         name: "Cozy Apartment"
 *         description: "A cozy apartment in the city center."
 *         address: "123 Main Street, Cityville"
 *         regularPrice: 1200
 *         discountedPrice: 1000
 *         bathrooms: 2
 *         bedrooms: 3
 *         furnished: true
 *         parking: true
 *         listingType: "rent"
 *         offer: true
 *         imageUrls: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *         userRef: "60d21b4667d0d8992e610c85"
 *         listingStatus: "available"
 */

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    discountedPrice: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    furnished: {
      type: Boolean,
      required: true,
      default: false,
    },
    parking: {
      type: Boolean,
      required: true,
      default: false,
    },
    listingType: {
      type: String,
      enum: ["rent", "sale"],
      required: true,
    },
    offer: {
      type: Boolean,
      require: true,
      default: false,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    listingStatus: {
      type: String,
      enum: ["available", "pending", "deleted"],
      default: "available",
      required: true,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;

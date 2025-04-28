import exress from "express";
import {
  createListing,
  getListings,
} from "../controllers/listing.controller.js";
import { verifyUserToken } from "../middlewares/auth.middleware.js";

const router = exress.Router();

/**
 * @swagger
 * tags:
 *   name: Listings
 *   description: API for managing real estate listings
 */

/**
 * @swagger
 * /api/listing/create:
 *   post:
 *     summary: Create a new listing
 *     tags: [Listings]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Listing'
 *     responses:
 *       201:
 *         description: Listing created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Listing'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/listing/get-listings:
 *   get:
 *     summary: Get listings with filters
 *     tags: [Listings]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of listings to return
 *       - in: query
 *         name: startIndex
 *         schema:
 *           type: integer
 *         description: Starting index for pagination
 *       - in: query
 *         name: offer
 *         schema:
 *           type: boolean
 *         description: Filter by offers
 *       - in: query
 *         name: furnished
 *         schema:
 *           type: boolean
 *         description: Filter by furnished status
 *       - in: query
 *         name: parking
 *         schema:
 *           type: boolean
 *         description: Filter by parking availability
 *       - in: query
 *         name: listingType
 *         schema:
 *           type: string
 *           enum: [rent, sale, all]
 *         description: Filter by listing type
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Search term for listing name
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of listings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Listing'
 *       500:
 *         description: Internal server error
 */

router.post("/create", verifyUserToken, createListing);

router.get("/get-listings", getListings);

export default router;

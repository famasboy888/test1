import exress from "express";
import {
  createListing,
  getListings,
} from "../controllers/listing.controller.js";
import { verifyUserToken } from "../middlewares/auth.middleware.js";

const router = exress.Router();

router.post("/create", verifyUserToken, createListing);

router.get("/get-listings", getListings);

export default router;

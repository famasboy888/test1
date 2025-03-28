import exress from "express";
import { createListing } from "../controllers/listing.controller.js";
import { verifyUserToken } from "../middlewares/auth.middleware.js";

const router = exress.Router();

router.post("/create", verifyUserToken, createListing);

export default router;

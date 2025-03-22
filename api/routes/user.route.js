import express from "express";
import { uploadProfilePicture } from "../controllers/user.controller.js";
import { uploadSingleImage } from "../middlewares/cloudinary.middleware.js";

const router = express.Router();

router.post("/profile", uploadSingleImage, uploadProfilePicture);

export default router;

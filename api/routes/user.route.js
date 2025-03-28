import express from "express";
import {
  deleteUser,
  getCloudinarySignature,
  testHash,
  updateUserProfile,
  uploadProfilePicture,
} from "../controllers/user.controller.js";
import { verifyUserToken } from "../middlewares/auth.middleware.js";
import { uploadSingleImage } from "../middlewares/cloudinary.middleware.js";

const router = express.Router();

router.patch("/profile/update/:id", verifyUserToken, updateUserProfile);

router.patch("/profile/delete/:id", verifyUserToken, deleteUser);

router.post("/profile/upload", uploadSingleImage, uploadProfilePicture);

router.get("/get-signature", getCloudinarySignature);

router.get("/test", testHash);

export default router;

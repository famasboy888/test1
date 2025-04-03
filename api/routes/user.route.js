import express from "express";
import {
  deleteUser,
  deleteUserListing,
  getCloudinarySignature,
  getUserListingDetail,
  getUserListings,
  testHash,
  updateUserProfile,
  uploadProfilePicture,
} from "../controllers/user.controller.js";
import { verifyUserToken } from "../middlewares/auth.middleware.js";
import { uploadSingleImage } from "../middlewares/cloudinary.middleware.js";

const router = express.Router();

//User Profile

router.patch("/profile/update/:id", verifyUserToken, updateUserProfile);

router.patch("/profile/delete/:id", verifyUserToken, deleteUser);

router.post("/profile/upload", uploadSingleImage, uploadProfilePicture);

router.get("/get-signature", getCloudinarySignature);

router.get("/test", testHash);

//User Listings

router.get("/listings/:id", verifyUserToken, getUserListings);

router.get("/listing/detail", verifyUserToken, getUserListingDetail);

router.patch("/listing/delete/:id", verifyUserToken, deleteUserListing);

export default router;

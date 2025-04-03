import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinaryConfig.js";
import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const testHash = async (req, res) => {
  const hashedPassword = await bcryptjs.hash("password", 10);
  console.log(hashedPassword);
};

export const uploadProfilePicture = (req, res, next) => {
  console.log("Image upload");
  let uploadedBytes = 0;
  try {
    req.on("data", (chunk) => {
      uploadedBytes += chunk.length;
      console.log(
        `Received chunk: ${chunk.length} bytes (Total uploaded: ${uploadedBytes} bytes)`
      );
    });

    if (!req.file) {
      return next(errorHandler(400, "No file uploaded"));
    }

    req.on("end", () => {
      console.log("Upload complete!");
      res.status(201).json({ imageUrl: req.file.path });
    });
  } catch (error) {
    next(errorHandler(400, "Something wrong with image upload"));
  }
};

export const getCloudinarySignature = (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000); // Current timestamp

  // Generate a secure signature
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, upload_preset: "mern_realty_secure" },
    process.env.CLOUDINARY_API_SECRET
  );

  // Send the signature + timestamp to the frontend
  res.json({
    signature,
    timestamp,
    api_key: process.env.CLOUDINARY_API_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    upload_preset: "mern_realty_secure",
  });
};

export const updateUserProfile = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(
      errorHandler(
        401,
        "Unauthorized Account - You can only update your account"
      )
    );
  }

  try {
    const { username, avatar } = req.body;
    console.log("Log from update", username, avatar, req.body.password);
    const updateFields = {};

    if (username) updateFields.username = username;
    if (avatar) updateFields.avatar = avatar;
    if (req.body.password) {
      updateFields.password = await bcryptjs.hash(req.body.password, 10);
    }

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...updateFields,
        },
      },
      {
        new: true,
        timestamps: true,
      }
    );

    if (!updateUser) {
      return next(errorHandler(500, "User did not update successfully"));
    }

    const { password, ...rest } = updateUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(
      errorHandler(
        401,
        "Unauthorized Account - You can only update your account"
      )
    );
  }

  try {
    const deletedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          accountStatus: "deleted",
        },
      },
      {
        new: true,
        timestamps: true,
      }
    );

    if (!deletedUser) {
      return next(errorHandler(500, "User did not delete successfully"));
    }

    res.status(200).json("User has been deleted.");
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      return next(
        errorHandler(
          401,
          "Unauthorized Account - You can only update your account"
        )
      );
    }

    const listings = await Listing.find({
      userRef: req.user.id,
    });

    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const getUserListingDetail = async (req, res, next) => {
  const { listingId, userRef } = req.query;

  console.log(listingId, userRef);

  try {
    if (req.user.id !== userRef) {
      return next(
        errorHandler(
          401,
          "Unauthorized Account - You can only update your account"
        )
      );
    }

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return next(errorHandler(400, "Invalid listing is entered."));
    }

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return next(errorHandler(404, "Listing not found."));
    }

    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

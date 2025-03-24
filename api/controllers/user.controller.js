import bcryptjs from "bcryptjs";
import cloudinary from "../config/cloudinaryConfig.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const user = (req, res) => {
  res.send("User route");
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
    if (req.body.password) {
      req.body.password = await bcryptjs.hash(req.body.password, 10);
    }

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username,
          password: req.body.password,
          avatar,
        },
      },
      {
        new: true,
      }
    );

    const { password, ...rest } = updateUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

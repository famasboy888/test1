import { errorHandler } from "../utils/error.js";

export const user = (req, res) => {
  res.send("User route");
};

export const uploadProfilePicture = (req, res, next) => {
  console.log("Image upload");
  try {
    if (!req.file) {
      return next(errorHandler(400, "No file uploaded"));
    }
    res.status(201).json({ imageUrl: req.file.path });
  } catch (error) {
    next(errorHandler(400, "Something wrong with image upload"));
  }
};

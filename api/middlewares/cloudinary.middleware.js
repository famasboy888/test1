import upload from "../config/multerConfig.js";
import { errorHandler } from "../utils/error.js";

const multerUpload = upload.single("image");

export const uploadSingleImage = (req, res, next) => {
  multerUpload(req, res, (error) => {
    if (error) {
      return next(errorHandler(404, error));
    }
    next();
  });
};

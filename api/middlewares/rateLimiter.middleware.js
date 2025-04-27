import rateLimit from "express-rate-limit";
import { errorHandler } from "../utils/error.js";

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: () =>
    errorHandler(
      429,
      "Too many login attempts, please try again after an hour"
    ),
});

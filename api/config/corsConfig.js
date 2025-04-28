import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const corsConfig = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.CLIENT_URL
      : "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-csrf-token",
    "x-requested-with",
  ],
  exposedHeaders: ["set-cookie"],
  maxAge: 86400, // 24 hours
};

export const corsMiddleware = cors(corsConfig);

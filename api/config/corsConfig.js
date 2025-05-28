import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const allowedOrigins = {
  localDev: "http://localhost:5173",
  dev: process.env.CLIENT_URL_DEV,
  staging: process.env.CLIENT_URL_STAGING,
  production: process.env.CLIENT_URL_PROD,
};

// This is for workflow testing purposes
const selectedOrigin =
  allowedOrigins[process.env.APP_ENV] || "http://localhost:5173";

const corsConfig = {
  origin: selectedOrigin,
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

import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { exit } from "process";
import responseTime from "response-time";
// Import routers here
import helmet from "helmet";
import path from "path";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { authLimiter } from "./middlewares/rateLimiter.middleware.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import userRouter from "./routes/user.route.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(responseTime());

// Security header - HELMET
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "https://clean-anteater-11470.upstash.io"],
        imgSrc: ["'self'", "https:", "data:", "blob:"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Apply ratee limitter
app.use("/api/auth", authLimiter);

// Use routers here
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

const _dirname = path.resolve();

app.use(express.static(path.join(_dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(_dirname, "client", "dist", "index.html"));
});

// Use middlewares here
app.use(errorMiddleware);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error(err);
    exit(1);
  });

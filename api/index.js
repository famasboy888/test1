import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { exit } from "process";
// Import routers here
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";

dotenv.config();

const app = express();
app.use(express.json());

// Use middlewares here
app.use((error, req, res, next) => {
  const statusCode = error.statusCode ?? 500;
  const message = error.message ?? "Internal Server Error";
  return res.status(statusCode).json({ success: false, statusCode, message });
});

// Use routers here
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

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

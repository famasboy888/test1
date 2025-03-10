import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { exit } from "process";
dotenv.config();

const app = express();

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

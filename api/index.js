import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { exit } from "process";
import responseTime from "response-time";
// Import routers here
import helmet from "helmet";
import path from "path";
import swaggerUI from "swagger-ui-express";
import { corsMiddleware } from "./config/corsConfig.js";
import specs from "./config/swaggerConfig.js";
import logger from "./config/winstonLoggerConfig.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { morganMiddleware } from "./middlewares/morgan.middleware.js";
import { authLimiter } from "./middlewares/rateLimiter.middleware.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import userRouter from "./routes/user.route.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(responseTime());

// Use middlewares here
app.use(errorMiddleware);

// Swagger API documentation
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

//Monitoring and loggins
app.use(morganMiddleware);

// CORS middleware
app.use(corsMiddleware);

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

let server;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    logger.info("MongoDB connected");
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 3000;
    server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error(err);
    console.error(err);
    exit(1);
  });

export { app, server };

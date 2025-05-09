import dotenv from "dotenv";
import morgan from "morgan";
import logger from "../config/winstonLoggerConfig.js";
dotenv.config();

const stream = {
  write: (message) => logger.http(message.trim()),
};

const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env !== "development";
};

export const morganMiddleware = morgan(
  ":remote-addr :method :url :status :res[content-length] - :response-time ms",
  { stream, skip }
);

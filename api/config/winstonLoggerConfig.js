import dotenv from "dotenv";
import path from "path";
import winston from "winston";
dotenv.config();

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logger = winston.createLogger({
  levels: logLevels,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Error logs
    new winston.transports.File({
      filename: path.join("logs", "error.log"),
      level: "error",
    }),
    // Info logs
    new winston.transports.File({
      filename: path.join("logs", "info.log"),
      level: "info",
    }),
    // HTTP logs
    new winston.transports.File({
      filename: path.join("logs", "http.log"),
      level: "http",
    }),
  ],
});

// Add console logging in development
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export default logger;

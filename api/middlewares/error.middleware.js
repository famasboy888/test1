export const errorMiddleware = (error, req, res, next) => {
  console.error("Stack trace: " + error.stack); // Log error
  logger.error("API Error:", {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    user: req.user?.id || "anonymous",
  });

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};

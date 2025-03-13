export const errorMiddleware = (error, req, res, next) => {
  console.error("Stack trace: " + error.stack); // Log error
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};

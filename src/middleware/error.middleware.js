export const errorMiddleware = (err, req, res, next) => {
  const statusCode =
    err.message === "User not found" || err.message === "Post not found"
      ? 404
      : err.message === "Access denied"
        ? 403
        : err.message === "Access token is required" ||
            err.message === "Invalid or expired access token"
          ? 401
          : 400;

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

const errorHandler = (err, req, res, next) => {
  res.status(res.statusCode || 500);

  res.json({
    status: err.status,
    message: err.message,
    stack: process.env.NODE_ENV === "PRODUCTION" ? null : err.stack,
  });
};

module.exports = { errorHandler };

const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode ? statusCode : 500;

  res.status(statusCode);
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === "PRODUCTION" ? null : error.stack,
  });
};

module.exports = { errorHandler };

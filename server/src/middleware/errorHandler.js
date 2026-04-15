const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    status: 'failed',
    message: err.message,
    response: process.env.NODE_ENV === 'production' ? null : { stack: err.stack },
  });
};

module.exports = { errorHandler };

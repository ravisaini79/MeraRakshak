const responseFormatter = (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    // Prevent double wrapping and skip swagger endpoints if any under api
    if (data && (data.status === 'success' || data.status === 'failed' || data.status === 'error')) {
      return originalJson.call(this, data);
    }

    const statusCode = res.statusCode;

    // Only apply format for successful requests (2xx status codes)
    if (statusCode >= 200 && statusCode < 300) {
      let message = 'Request successful';
      let responsePayload = data;

      // Extract message from payload if it exists and determine the actual response data
      if (data && typeof data === 'object' && !Array.isArray(data) && data.message) {
        message = data.message;

        if (Object.keys(data).length === 1) {
          responsePayload = null;
        } else {
          responsePayload = { ...data };
          delete responsePayload.message;
        }
      }

      return originalJson.call(this, {
        status: 'success',
        message: message,
        response: responsePayload
      });
    }

    return originalJson.call(this, data);
  };

  next();
};

module.exports = { responseFormatter };

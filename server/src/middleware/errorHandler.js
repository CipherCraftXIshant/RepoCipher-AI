const { logger } = require("../config/logger");

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function notFoundHandler(req, res) {
  res.status(404).json({ error: `Not found: ${req.method} ${req.path}` });
}

function errorHandler(err, req, res, _next) {
  const status = err instanceof HttpError ? err.status : 500;
  const message = err instanceof Error ? err.message : "Internal server error";

  if (status >= 500) {
    logger.error({ err, path: req.path }, "Unhandled request error");
  }

  res.status(status).json({ error: message });
}

module.exports = { HttpError, notFoundHandler, errorHandler };

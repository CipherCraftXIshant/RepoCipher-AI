const { verifyAccessToken } = require("../utils/jwt");
const { HttpError } = require("./errorHandler");

function requireAuth(req, _res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;
  if (!token) {
    throw new HttpError(401, "Missing or invalid Authorization header");
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    throw new HttpError(401, "Invalid or expired access token");
  }

  req.userId = payload.sub;
  next();
}

module.exports = { requireAuth };

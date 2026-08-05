const { createHash, randomUUID } = require("crypto");
const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

function signAccessToken(userId) {
  return jwt.sign({ sub: userId }, env.jwtAccessSecret, { expiresIn: env.jwtAccessTtl });
}

function verifyAccessToken(token) {
  try {
    const payload = jwt.verify(token, env.jwtAccessSecret);
    if (typeof payload === "string" || !payload.sub) return null;
    return { sub: payload.sub };
  } catch {
    return null;
  }
}

function generateRefreshToken() {
  return randomUUID() + randomUUID();
}

function hashRefreshToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

function refreshTokenExpiry() {
  const days = env.jwtRefreshTtlDays;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  refreshTokenExpiry,
};

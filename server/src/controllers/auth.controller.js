const { isProduction, env } = require("../config/env");
const { HttpError } = require("../middleware/errorHandler");
const {
  createUserWithPassword,
  findUserByEmail,
  findUserById,
  findValidRefreshToken,
  revokeRefreshToken,
  storeRefreshToken,
  upsertGoogleUser,
} = require("../models/user.model");

const { toPublicUser } = require("../serializers/user");

const {
  generateRefreshToken,
  hashRefreshToken,
  refreshTokenExpiry,
  signAccessToken,
} = require("../utils/jwt");

const { comparePassword, hashPassword } = require("../utils/password");

const REFRESH_COOKIE = "rt";
const REFRESH_COOKIE_PATH = "/api/auth";

function setRefreshCookie(res, token) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: REFRESH_COOKIE_PATH,
    maxAge: env.jwtRefreshTtlDays * 24 * 60 * 60 * 1000,
  });
}

function clearRefreshCookie(res) {
  res.clearCookie(REFRESH_COOKIE, { path: REFRESH_COOKIE_PATH });
}

async function issueTokens(res, userId) {
  const accessToken = signAccessToken(userId);
  const refreshToken = generateRefreshToken();
  await storeRefreshToken(userId, hashRefreshToken(refreshToken), refreshTokenExpiry());
  setRefreshCookie(res, refreshToken);
  return accessToken;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function signup(req, res) {
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || !isValidEmail(email)) {
    throw new HttpError(400, "A valid email is required");
  }
  if (typeof password !== "string" || password.length < 8) {
    throw new HttpError(400, "Password must be at least 8 characters");
  }

  const existing = await findUserByEmail(email.toLowerCase());
  if (existing) {
    throw new HttpError(409, "An account with this email already exists");
  }

  const passwordHash = await hashPassword(password);
  const user = await createUserWithPassword(email.toLowerCase(), passwordHash);
  const accessToken = await issueTokens(res, user.id);

  res.status(201).json({ accessToken, user: toPublicUser(user) });
}

async function login(req, res) {
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string") {
    throw new HttpError(400, "Email and password are required");
  }

  const user = await findUserByEmail(email.toLowerCase());
  if (!user || !user.passwordHash) {
    throw new HttpError(401, "Invalid email or password");
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    throw new HttpError(401, "Invalid email or password");
  }

  const accessToken = await issueTokens(res, user.id);
  res.json({ accessToken, user: toPublicUser(user) });
}

async function refresh(req, res) {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (typeof token !== "string") {
    throw new HttpError(401, "Missing refresh token");
  }

  const tokenHash = hashRefreshToken(token);
  const stored = await findValidRefreshToken(tokenHash);
  if (!stored) {
    clearRefreshCookie(res);
    throw new HttpError(401, "Invalid or expired refresh token");
  }

  await revokeRefreshToken(tokenHash);
  const accessToken = await issueTokens(res, stored.userId);
  const user = await findUserById(stored.userId);
  res.json({ accessToken, user: user ? toPublicUser(user) : null });
}

async function logout(req, res) {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (typeof token === "string") {
    await revokeRefreshToken(hashRefreshToken(token));
  }
  clearRefreshCookie(res);
  res.status(204).send();
}

async function me(req, res) {
  const user = await findUserById(req.userId);
  if (!user) {
    throw new HttpError(404, "User not found");
  }
  res.json({ user: toPublicUser(user) });
}

async function googleStart(_req, res) {
  const params = new URLSearchParams({
    client_id: env.googleClientId,
    redirect_uri: env.googleCallbackUrl,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}

async function googleCallback(req, res) {
  const code = req.query.code;
  if (typeof code !== "string") {
    throw new HttpError(400, "Missing authorization code");
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.googleClientId,
      client_secret: env.googleClientSecret,
      redirect_uri: env.googleCallbackUrl,
      grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) {
    throw new HttpError(502, "Failed to exchange Google authorization code");
  }
  const tokenData = await tokenRes.json();

  const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  if (!userRes.ok) {
    throw new HttpError(502, "Failed to fetch Google user profile");
  }
  const profile = await userRes.json();

  const user = await upsertGoogleUser({
    googleId: profile.sub,
    email: profile.email.toLowerCase(),
    displayName: profile.name ?? null,
    avatarUrl: profile.picture ?? null,
  });

  await issueTokens(res, user.id);
  res.redirect(`${env.clientUrl}/auth/callback`);
}

module.exports = {
  signup,
  login,
  refresh,
  logout,
  me,
  googleStart,
  googleCallback,
};

import { createHash, randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AccessTokenPayload {
  sub: string;
}

export function signAccessToken(userId: string): string {
  return jwt.sign({ sub: userId }, env.jwtAccessSecret, { expiresIn: env.jwtAccessTtl as jwt.SignOptions["expiresIn"] });
}

export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    const payload = jwt.verify(token, env.jwtAccessSecret);
    if (typeof payload === "string" || !payload.sub) return null;
    return { sub: payload.sub };
  } catch {
    return null;
  }
}

export function generateRefreshToken(): string {
  return randomUUID() + randomUUID();
}

export function hashRefreshToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function refreshTokenExpiry(): Date {
  const days = env.jwtRefreshTtlDays;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

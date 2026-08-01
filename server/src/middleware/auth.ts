import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { HttpError } from "./errorHandler";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
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

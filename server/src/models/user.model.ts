import { Schema, model, type HydratedDocument } from "mongoose";
import type { User } from "../types/user";

interface UserDoc {
  email: string;
  passwordHash: string | null;
  googleId: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDoc>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, default: null },
    googleId: { type: String, default: null, unique: true, sparse: true },
    displayName: { type: String, default: null },
    avatarUrl: { type: String, default: null },
  },
  { timestamps: true },
);

const UserModel = model<UserDoc>("User", userSchema);

interface RefreshTokenDoc {
  userId: Schema.Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
}

const refreshTokenSchema = new Schema<RefreshTokenDoc>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  tokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  revokedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

const RefreshTokenModel = model<RefreshTokenDoc>("RefreshToken", refreshTokenSchema);

function toUser(doc: HydratedDocument<UserDoc>): User {
  return {
    id: doc.id,
    email: doc.email,
    passwordHash: doc.passwordHash,
    googleId: doc.googleId,
    displayName: doc.displayName,
    avatarUrl: doc.avatarUrl,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function createUserWithPassword(email: string, passwordHash: string): Promise<User> {
  const doc = await UserModel.create({ email, passwordHash });
  return toUser(doc);
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const doc = await UserModel.findOne({ email });
  return doc ? toUser(doc) : null;
}

export async function findUserById(id: string): Promise<User | null> {
  const doc = await UserModel.findById(id);
  return doc ? toUser(doc) : null;
}

export async function findUserByGoogleId(googleId: string): Promise<User | null> {
  const doc = await UserModel.findOne({ googleId });
  return doc ? toUser(doc) : null;
}

export async function upsertGoogleUser(params: {
  googleId: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
}): Promise<User> {
  const existingByGoogleId = await findUserByGoogleId(params.googleId);
  if (existingByGoogleId) return existingByGoogleId;

  const existingByEmail = await UserModel.findOne({ email: params.email });
  if (existingByEmail) {
    existingByEmail.googleId = params.googleId;
    existingByEmail.displayName = existingByEmail.displayName ?? params.displayName;
    existingByEmail.avatarUrl = existingByEmail.avatarUrl ?? params.avatarUrl;
    await existingByEmail.save();
    return toUser(existingByEmail);
  }

  const doc = await UserModel.create({
    email: params.email,
    googleId: params.googleId,
    displayName: params.displayName,
    avatarUrl: params.avatarUrl,
  });
  return toUser(doc);
}

export async function updateAvatarUrl(userId: string, avatarUrl: string): Promise<User> {
  const doc = await UserModel.findByIdAndUpdate(userId, { avatarUrl }, { new: true });
  if (!doc) {
    throw new Error(`User not found: ${userId}`);
  }
  return toUser(doc);
}

export async function storeRefreshToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
  await RefreshTokenModel.create({ userId, tokenHash, expiresAt });
}

export interface RefreshTokenRow {
  id: string;
  userId: string;
}

export async function findValidRefreshToken(tokenHash: string): Promise<RefreshTokenRow | null> {
  const doc = await RefreshTokenModel.findOne({
    tokenHash,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });
  return doc ? { id: doc.id, userId: doc.userId.toString() } : null;
}

export async function revokeRefreshToken(tokenHash: string): Promise<void> {
  await RefreshTokenModel.updateOne({ tokenHash }, { revokedAt: new Date() });
}

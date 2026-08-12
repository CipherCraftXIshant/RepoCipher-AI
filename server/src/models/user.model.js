const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, default: null },
    googleId: { type: String, index: { unique: true, sparse: true } },
    displayName: { type: String, default: null },
    avatarUrl: { type: String, default: null },
  },
  { timestamps: true },
);

const UserModel = model("User", userSchema);

const refreshTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  tokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  revokedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

const RefreshTokenModel = model("RefreshToken", refreshTokenSchema);

function toUser(doc) {
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

async function createUserWithPassword(email, passwordHash) {
  const doc = await UserModel.create({ email, passwordHash });
  return toUser(doc);
}

async function findUserByEmail(email) {
  const doc = await UserModel.findOne({ email });
  return doc ? toUser(doc) : null;
}

async function findUserById(id) {
  const doc = await UserModel.findById(id);
  return doc ? toUser(doc) : null;
}

async function findUserByGoogleId(googleId) {
  if (!googleId) return null;
  const doc = await UserModel.findOne({ googleId });
  return doc ? toUser(doc) : null;
}

async function upsertGoogleUser(params) {
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

async function updateAvatarUrl(userId, avatarUrl) {
  const doc = await UserModel.findByIdAndUpdate(userId, { avatarUrl }, { new: true });
  if (!doc) {
    throw new Error(`User not found: ${userId}`);
  }
  return toUser(doc);
}

async function storeRefreshToken(userId, tokenHash, expiresAt) {
  await RefreshTokenModel.create({ userId, tokenHash, expiresAt });
}

async function findValidRefreshToken(tokenHash) {
  const doc = await RefreshTokenModel.findOne({
    tokenHash,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });
  return doc ? { id: doc.id, userId: doc.userId.toString() } : null;
}

async function revokeRefreshToken(tokenHash) {
  await RefreshTokenModel.updateOne({ tokenHash }, { revokedAt: new Date() });
}

module.exports = {
  UserModel,
  createUserWithPassword,
  findUserByEmail,
  findUserById,
  findUserByGoogleId,
  upsertGoogleUser,
  updateAvatarUrl,
  storeRefreshToken,
  findValidRefreshToken,
  revokeRefreshToken,
};

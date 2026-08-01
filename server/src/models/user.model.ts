import { pool } from "../config/db";
import type { User } from "../types/user";

function toUser(row: any): User {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    googleId: row.google_id,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createUserWithPassword(email: string, passwordHash: string): Promise<User> {
  const result = await pool.query(
    `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *`,
    [email, passwordHash],
  );
  return toUser(result.rows[0]);
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
  return result.rows[0] ? toUser(result.rows[0]) : null;
}

export async function findUserById(id: string): Promise<User | null> {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result.rows[0] ? toUser(result.rows[0]) : null;
}

export async function findUserByGoogleId(googleId: string): Promise<User | null> {
  const result = await pool.query(`SELECT * FROM users WHERE google_id = $1`, [googleId]);
  return result.rows[0] ? toUser(result.rows[0]) : null;
}

export async function upsertGoogleUser(params: {
  googleId: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
}): Promise<User> {
  const existingByGoogleId = await findUserByGoogleId(params.googleId);
  if (existingByGoogleId) return existingByGoogleId;

  const existingByEmail = await findUserByEmail(params.email);
  if (existingByEmail) {
    const result = await pool.query(
      `UPDATE users SET google_id = $2, display_name = COALESCE(display_name, $3), avatar_url = COALESCE(avatar_url, $4), updated_at = now()
       WHERE id = $1 RETURNING *`,
      [existingByEmail.id, params.googleId, params.displayName, params.avatarUrl],
    );
    return toUser(result.rows[0]);
  }

  const result = await pool.query(
    `INSERT INTO users (email, google_id, display_name, avatar_url) VALUES ($1, $2, $3, $4) RETURNING *`,
    [params.email, params.googleId, params.displayName, params.avatarUrl],
  );
  return toUser(result.rows[0]);
}

export async function updateAvatarUrl(userId: string, avatarUrl: string): Promise<User> {
  const result = await pool.query(
    `UPDATE users SET avatar_url = $2, updated_at = now() WHERE id = $1 RETURNING *`,
    [userId, avatarUrl],
  );
  return toUser(result.rows[0]);
}

export async function storeRefreshToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
    [userId, tokenHash, expiresAt],
  );
}

export interface RefreshTokenRow {
  id: string;
  userId: string;
}

export async function findValidRefreshToken(tokenHash: string): Promise<RefreshTokenRow | null> {
  const result = await pool.query(
    `SELECT id, user_id FROM refresh_tokens
     WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > now()`,
    [tokenHash],
  );
  const row = result.rows[0];
  return row ? { id: row.id, userId: row.user_id } : null;
}

export async function revokeRefreshToken(tokenHash: string): Promise<void> {
  await pool.query(`UPDATE refresh_tokens SET revoked_at = now() WHERE token_hash = $1`, [tokenHash]);
}

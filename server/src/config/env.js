require("dotenv/config");

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  corsOrigin: required("CORS_ORIGIN", "http://localhost:5173"),
  clientUrl: process.env.CLIENT_URL ?? required("CORS_ORIGIN", "http://localhost:5173"),
  mongoUri: required("MONGODB_URI"),
  redisUrl: required("REDIS_URL"),
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",
  githubToken: process.env.GITHUB_TOKEN ?? "",

  jwtAccessSecret: required("JWT_ACCESS_SECRET"),
  jwtRefreshSecret: required("JWT_REFRESH_SECRET"),
  jwtAccessTtl: process.env.JWT_ACCESS_TTL ?? "15m",
  jwtRefreshTtlDays: Number(process.env.JWT_REFRESH_TTL_DAYS ?? 30),

  googleClientId: process.env.GOOGLE_CLIENT_ID ?? "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL ?? `http://localhost:${process.env.PORT ?? 4000}/api/auth/google/callback`,

  r2AccountId: process.env.CLOUDFLARE_R2_ACCOUNT_ID ?? "",
  r2AccessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ?? "",
  r2SecretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ?? "",
  r2Bucket: process.env.CLOUDFLARE_R2_BUCKET ?? "",
  r2PublicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL ?? "",
};

const isProduction = env.nodeEnv === "production";

module.exports = { env, isProduction };

import "dotenv/config";

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  corsOrigin: required("CORS_ORIGIN", "http://localhost:5173"),
  databaseUrl: required("DATABASE_URL"),
  redisUrl: required("REDIS_URL"),
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",
  githubToken: process.env.GITHUB_TOKEN ?? "",
};

export const isProduction = env.nodeEnv === "production";

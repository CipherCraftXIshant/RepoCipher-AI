import IORedis from "ioredis";
import { env } from "./env";

// BullMQ requires maxRetriesPerRequest: null on connections it manages.
export const redis = new IORedis(env.redisUrl, {
  maxRetriesPerRequest: null,
});

export function createRedisConnection() {
  return new IORedis(env.redisUrl, { maxRetriesPerRequest: null });
}

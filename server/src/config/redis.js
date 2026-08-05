const IORedis = require("ioredis");
const { env } = require("./env");

// BullMQ requires maxRetriesPerRequest: null on connections it manages.
const redis = new IORedis(env.redisUrl, {
  maxRetriesPerRequest: null,
});

function createRedisConnection() {
  return new IORedis(env.redisUrl, { maxRetriesPerRequest: null });
}

module.exports = { redis, createRedisConnection };

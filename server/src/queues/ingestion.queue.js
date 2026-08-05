const { Queue } = require("bullmq");
const { createRedisConnection } = require("../config/redis");

const INGESTION_QUEUE_NAME = "repo-ingestion";

const ingestionQueue = new Queue(INGESTION_QUEUE_NAME, {
  connection: createRedisConnection(),
});

module.exports = { INGESTION_QUEUE_NAME, ingestionQueue };

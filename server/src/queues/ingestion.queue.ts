import { Queue } from "bullmq";
import { createRedisConnection } from "../config/redis";

export const INGESTION_QUEUE_NAME = "repo-ingestion";

export interface IngestionJobData {
  jobId: string;
  owner: string;
  repo: string;
}

export const ingestionQueue = new Queue<IngestionJobData>(INGESTION_QUEUE_NAME, {
  connection: createRedisConnection(),
});

import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "./logger";

mongoose.connection.on("error", (err) => {
  logger.error({ err }, "Unexpected error on MongoDB connection");
});

export async function connectDb(): Promise<void> {
  await mongoose.connect(env.mongoUri);
  logger.info("Connected to MongoDB");
}

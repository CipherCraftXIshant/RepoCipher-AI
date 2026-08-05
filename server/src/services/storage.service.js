const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const { randomUUID } = require("crypto");
const { env } = require("../config/env");

const client = new S3Client({
  region: "auto",
  endpoint: `https://${env.r2AccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.r2AccessKeyId,
    secretAccessKey: env.r2SecretAccessKey,
  },
});

async function uploadAvatar(userId, buffer, contentType) {
  const extension = contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
  const key = `avatars/${userId}/${randomUUID()}.${extension}`;

  await client.send(
    new PutObjectCommand({
      Bucket: env.r2Bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return `${env.r2PublicUrl.replace(/\/$/, "")}/${key}`;
}

module.exports = { uploadAvatar };

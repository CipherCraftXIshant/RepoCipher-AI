import "dotenv/config";
import { readFileSync } from "fs";
import path from "path";
import { Pool } from "pg";

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const sql = readFileSync(path.join(__dirname, "..", "migrations", "001_init.sql"), "utf-8");
  await pool.query(sql);
  await pool.end();
  console.log("Migrations applied.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

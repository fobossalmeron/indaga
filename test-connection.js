import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

console.log("🔍 Testing database connection...");
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool
  .connect()
  .then(() => {
    console.log("✅ Database connection successful");
    return pool.query("SELECT NOW() as current_time");
  })
  .then((result) => {
    console.log("✅ Query test successful:", result.rows[0]);
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    console.error("Full error:", err);
    process.exit(1);
  });

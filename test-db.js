const { Pool } = require("pg");
require("dotenv").config({ path: ".env" });

console.log("Testing database connection...");
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log(
  "DATABASE_URL preview:",
  process.env.DATABASE_URL?.slice(0, 50) + "...",
);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool
  .connect()
  .then(() => {
    console.log("✅ Database connection successful");
    return pool.query("SELECT NOW()");
  })
  .then((result) => {
    console.log("✅ Query test successful:", result.rows[0]);
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });

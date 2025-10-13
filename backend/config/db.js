import pg from "pg";
const { Pool } = pg;
import dotenv from "dotenv";
dotenv.config();

// PostgreSQL connection (adjust credentials)
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export default pool
import { Pool } from "pg";
import { config } from "../config/index.js";

const pool = new Pool({
  connectionString: config.DATABASE_URL,
  max: 10,
});

export default pool;

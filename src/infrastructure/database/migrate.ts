import pool from "./pg.client.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import DatabaseError from "../../shared/errors/database.error.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migration_history (
        name VARCHAR(255) PRIMARY KEY,
        executed_at TIMESTAMP DEFAULT NOW()
      );
    `);

    const migrationsDir = path.join(__dirname, "migrations");
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    for (const file of files) {
      const res = await pool.query(
        `SELECT 1 FROM migration_history WHERE name = $1`,
        [file],
      );
      const alreadyExecuted = res.rowCount !== null && res.rowCount > 0;

      if (alreadyExecuted) {
        console.log(`Skipping already executed: ${file}`);
        continue;
      }

      const fullPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(fullPath, "utf-8");
      const upMatch = sql.match(/-- UP\r?\n([\s\S]*?)\r?\n-- DOWN/);

      if (!upMatch) {
        throw new DatabaseError("MIGRATION_FILE_INVALID", `File: ${file}`);
      }
      const upSql = upMatch[1].trim();

      console.log(`Running: ${file}`);
      await pool.query(upSql);
      await pool.query(`INSERT INTO migration_history (name) VALUES ($1)`, [
        file,
      ]);
      console.log(`${file} executed successfully.`);
    }
    console.log("All migrations completed.");
  } catch (err) {
    if (err instanceof DatabaseError) {
      console.error(
        `❌ ${err.message}`,
        err.publicMessage ? ` (${err.publicMessage})` : "",
      );
    } else {
      console.error("❌ Unexpected error:", err);
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();

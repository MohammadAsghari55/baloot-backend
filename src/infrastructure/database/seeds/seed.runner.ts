import { PoolClient } from "pg";
import pool from "../pg.client.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import config from "../../config/env.index.js";
import { logger } from "../../logger/winston.index.js";

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);

interface SeederModule {
  seed: (client: PoolClient) => Promise<void>;
}

async function runSeeders(): Promise<void> {
  const seedsDir = dirName;

  const files = fs
    .readdirSync(seedsDir)
    .filter((f) => f.endsWith(".seed.ts") || f.endsWith(".seed.js"))
    .filter((f) => f !== "seed.runner.ts" && f !== "seed.runner.js")
    .sort();

  if (files.length === 0) {
    logger.info("No seed files found.");
    return;
  }

  logger.info(`Found ${files.length} seed files. Starting...`);

  const client = await pool.connect();

  try {
    for (const file of files) {
      const filePath = path.join(seedsDir, file);
      logger.info(`Running: ${file}`);

      if (file.startsWith("99-") && config.NODE_ENV !== "development") {
        logger.info(`Skipping ${file} (NODE_ENV !== development)`);
        continue;
      }

      const checkResult = await client.query<{ status: string }>(
        `SELECT status FROM seed_history WHERE name = $1`,
        [file],
      );

      if (
        checkResult.rows.length > 0 &&
        checkResult.rows[0].status === "success"
      ) {
        logger.info(`Skipping ${file} (already executed successfully)`);
        continue;
      }

      if (checkResult.rows.length === 0) {
        await client.query(
          `INSERT INTO seed_history (name, status) VALUES ($1, $2)`,
          [file, "pending"],
        );
      } else {
        await client.query(
          `UPDATE seed_history SET status = 'pending', executed_at = NOW() WHERE name = $1`,
          [file],
        );
      }

      try {
        const module = (await import(`file://${filePath}`)) as SeederModule;

        if (!module.seed) {
          logger.warn(`${file} does not export a "seed" function.`);
          await client.query(
            `UPDATE seed_history SET status = 'failed' WHERE name = $1`,
            [file],
          );
          continue;
        }

        await client.query("BEGIN");
        await module.seed(client);
        await client.query("COMMIT");

        await client.query(
          `UPDATE seed_history SET status = 'success', executed_at = NOW() WHERE name = $1`,
          [file],
        );

        logger.info(`${file} completed successfully.`);
      } catch (error) {
        await client.query("ROLLBACK");
        logger.error(`${file} failed:`, error);

        await client.query(
          `UPDATE seed_history SET status = 'failed' WHERE name = $1`,
          [file],
        );
      }
    }

    logger.info("All seeders processed.");
  } catch (error) {
    logger.error("❌ Seeding process failed:", error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runSeeders();

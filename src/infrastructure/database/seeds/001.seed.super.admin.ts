import { PoolClient } from "pg";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import config from "../../config/env.index.js";
import { logger } from "../../logger/winston.index.js";

export async function seed(client: PoolClient): Promise<void> {
  const adminUsername = config.ADMIN_USERNAME;
  const adminPassword = config.ADMIN_PASSWORD;
  const adminEmail = config.ADMIN_EMAIL;
  const adminRole = "super_admin";

  if (!adminPassword) {
    logger.warn("ADMIN_PASSWORD not set, skipping admin seed.");
    return;
  }

  const checkResult = await client.query(
    `SELECT id FROM users WHERE username = $1 OR email = $2`,
    [adminUsername, adminEmail],
  );

  if (checkResult.rows.length > 0) {
    logger.info("Admin user already exists. Skipping seed.");
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const userId = randomUUID();

  await client.query(
    `INSERT INTO users (
      id, role, email, username, password_hash,
      token_version, is_email_verified, created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      userId,
      adminRole,
      adminEmail,
      adminUsername,
      hashedPassword,
      1,
      true,
      new Date(),
      new Date(),
    ],
  );

  await client.query(
    `INSERT INTO password_history (id, user_id, password_hash, created_at)
     VALUES ($1, $2, $3, $4)`,
    [randomUUID(), userId, hashedPassword, new Date()],
  );

  logger.info("Admin user seeded successfully.");
}

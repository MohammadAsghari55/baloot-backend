import cron from "node-cron";
import config from "./infrastructure/config/env.index.js";
import { tokenManagementApplicationService } from "./container.js";
import { logger } from "./infrastructure/logger/winston.index.js";

const schedule = config.CRON_SCHEDULE || "0 3 * * *";
const batchSize = config.CLEANUP_BATCH_SIZE || 1000;

function cleanExpiredAndRevokedTokens() {
  cron.schedule(schedule, async () => {
    logger.info("Cleaning expired and revoked refresh tokens...");

    try {
      const count =
        await tokenManagementApplicationService.cleanExpiredAndRevokedTokens(
          batchSize,
        );

      logger.info(`Cleanup completed: ${count} tokens removed.`);
    } catch (error) {
      logger.error("Cleanup failed:", error);
    }
  });
}

export default cleanExpiredAndRevokedTokens;

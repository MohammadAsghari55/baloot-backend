import cron from "node-cron";
import config from "./infrastructure/config/env.index.js";
import { tokenManagementApplicationService } from "./container.js";

const schedule = config.CRON_SCHEDULE || "0 3 * * *";
const batchSize = config.CLEANUP_BATCH_SIZE || 1000;

function cleanExpiredAndRevokedTokens() {
  cron.schedule(schedule, async () => {
    console.log("🧹 Cleaning expired and revoked refresh tokens...");
    try {
      const count =
        await tokenManagementApplicationService.cleanExpiredAndRevokedTokens(
          batchSize,
        );

      console.log(`✅ Cleanup completed: ${count} tokens removed.`);
    } catch (error) {
      console.error("❌ Cleanup failed:", error);
    }
  });
}

export default cleanExpiredAndRevokedTokens;

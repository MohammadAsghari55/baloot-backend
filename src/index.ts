import { app } from "./app.js";
import cleanExpiredAndRevokedTokens from "./db.cleanup.js";
import config from "./infrastructure/config/env.index.js";
import { logger } from "./infrastructure/logger/winston.index.js";

const PORT = config.PORT;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);

  if (config.NODE_ENV === "production") {
    cleanExpiredAndRevokedTokens();
  }
});

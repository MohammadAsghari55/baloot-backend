import { tokenService } from "./infrastructure/services/services.index.js";
import tokenExtractorMiddleware from "./middlewares/token.extractor.middleware.js";
import redisService from "./infrastructure/redis/redis.service.js";
import accessCheckerMiddleware from "./middlewares/access.checker.middleware.js";

const extractorMiddleware = tokenExtractorMiddleware(tokenService);
const AccessCheckerMiddleware = accessCheckerMiddleware(redisService);

export { extractorMiddleware, AccessCheckerMiddleware };

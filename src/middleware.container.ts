import {
  tokenService,
  sessionService,
} from "./infrastructure/services/services.index.js";
import { tokenManagementApplicationService } from "./container.js";
import tokenExtractorMiddleware from "./middlewares/token.extractor.middleware.js";
import accessCheckerMiddleware from "./middlewares/access.checker.middleware.js";

const extractorMiddleware = tokenExtractorMiddleware(tokenService);
const AccessCheckerMiddleware = accessCheckerMiddleware(
  sessionService,
  tokenManagementApplicationService,
);

export { extractorMiddleware, AccessCheckerMiddleware };

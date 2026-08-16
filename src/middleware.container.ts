import {
  tokenService,
  sessionService,
} from "./infrastructure/services/services.index.js";

import {
  tokenManagementApplicationService,
  userApplicationService,
} from "./container.js";

import tokenExtractorMiddleware from "./middlewares/token.extractor.middleware.js";
import accessCheckerMiddleware from "./middlewares/access.checker.middleware.js";

const extractorMiddleware = tokenExtractorMiddleware(tokenService);

const AccessCheckerMiddleware = accessCheckerMiddleware(
  userApplicationService,
  tokenManagementApplicationService,
  sessionService,
);

export { extractorMiddleware, AccessCheckerMiddleware };

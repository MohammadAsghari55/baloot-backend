import pool from "../../../infrastructure/database/pg.client.js";

// ---------- Repositories ----------
import EmailVerificationPgRepository from "../../../infrastructure/repositories/email.verification.pg.repository.js";
import PasswordHistoryPgRepository from "../../../infrastructure/repositories/password.history.pg.repository.js";
import RefreshTokenPgRepository from "../../../infrastructure/repositories/refresh.token.pg.repository.js";
import UserPgRepository from "../../../infrastructure/repositories/user.pg.repository.js";

// ---------- Services ----------
import EmailOrchestrationService from "./email.orchestration.service.js";
import EmailVerificationApplicationService from "./email.verification.application.service.js";
import PasswordHistoryApplicationService from "./password.history.application.service.js";
import SessionManagementApplicationService from "./session.management.application.service.js";
import TokenManagementApplicationService from "./token.management.application.service.js";
import UserApplicationService from "./user.application.service.js";

import {
  emailService,
  sessionService,
} from "../../../infrastructure/services/infrastructure.services.index.js";

import redisService from "../../../infrastructure/redis/redis.service.js";

const emailVerificationPgRepository = new EmailVerificationPgRepository();
const passwordHistoryPgRepository = new PasswordHistoryPgRepository();
const refreshTokenPgRepository = new RefreshTokenPgRepository(pool);
const userRepository = new UserPgRepository(pool);

export const emailOrchestrationService = new EmailOrchestrationService(
  emailService,
);
export const emailVerificationApplicationService =
  new EmailVerificationApplicationService(emailVerificationPgRepository);

export const passwordHistoryApplicationService =
  new PasswordHistoryApplicationService(passwordHistoryPgRepository);

export const sessionManagementApplicationService =
  new SessionManagementApplicationService(sessionService);

export const tokenManagementApplicationService =
  new TokenManagementApplicationService(refreshTokenPgRepository, redisService);

export const userApplicationService = new UserApplicationService(
  userRepository,
);

import { buildUserModule } from "../../domains/user/user.index.js";
import PgTransactionManager from "../../infrastructure/database/pg.transaction.manager.js";
import pool from "../../infrastructure/database/pg.client.js";
import {
  bcryptService,
  emailService,
  tokenService,
} from "../../infrastructure/services/services.index.js";
import EmailOrchestrationService from "./services/email.orchestration.service.js";
import RefreshTokenRepository from "../../infrastructure/repositories/refresh.token.pg.repository.js";
import TokenManagementApplicationService from "./services/token.management.application.service.js";
import EmailVerificationRepository from "../../infrastructure/repositories/email.verification.pg.repository.js";
import EmailVerificationApplicationService from "./services/email.verification.application.service.js";
import redisService from "../../infrastructure/redis/redis.service.js";
import SessionManagementApplicationService from "./services/session.management.application.service.js";
import SessionService from "../../infrastructure/services/session.service.js";

import LoginUseCase from "./usecases/login.usecase.js";
import RefreshTokenUseCase from "./usecases/refresh.token.usecase.js";
import RegisterAdminUseCase from "./usecases/register.admin.usecase.js";
import RegisterUserUseCase from "./usecases/register.user.usecase.js";
import ResendVerificationUseCase from "./usecases/resend.verification.usecase.js";
import LogoutUseCase from "./usecases/logout.usecase.js";
import ChangePasswordUseCase from "./usecases/change.password.usecase.js";

import AdminController from "../../api/v1/admin/admin.controller.js";
import UserController from "../../api/v1/user/user.controller.js";
import AuthController from "../../api/v1/common/auth/auth.controller.js";

function buildAuthModule() {
  const { userApplicationService, userDomainService } = buildUserModule();

  const transactionManager = new PgTransactionManager(pool);
  const emailOrchestrationService = new EmailOrchestrationService(emailService);

  const refreshTokenRepository = new RefreshTokenRepository(pool);
  const tokenManagementApplicationService =
    new TokenManagementApplicationService(refreshTokenRepository);

  const emailVerificationRepository = new EmailVerificationRepository(pool);
  const emailVerificationApplicationService =
    new EmailVerificationApplicationService(emailVerificationRepository);

  const sessionService = new SessionService(redisService);
  const sessionManagementApplicationService =
    new SessionManagementApplicationService(sessionService);

  const registerAdminUseCase = new RegisterAdminUseCase(
    transactionManager,
    userDomainService,
    userApplicationService,
    bcryptService,
    emailOrchestrationService,
    emailVerificationApplicationService,
  );

  const registerUserUseCase = new RegisterUserUseCase(
    transactionManager,
    userDomainService,
    userApplicationService,
    bcryptService,
    emailOrchestrationService,
    emailVerificationApplicationService,
  );

  const loginUseCase = new LoginUseCase(
    transactionManager,
    userApplicationService,
    bcryptService,
    tokenService,
    tokenManagementApplicationService,
    emailVerificationApplicationService,
    sessionService,
  );

  const refreshTokenUseCase = new RefreshTokenUseCase(
    transactionManager,
    bcryptService,
    tokenService,
    tokenManagementApplicationService,
    sessionService,
  );

  const resendVerificationUseCase = new ResendVerificationUseCase(
    transactionManager,
    userApplicationService,
    emailOrchestrationService,
    emailVerificationApplicationService,
  );

  const logoutUseCase = new LogoutUseCase(
    transactionManager,
    tokenManagementApplicationService,
    sessionManagementApplicationService,
  );

  const changePasswordUseCase = new ChangePasswordUseCase(
    transactionManager,
    userApplicationService,
    bcryptService,
    emailOrchestrationService,
    tokenManagementApplicationService,
    sessionManagementApplicationService,
  );

  const adminController = new AdminController(registerAdminUseCase);

  const userController = new UserController(registerUserUseCase);

  const authController = new AuthController(
    loginUseCase,
    logoutUseCase,
    resendVerificationUseCase,
    changePasswordUseCase,
    refreshTokenUseCase,
  );

  return {
    adminController,
    userController,
    authController,
  };
}

export default buildAuthModule;

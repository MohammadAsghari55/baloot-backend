import { buildUserModule } from "../../domains/user/user.index.js";
import PgTransactionManager from "../../infrastructure/database/pg.transaction.manager.js";
import pool from "../../infrastructure/database/pg.client.js";
import config from "../../infrastructure/config/env.index.js";

import {
  bcryptService,
  emailService,
  tokenService,
  sessionService,
  registerAdminService,
} from "../../infrastructure/services/services.index.js";
import EmailOrchestrationService from "./services/email.orchestration.service.js";
import RefreshTokenPgRepository from "../../infrastructure/repositories/refresh.token.pg.repository.js";
import TokenManagementApplicationService from "./services/token.management.application.service.js";
import EmailVerificationPgRepository from "../../infrastructure/repositories/email.verification.pg.repository.js";
import EmailVerificationApplicationService from "./services/email.verification.application.service.js";
import SessionManagementApplicationService from "./services/session.management.application.service.js";
import PasswordHistoryApplicationService from "./services/password.history.application.service.js";
import PasswordHistoryPgRepository from "../../infrastructure/repositories/password.history.pg.repository.js";

import LoginUseCase from "./usecases/login.usecase.js";
import RefreshTokenUseCase from "./usecases/refresh.token.usecase.js";
import RegisterAdminUseCase from "./usecases/register.admin.usecase.js";
import VerifyRegisterAdminUseCase from "./usecases/verify.register.admin.usecase.js";
import ResendAdminVerificationUseCase from "./usecases/resend.admin.verification.usecase.js";
import RegisterUserUseCase from "./usecases/register.user.usecase.js";
import ResendVerificationUseCase from "./usecases/resend.verification.usecase.js";
import LogoutUseCase from "./usecases/logout.usecase.js";
import ChangePasswordUseCase from "./usecases/change.password.usecase.js";

import AdminController from "../../api/v1/admin/admin.controller.js";
import UserController from "../../api/v1/user/user.controller.js";
import AuthController from "../../api/v1/common/auth/auth.controller.js";
import redisService from "../../infrastructure/redis/redis.service.js";

function buildAuthModule() {
  const { userApplicationService, userDomainService } = buildUserModule();

  const transactionManager = new PgTransactionManager(pool);
  const emailOrchestrationService = new EmailOrchestrationService(emailService);

  const refreshTokenPgRepository = new RefreshTokenPgRepository(pool);
  const tokenManagementApplicationService =
    new TokenManagementApplicationService(
      refreshTokenPgRepository,
      redisService,
    );

  const emailVerificationPgRepository = new EmailVerificationPgRepository();
  const emailVerificationApplicationService =
    new EmailVerificationApplicationService(emailVerificationPgRepository);

  const sessionManagementApplicationService =
    new SessionManagementApplicationService(sessionService);

  const passwordHistoryPgRepository = new PasswordHistoryPgRepository();
  const passwordHistoryApplicationService =
    new PasswordHistoryApplicationService(passwordHistoryPgRepository);

  const registerAdminUseCase = new RegisterAdminUseCase(
    userDomainService,
    userApplicationService,
    bcryptService,
    emailOrchestrationService,
    registerAdminService,
  );

  const verifyRegisterAdminUseCase = new VerifyRegisterAdminUseCase(
    transactionManager,
    userDomainService,
    userApplicationService,
    bcryptService,
    emailOrchestrationService,
    emailVerificationApplicationService,
    passwordHistoryApplicationService,
    registerAdminService,
    config.MAX_ADMINS,
  );

  const resendAdminVerificationUseCase = new ResendAdminVerificationUseCase(
    userApplicationService,
    emailOrchestrationService,
    registerAdminService,
  );

  const registerUserUseCase = new RegisterUserUseCase(
    transactionManager,
    userDomainService,
    userApplicationService,
    bcryptService,
    emailOrchestrationService,
    emailVerificationApplicationService,
    passwordHistoryApplicationService,
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
    userApplicationService,
    tokenService,
    tokenManagementApplicationService,
    sessionService,
  );

  const resendVerificationUseCase = new ResendVerificationUseCase(
    transactionManager,
    userApplicationService,
    bcryptService,
    emailOrchestrationService,
    emailVerificationApplicationService,
  );

  const logoutUseCase = new LogoutUseCase(
    transactionManager,
    userApplicationService,
    tokenManagementApplicationService,
    sessionManagementApplicationService,
    sessionService,
  );

  const changePasswordUseCase = new ChangePasswordUseCase(
    transactionManager,
    userApplicationService,
    bcryptService,
    emailOrchestrationService,
    tokenManagementApplicationService,
    passwordHistoryApplicationService,
    sessionService,
  );

  const adminController = new AdminController(
    registerAdminUseCase,
    verifyRegisterAdminUseCase,
    resendAdminVerificationUseCase,
  );

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
    userApplicationService,
    tokenManagementApplicationService,
  };
}

export default buildAuthModule;

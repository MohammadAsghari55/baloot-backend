import { buildUserModule } from "../../domains/user/user.index.js";
import PgTransactionManager from "../../infrastructure/database/pg.transaction.manager.js";
import pool from "../../infrastructure/database/pg.client.js";
import {
  bcryptService,
  emailService,
  tokenService,
  sessionService,
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

  const refreshTokenPgRepository = new RefreshTokenPgRepository(pool);
  const tokenManagementApplicationService =
    new TokenManagementApplicationService(refreshTokenPgRepository);

  const emailVerificationPgRepository = new EmailVerificationPgRepository(pool);
  const emailVerificationApplicationService =
    new EmailVerificationApplicationService(emailVerificationPgRepository);

  const sessionManagementApplicationService =
    new SessionManagementApplicationService(sessionService);

  const passwordHistoryPgRepository = new PasswordHistoryPgRepository();
  const passwordHistoryApplicationService =
    new PasswordHistoryApplicationService(passwordHistoryPgRepository);

  const registerAdminUseCase = new RegisterAdminUseCase(
    transactionManager,
    userDomainService,
    userApplicationService,
    bcryptService,
    emailOrchestrationService,
    emailVerificationApplicationService,
    passwordHistoryApplicationService,
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
    passwordHistoryApplicationService,
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
    tokenManagementApplicationService,
  };
}

export default buildAuthModule;

import { buildUserModule } from "../../domains/user/user.index.js";
import PgTransactionManager from "../../infrastructure/database/pg.transaction.manager.js";
import pool from "../../infrastructure/database/pg.client.js";
import {
  bcryptService,
  emailService,
  tokenService,
} from "../../infrastructure/services/services.index.js";
import VerificationService from "./services/verification.service.js";
import RefreshTokenRepository from "../../infrastructure/repositories/refresh.token.pg.repository.js";
import TokenManagementApplicationService from "./services/token.management.application.service.js";
import EmailVerificationRepository from "../../infrastructure/repositories/email.verification.pg.repository.js";
import EmailVerificationApplicationService from "./services/email.verification.application.service.js";

import LoginUseCase from "./usecases/login.usecase.js";
import RefreshTokenUseCase from "./usecases/refresh.token.usecase.js";
import RegisterAdminUseCase from "./usecases/register.admin.usecase.js";
import RegisterUserUseCase from "./usecases/register.user.usecase.js";
import ResendVerificationUseCase from "./usecases/resend.verification.usecase.js";
import LogoutUseCase from "./usecases/logout.usecase.js";

import AdminController from "../../api/v1/admin/admin.controller.js";
import UserController from "../../api/v1/user/user.controller.js";
import AuthController from "../../api/v1/common/auth/auth.controller.js";

function buildAuthModule() {
  const { userApplicationService, userDomainService } = buildUserModule();

  const transactionManager = new PgTransactionManager(pool);
  const verificationService = new VerificationService(emailService);

  const refreshTokenRepository = new RefreshTokenRepository(pool);
  const tokenManagementApplicationService =
    new TokenManagementApplicationService(refreshTokenRepository);

  const emailVerificationRepository = new EmailVerificationRepository(pool);
  const emailVerificationApplicationService =
    new EmailVerificationApplicationService(emailVerificationRepository);

  const registerAdminUseCase = new RegisterAdminUseCase(
    transactionManager,
    userDomainService,
    userApplicationService,
    bcryptService,
    verificationService,
    emailVerificationApplicationService,
  );

  const registerUserUseCase = new RegisterUserUseCase(
    transactionManager,
    userDomainService,
    userApplicationService,
    bcryptService,
    verificationService,
    emailVerificationApplicationService,
  );

  const loginUseCase = new LoginUseCase(
    transactionManager,
    userApplicationService,
    bcryptService,
    tokenService,
    tokenManagementApplicationService,
    emailVerificationApplicationService,
  );

  const refreshTokenUseCase = new RefreshTokenUseCase(
    transactionManager,
    bcryptService,
    tokenService,
    tokenManagementApplicationService,
  );

  const resendVerificationUseCase = new ResendVerificationUseCase(
    transactionManager,
    userApplicationService,
    verificationService,
    emailVerificationApplicationService,
  );

  const logoutUseCase = new LogoutUseCase(
    transactionManager,
    tokenManagementApplicationService,
  );

  const adminController = new AdminController(
    registerAdminUseCase,
    refreshTokenUseCase,
  );

  const userController = new UserController(
    registerUserUseCase,
    refreshTokenUseCase,
  );

  const authController = new AuthController(
    loginUseCase,
    logoutUseCase,
    resendVerificationUseCase,
  );

  return {
    adminController,
    userController,
    authController,
  };
}

export default buildAuthModule;

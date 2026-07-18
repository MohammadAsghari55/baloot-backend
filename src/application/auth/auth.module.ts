import { buildUserModule } from "../../domains/user/user.index.js";
import PgTransactionManager from "../../infrastructure/database/pg.transaction.manager.js";
import pool from "../../infrastructure/database/pg.client.js";
import {
  bcryptService,
  emailService,
  tokenService,
} from "../../infrastructure/services/services.index.js";
import VerificationService from "../../application/auth/services/verification.service.js";
import RefreshTokenRepository from "../../infrastructure/repositories/refresh.token.pg.repository.js";
import TokenManagementApplicationService from "./services/token.management.application.service.js";
import EmailVerificationRepository from "../../infrastructure/repositories/email.verification.pg.repository.js";

import LoginUseCase from "./usecases/login.usecase.js";
import RefreshTokenUseCase from "./usecases/refresh.token.usecase.js";
import RegisterAdminUseCase from "./usecases/register.admin.usecase.js";
import RegisterUserUseCase from "./usecases/register.user.usecase.js";
import ResendVerificationUseCase from "./usecases/resend.verification.usecase.js";
import LogoutUseCase from "./usecases/logout.usecase.js";

import AdminAuthController from "../../api/v1/admin/auth/admin.auth.controller.js";
import UserAuthController from "../../api/v1/user/auth/user.auth.controller.js";
import ResendVerificationController from "../../api/v1/common/resendVerification/resend.verification.controller.js";

function buildAuthModule() {
  const { userApplicationService, userDomainService } = buildUserModule();

  const transactionManager = new PgTransactionManager(pool);
  const verificationService = new VerificationService(emailService);
  const refreshTokenRepository = new RefreshTokenRepository(pool);
  const tokenManagementApplicationService =
    new TokenManagementApplicationService(refreshTokenRepository);
  const emailVerificationRepository = new EmailVerificationRepository(pool);

  const registerAdminUseCase = new RegisterAdminUseCase(
    transactionManager,
    userDomainService,
    userApplicationService,
    bcryptService,
    verificationService,
    emailVerificationRepository,
  );

  const registerUserUseCase = new RegisterUserUseCase(
    transactionManager,
    userDomainService,
    userApplicationService,
    bcryptService,
    verificationService,
    emailVerificationRepository,
  );

  const loginUseCase = new LoginUseCase(
    transactionManager,
    userApplicationService,
    bcryptService,
    tokenService,
    tokenManagementApplicationService,
    emailVerificationRepository,
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
    emailVerificationRepository,
  );

  const logoutUseCase = new LogoutUseCase(
    transactionManager,
    tokenManagementApplicationService,
  );

  const adminAuthController = new AdminAuthController(
    registerAdminUseCase,
    loginUseCase,
    refreshTokenUseCase,
    logoutUseCase,
  );

  const userAuthController = new UserAuthController(
    registerUserUseCase,
    loginUseCase,
    refreshTokenUseCase,
    logoutUseCase,
  );

  const resendVerificationController = new ResendVerificationController(
    resendVerificationUseCase,
  );

  return {
    adminAuthController,
    userAuthController,
    resendVerificationController,
  };
}

export default buildAuthModule;

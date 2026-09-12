import pool from "../../infrastructure/database/pg.client.js";
import config from "../../infrastructure/config/env.index.js";
import PgTransactionManager from "../../infrastructure/database/pg.transaction.manager.js";

// ---------- Services ----------
import {
  bcryptService,
  tokenService,
  sessionService,
  registerAdminService,
  forgetPasswordService,
} from "../../infrastructure/services/infrastructure.services.index.js";

import {
  emailOrchestrationService,
  emailVerificationApplicationService,
  passwordHistoryApplicationService,
  sessionManagementApplicationService,
  tokenManagementApplicationService,
  userApplicationService,
} from "./services/application.services.index.js";

import UserDomainService from "../../domains/user/services/user.domain.service.js";

// ---------- UseCases ----------
import LoginUseCase from "./usecases/login.usecase.js";
import RefreshTokenUseCase from "./usecases/refresh.token.usecase.js";
import RegisterAdminUseCase from "./usecases/register.admin.usecase.js";
import VerifyRegisterAdminUseCase from "./usecases/verify.register.admin.usecase.js";
import ResendAdminVerificationUseCase from "./usecases/resend.admin.verification.usecase.js";
import RegisterUserUseCase from "./usecases/register.user.usecase.js";
import ResendVerificationUseCase from "./usecases/resend.verification.usecase.js";
import LogoutUseCase from "./usecases/logout.usecase.js";
import ChangePasswordUseCase from "./usecases/change.password.usecase.js";
import ForgetPasswordUseCase from "./usecases/forget.password.usecase.js";
import ResetPasswordUseCase from "./usecases/reset.password.usecase.js";
import CompleteProfileUseCase from "./usecases/complete.profile.usecase.js";

// ---------- Controllers ----------
import AdminController from "../../api/v1/admin/admin.controller.js";
import AuthController from "../../api/v1/common/auth/auth.controller.js";
import UserController from "../../api/v1/user/user.controller.js";

function buildAuthModule() {
  const transactionManager = new PgTransactionManager(pool);

  const userDomainService = new UserDomainService();

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
    config.EXPIRE_TIME * 1000,
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
    config.EXPIRE_TIME * 1000,
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
    config.EXPIRE_TIME * 1000,
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

  const forgetPasswordUseCase = new ForgetPasswordUseCase(
    userApplicationService,
    bcryptService,
    emailOrchestrationService,
    forgetPasswordService,
  );

  const resetPasswordUseCase = new ResetPasswordUseCase(
    transactionManager,
    userApplicationService,
    bcryptService,
    emailOrchestrationService,
    tokenManagementApplicationService,
    passwordHistoryApplicationService,
    sessionService,
    forgetPasswordService,
  );

  const completeProfileUseCase = new CompleteProfileUseCase(
    transactionManager,
    userApplicationService,
    tokenManagementApplicationService,
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
    forgetPasswordUseCase,
    resetPasswordUseCase,
    completeProfileUseCase,
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

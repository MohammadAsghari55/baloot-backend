import { buildUserModule } from "../../domains/user/index.js";
import RefreshTokenRepository from "../../infrastructure/repositories/refresh.token.pg.repository.js";
import TokenService from "../../infrastructure/services/token.service.js";
import PgTransactionManager from "../../infrastructure/database/pg.transaction.manager.js";
import pool from "../../infrastructure/database/pg.client.js";
import BcryptService from "../../infrastructure/services/bcrypt.service.js";

import LoginUseCase from "./usecases/login.usecase.js";
import RefreshTokenUseCase from "./usecases/refresh.token.usecase.js";
import RegisterAdminUseCase from "./usecases/register.admin.usecase.js";
import RegisterUserUseCase from "./usecases/register.user.usecase.js";

import AdminAuthController from "../../api/v1/admin/auth/admin.auth.controller.js";
import UserAuthController from "../../api/v1/user/auth/user.auth.controller.js";

function buildAuthModule() {
  const { userApplicationService, userDomainService } = buildUserModule();

  const bcryptService = new BcryptService();
  const refreshTokenRepository = new RefreshTokenRepository(pool);
  const tokenService = new TokenService(bcryptService);
  const transactionManager = new PgTransactionManager(pool);

  const registerAdminUseCase = new RegisterAdminUseCase(
    userApplicationService,
    userDomainService,
    transactionManager,
    bcryptService,
  );
  const registerUserUseCase = new RegisterUserUseCase(
    userApplicationService,
    userDomainService,
    transactionManager,
    bcryptService,
  );
  const loginUseCase = new LoginUseCase(
    userApplicationService,
    tokenService,
    refreshTokenRepository,
    bcryptService,
    transactionManager,
  );
  const refreshTokenUseCase = new RefreshTokenUseCase(
    tokenService,
    refreshTokenRepository,
    bcryptService,
    transactionManager,
  );

  const adminAuthController = new AdminAuthController(
    registerAdminUseCase,
    loginUseCase,
    refreshTokenUseCase,
  );
  const userAuthController = new UserAuthController(
    registerUserUseCase,
    loginUseCase,
    refreshTokenUseCase,
  );

  return {
    adminAuthController,
    userAuthController,
  };
}

export default buildAuthModule;

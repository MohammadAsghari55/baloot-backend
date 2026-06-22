import { buildUserModule } from "../../domains/user/user.index.js";
import RefreshTokenRepository from "../../infrastructure/repositories/refresh.token.pg.repository.js";
import PgTransactionManager from "../../infrastructure/database/pg.transaction.manager.js";
import pool from "../../infrastructure/database/pg.client.js";
import {
  bcryptService,
  tokenService,
} from "../../infrastructure/services/services.index.js";

import LoginUseCase from "./usecases/login.usecase.js";
import RefreshTokenUseCase from "./usecases/refresh.token.usecase.js";
import RegisterAdminUseCase from "./usecases/register.admin.usecase.js";
import RegisterUserUseCase from "./usecases/register.user.usecase.js";

import AdminAuthController from "../../api/v1/admin/auth/admin.auth.controller.js";
import UserAuthController from "../../api/v1/user/auth/user.auth.controller.js";

function buildAuthModule() {
  const { userApplicationService, userDomainService } = buildUserModule();

  const refreshTokenRepository = new RefreshTokenRepository(pool);
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

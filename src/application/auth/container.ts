import AdminAuthController from "../../api/v1/admin/auth/admin.auth.controller.js";
import UserAuthController from "../../api/v1/user/auth/user.auth.controller.js";
import RegisterAdminUseCase from "./usecases/register.admin.usecase.js";
import RegisterUserUseCase from "./usecases/register.user.usecase.js";
import LoginUseCase from "./usecases/login.usecase.js";
import RefreshTokenUseCase from "./usecases/refresh.token.usecase.js";
import UserService from "../../domains/user/services/user.service.js";
import BcryptService from "../../infrastructure/services/bcrypt.service.js";
import TokenService from "../../infrastructure/services/token.service.js";
import UserPgRepository from "../../infrastructure/repositories/user.pg.repository.js";
import RefreshTokenRepository from "../../infrastructure/repositories/refresh.token.pg.repository.js";
import pool from "../../infrastructure/database/pg.client.js";
import PgTransactionManager from "../../infrastructure/database/pg.transaction.manager.js";

const userPgRepository = new UserPgRepository(pool);
const refreshTokenRepository = new RefreshTokenRepository(pool);
const bcryptService = new BcryptService();
const tokenService = new TokenService(bcryptService);
const userService = new UserService(userPgRepository, bcryptService);
const transactionManager = new PgTransactionManager(pool);
const registerAdminUseCase = new RegisterAdminUseCase(
  userService,
  transactionManager,
);
const registerUserUseCase = new RegisterUserUseCase(
  userService,
  transactionManager,
);
const loginUseCase = new LoginUseCase(
  userService,
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
export const adminAuthController = new AdminAuthController(
  registerAdminUseCase,
  loginUseCase,
  refreshTokenUseCase,
);
export const userAuthController = new UserAuthController(
  registerUserUseCase,
  loginUseCase,
  refreshTokenUseCase,
);

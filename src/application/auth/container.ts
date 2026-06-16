import AdminAuthController from "../../api/v1/admin/auth/admin.auth.controller.js";
import UserAuthController from "../../api/v1/user/auth/user.auth.controller.js";
import RegisterAdminUseCase from "./usecases/register.admin.usecase.js";
import RegisterUserUseCase from "./usecases/register.user.usecase.js";
import UserService from "../../domains/user/services/user.service.js";
import UserPgRepository from "../../infrastructure/repositories/user.pg.repository.js";
import pool from "../../infrastructure/database/pg.client.js";
import LoginUseCase from "./usecases/login.usecase.js";
import BcryptService from "../../infrastructure/services/bcrypt.service.js";
import TokenService from "../../infrastructure/services/token.service.js";
import RefreshTokenRepository from "../../infrastructure/repositories/refresh.token.pg.repository.js";

const userPgRepository = new UserPgRepository(pool);
const bcryptService = new BcryptService();
const tokenService = new TokenService(bcryptService);
const userService = new UserService(userPgRepository, bcryptService);
const registerAdminUseCase = new RegisterAdminUseCase(userService);
const registerUserUseCase = new RegisterUserUseCase(userService);
const refreshTokenRepository = new RefreshTokenRepository(pool);
const loginUseCase = new LoginUseCase(
  userService,
  tokenService,
  refreshTokenRepository,
  bcryptService,
);
export const adminAuthController = new AdminAuthController(
  registerAdminUseCase,
  loginUseCase,
);
export const userAuthController = new UserAuthController(
  registerUserUseCase,
  loginUseCase,
);

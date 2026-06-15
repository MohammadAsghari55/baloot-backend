import AdminAuthController from "../../api/v1/admin/auth/admin.auth.controller.js";
import UserAuthController from "../../api/v1/user/auth/user.auth.controller.js";
import RegisterAdminUseCase from "./usecases/register.admin.usecase.js";
import RegisterUserUseCase from "./usecases/register.user.usecase.js";
import UserService from "../../domains/user/services/user.service.js";
import UserPgRepository from "../../infrastructure/repositories/user.pg.repository.js";
import pool from "../../infrastructure/database/pg.client.js";
import BcryptService from "../../infrastructure/services/bcrypt.service.js";

const userPgRepository = new UserPgRepository(pool);
const bcryptService = new BcryptService();
const userService = new UserService(userPgRepository, bcryptService);
const registerAdminUseCase = new RegisterAdminUseCase(userService);
const registerUserUseCase = new RegisterUserUseCase(userService);
export const adminAuthController = new AdminAuthController(
  registerAdminUseCase,
);
export const userAuthController = new UserAuthController(registerUserUseCase);

import AuthController from "../../api/v1/auth/auth.controller.js";
import RegisterUserUseCase from "./usecases/register.user.usecase.js";
import UserService from "../../domains/user/services/user.service.js";
import UserPgRepository from "../../infrastructure/repositories/user.pg.repository.js";
import pool from "../../infrastructure/database/pg.client.js";

const userPgRepository = new UserPgRepository(pool);
const userService = new UserService(userPgRepository);
const registerUserUseCase = new RegisterUserUseCase(userService);
const authController = new AuthController(registerUserUseCase);

export default authController;

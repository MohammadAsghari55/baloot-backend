import UserPgRepository from "../../infrastructure/repositories/user.pg.repository.js";
import BcryptService from "../../infrastructure/services/bcrypt.service.js";
import UserService from "./services/user.service.js";
import pool from "../../infrastructure/database/pg.client.js";

function buildUserModule() {
  const userRepository = new UserPgRepository(pool);
  const bcryptService = new BcryptService();
  const userService = new UserService(userRepository, bcryptService);

  return {
    userService,
    userRepository,
    bcryptService,
  };
}

export default buildUserModule;

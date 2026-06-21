import UserPgRepository from "../../infrastructure/repositories/user.pg.repository.js";
import UserService from "./services/user.service.js";
import pool from "../../infrastructure/database/pg.client.js";

function buildUserModule() {
  const userRepository = new UserPgRepository(pool);
  const userService = new UserService(userRepository);

  return {
    userService,
    userRepository,
  };
}

export default buildUserModule;

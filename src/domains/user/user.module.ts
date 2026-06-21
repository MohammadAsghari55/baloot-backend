import UserPgRepository from "../../infrastructure/repositories/user.pg.repository.js";
import UserApplicationService from "../../application/auth/services/user.application.service.js";
import UserDomainService from "./services/user.domain.service.js";
import pool from "../../infrastructure/database/pg.client.js";

function buildUserModule() {
  const userRepository = new UserPgRepository(pool);
  const userApplicationService = new UserApplicationService(userRepository);
  const userDomainService = new UserDomainService();

  return {
    userApplicationService,
    userDomainService,
    userRepository,
  };
}

export default buildUserModule;

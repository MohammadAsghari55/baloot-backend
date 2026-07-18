import UserPgRepository from "../../infrastructure/repositories/user.pg.repository.js";
import IUserApplicationService from "../../domains/user/Interfaces/iuser.application.service.js";
import UserApplicationService from "../../application/auth/services/user.application.service.js";
import UserDomainService from "./services/user.domain.service.js";
import pool from "../../infrastructure/database/pg.client.js";

function buildUserModule() {
  const userRepository = new UserPgRepository(pool);
  const userApplicationService: IUserApplicationService =
    new UserApplicationService(userRepository);
  const userDomainService = new UserDomainService();

  return {
    userApplicationService,
    userDomainService,
    userRepository,
  };
}

export default buildUserModule;

import { RegisterDto } from "../../../shared/validators/auth/register.schema.js";
import ValidationError from "../../../shared/errors/validation.error.js";
import ForbiddenError from "../../../shared/errors/forbidden.error.js";
import ITransactionManager from "../../../shared/interfaces/itransaction.manager.js";
import IPasswordHasher from "../../../domains/user/Interfaces/ipassword.hasher.js";
import UserApplicationService from "../../../application/auth/services/user.application.service.js";
import UserDomainService from "../../../domains/user/services/user.domain.service.js";

class RegisterUserUseCase {
  constructor(
    private userApplicationService: UserApplicationService,
    private userDomainService: UserDomainService,
    private transactionManager: ITransactionManager,
    private passwordHasher: IPasswordHasher,
  ) {}

  async execute(dto: RegisterDto) {
    if (dto.role && dto.role !== "user") {
      throw new ForbiddenError("INVALID_ROLE");
    }
    if (dto.password !== dto.confirmPassword) {
      throw new ValidationError("PASSWORD_MISMATCH");
    }

    return this.transactionManager.runInTransaction(async (client) => {
      const existingEmail = await this.userApplicationService.findUserByEmail(
        dto.email,
        client,
      );

      const existingUsername =
        await this.userApplicationService.findUserByUsername(
          dto.username,
          client,
        );

      await this.userDomainService.checkUniqueness(
        existingEmail,
        existingUsername,
      );

      const hashedPassword = await this.passwordHasher.hash(dto.password);

      const user = this.userDomainService.createUser(
        dto.email,
        dto.username,
        hashedPassword,
        "user",
      );

      await this.userApplicationService.saveUser(user, client);

      return {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      };
    });
  }
}

export default RegisterUserUseCase;

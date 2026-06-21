import { RegisterDto } from "../../../shared/validators/auth/register.schema.js";
import UserService from "../../../domains/user/services/user.service.js";
import ValidationError from "../../../shared/errors/validation.error.js";
import ForbiddenError from "../../../shared/errors/forbidden.error.js";
import ITransactionManager from "../../../shared/interfaces/itransaction.manager.js";
import IPasswordHasher from "../../../domains/user/Interfaces/ipassword.hasher.js";

class RegisterAdminUseCase {
  constructor(
    private userService: UserService,
    private transactionManager: ITransactionManager,
    private passwordHasher: IPasswordHasher,
  ) {}

  async execute(dto: RegisterDto) {
    if (dto.role && dto.role !== "admin") {
      throw new ForbiddenError("INVALID_ROLE");
    }
    if (dto.password !== dto.confirmPassword) {
      throw new ValidationError("PASSWORD_MISMATCH");
    }

    return this.transactionManager.runInTransaction(async (client) => {
      await this.userService.checkAdminLimit(client);

      await this.userService.checkUniqueness(
        dto.email,
        dto.username,
        "admin",
        client,
      );

      const hashedPassword = await this.passwordHasher.hash(dto.password);

      const user = this.userService.createUserEntity(
        dto.email,
        dto.username,
        hashedPassword,
        "admin",
      );

      await this.userService.saveUser(user, client);

      return {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      };
    });
  }
}

export default RegisterAdminUseCase;

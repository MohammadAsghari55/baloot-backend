import { RegisterDto } from "../../../shared/validators/auth/register.schema.js";
import UserService from "../../../domains/user/services/user.service.js";
import pool from "../../../infrastructure/database/pg.client.js";
import ValidationError from "../../../shared/errors/validation.error.js";
import ForbiddenError from "../../../shared/errors/forbidden.error.js";
class RegisterAdminUseCase {
  constructor(private userService: UserService) {}

  async execute(dto: RegisterDto) {
    if (dto.role && dto.role !== "admin") {
      throw new ForbiddenError("INVALID_ROLE");
    }
    if (dto.password !== dto.confirmPassword) {
      throw new ValidationError("PASSWORD_MISMATCH");
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      await this.userService.checkUniqueness(
        dto.email,
        dto.username,
        "admin",
        client,
      );

      const hashedPassword = await this.userService.hashPassword(dto.password);

      const user = this.userService.createUserEntity(
        dto.email,
        dto.username,
        hashedPassword,
        "admin",
      );

      await this.userService.saveUser(user, client);

      await client.query("COMMIT");

      return {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

export default RegisterAdminUseCase;

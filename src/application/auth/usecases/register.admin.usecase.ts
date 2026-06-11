import { RegisterDto } from "../../../shared/validators/auth/register.schema.js";
import UserService from "../../../domains/user/services/user.service.js";
import pool from "../../../infrastructure/database/pg.client.js";
import AppError from "../../../shared/errors/app.error.js";

class RegisterAdminUseCase {
  constructor(private userService: UserService) {}

  async execute(dto: RegisterDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new AppError("Passwords do not match", 400, "PASSWORD_MISMATCH");
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

import { LoginDto } from "../dtos/login.dto.js";
import UserService from "../../../domains/user/services/user.service.js";
import UnauthorizedError from "../../../shared/errors/unauthorized.error.js";

class LoginUseCase {
  constructor(private userService: UserService) {}

  async execute(dto: LoginDto) {
    const user = await this.userService.findUserByUsername(dto.username);
    if (!user) {
      throw new UnauthorizedError("INVALID_CREDENTIALS");
    }
    const isMatch = await this.userService.comparePassword(
      dto.password,
      user.passwordHash,
    );
    if (!isMatch) {
      throw new UnauthorizedError("INVALID_CREDENTIALS");
    }
    return {
      userId: user.id,
      role: user.role,
    };
  }
}

export default LoginUseCase;

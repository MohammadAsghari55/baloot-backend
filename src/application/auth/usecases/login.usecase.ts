import { LoginDto } from "../dtos/login.dto.js";
import UserService from "../../../domains/user/services/user.service.js";
import UnauthorizedError from "../../../shared/errors/unauthorized.error.js";
import pool from "../../../infrastructure/database/pg.client.js";
import ITokenService from "../../../domains/user/Interfaces/itoken.service.js";
import IRefreshTokenRepository from "../../../domains/user/repositories/refresh.token.repository.js";
import BadRequestError from "../../../shared/errors/bad-request.error.js";
import IPasswordHasher from "../../../domains/user/Interfaces/ipassword.hasher.js";

class LoginUseCase {
  constructor(
    private userService: UserService,
    private tokenService: ITokenService,
    private refreshTokenRepository: IRefreshTokenRepository,
    private passwordHasher: IPasswordHasher,
  ) {}

  async execute(dto: LoginDto, deviceId: string) {
    if (!deviceId) {
      throw new BadRequestError("MISSING_DEVICE_ID");
    }
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const user = await this.userService.findUserByIdentifier(dto.identifier);

      if (!user) {
        throw new UnauthorizedError("INVALID_CREDENTIALS");
      }

      const isMatch = await this.passwordHasher.compare(
        dto.password,
        user.passwordHash,
      );

      if (!isMatch) {
        throw new UnauthorizedError("INVALID_CREDENTIALS");
      }

      const accessToken = this.tokenService.generateAccessToken(
        user.id,
        user.role,
      );

      const refreshToken = this.tokenService.generateRefreshToken();

      const hashedRefreshToken =
        await this.tokenService.hashRefreshToken(refreshToken);

      await this.refreshTokenRepository.revokeByDeviceId(
        user.id,
        deviceId,
        client,
      );

      await this.refreshTokenRepository.saveToken(
        hashedRefreshToken,
        user.id,
        deviceId,
        client,
      );

      await client.query("COMMIT");

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

export default LoginUseCase;

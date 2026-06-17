import pool from "../../../infrastructure/database/pg.client.js";
import ITokenService from "../../../domains/user/Interfaces/itoken.service.js";
import IRefreshTokenRepository from "../../../domains/user/repositories/refresh.token.repository.js";
import IPasswordHasher from "../../../domains/user/Interfaces/ipassword.hasher.js";
import UnauthorizedError from "../../../shared/errors/unauthorized.error.js";
import BadRequestError from "../../../shared/errors/bad-request.error.js";

class RefreshTokenUseCase {
  constructor(
    private tokenService: ITokenService,
    private refreshTokenRepository: IRefreshTokenRepository,
    private passwordHasher: IPasswordHasher,
  ) {}

  async execute(role: string, refreshToken: string, deviceId: string) {
    if (!deviceId) {
      throw new BadRequestError("MISSING_DEVICE_ID");
    }
    if (!refreshToken) {
      throw new BadRequestError("INVALID_REFRESH_TOKEN");
    }
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const storedToken = await this.refreshTokenRepository.findTokenByDeviceId(
        deviceId,
        client,
      );

      if (!storedToken) {
        throw new UnauthorizedError("INVALID_REFRESH_TOKEN");
      }

      const compare = await this.passwordHasher.compare(
        refreshToken,
        storedToken.tokenHash,
      );

      if (!compare) {
        throw new UnauthorizedError("INVALID_REFRESH_TOKEN");
      }

      if (
        storedToken.revokedAt !== null ||
        storedToken.expiresAt < new Date()
      ) {
        throw new UnauthorizedError("INVALID_REFRESH_TOKEN");
      }

      const tokens = await this.tokenService.generateTokenPair(
        storedToken.userId,
        role,
      );

      await this.refreshTokenRepository.revokeByDeviceId(
        storedToken.userId,
        deviceId,
        client,
      );

      await this.refreshTokenRepository.saveToken(
        tokens.hashedRefreshToken,
        storedToken.userId,
        deviceId,
        client,
      );

      await client.query("COMMIT");

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

export default RefreshTokenUseCase;

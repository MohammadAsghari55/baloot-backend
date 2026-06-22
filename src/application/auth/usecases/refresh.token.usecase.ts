import ITokenService from "../../../domains/user/Interfaces/itoken.service.js";
import IRefreshTokenRepository from "../../../domains/user/repositories/refresh.token.repository.js";
import IPasswordHasher from "../../../domains/user/Interfaces/ipassword.hasher.js";
import ITransactionManager from "../../../shared/interfaces/itransaction.manager.js";
import AppError from "../../../shared/errors/app.error.js";

class RefreshTokenUseCase {
  constructor(
    private tokenService: ITokenService,
    private refreshTokenRepository: IRefreshTokenRepository,
    private passwordHasher: IPasswordHasher,
    private transactionManager: ITransactionManager,
  ) {}

  async execute(
    role: string,
    refreshToken: string,
    userId: string,
    deviceId: string,
  ) {
    if (!deviceId) {
      throw AppError.badRequest("MISSING_DEVICE_ID");
    }
    if (!refreshToken) {
      throw AppError.badRequest("INVALID_REFRESH_TOKEN");
    }

    return this.transactionManager.runInTransaction(async (client) => {
      const storedToken =
        await this.refreshTokenRepository.findTokenByDeviceIdAndUserId(
          userId,
          deviceId,
          client,
        );

      if (!storedToken) {
        throw AppError.unauthorized("INVALID_REFRESH_TOKEN");
      }

      const compare = await this.passwordHasher.compare(
        refreshToken,
        storedToken.tokenHash,
      );

      if (!compare) {
        throw AppError.unauthorized("INVALID_REFRESH_TOKEN");
      }

      if (
        storedToken.revokedAt !== null ||
        storedToken.expiresAt < new Date()
      ) {
        throw AppError.unauthorized("INVALID_REFRESH_TOKEN");
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

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    });
  }
}

export default RefreshTokenUseCase;

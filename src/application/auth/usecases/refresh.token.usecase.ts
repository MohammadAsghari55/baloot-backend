import ITransactionManager from "../../../shared/interfaces/itransaction.manager.js";
import IBcryptService from "../../../domains/user/Interfaces/ibcrypt.service.js";
import ITokenService from "../../../domains/user/Interfaces/itoken.service.js";
import ITokenManagementApplicationService from "../../../domains/user/Interfaces/itoken.management.application.service.js";
import AppError from "../../../shared/errors/app.error.js";

class RefreshTokenUseCase {
  constructor(
    private transactionManager: ITransactionManager,
    private bcryptService: IBcryptService,
    private tokenService: ITokenService,
    private tokenManagementApplicationService: ITokenManagementApplicationService,
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
        await this.tokenManagementApplicationService.findToken(
          userId,
          deviceId,
          client,
        );

      if (!storedToken) {
        throw AppError.unauthorized("INVALID_REFRESH_TOKEN");
      }

      const compare = await this.bcryptService.compare(
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

      await this.tokenManagementApplicationService.revokeByDevice(
        storedToken.userId,
        deviceId,
        client,
      );

      await this.tokenManagementApplicationService.saveToken(
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

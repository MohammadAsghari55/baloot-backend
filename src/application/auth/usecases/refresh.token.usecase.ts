import ITransactionManager from "../../../shared/interfaces/itransaction.manager.js";
import IBcryptService from "../../../domains/user/Interfaces/ibcrypt.service.js";
import ITokenService from "../../../domains/user/Interfaces/itoken.service.js";
import ITokenManagementApplicationService from "../../../domains/user/Interfaces/itoken.management.application.service.js";
import ISessionService from "../../../domains/user/Interfaces/isession.service.js";
import AppError from "../../../shared/errors/app.error.js";

class RefreshTokenUseCase {
  constructor(
    private transactionManager: ITransactionManager,
    private bcryptService: IBcryptService,
    private tokenService: ITokenService,
    private tokenManagementApplicationService: ITokenManagementApplicationService,
    private sessionService: ISessionService,
  ) {}

  async execute(
    refreshToken: string,
    userId: string,
    deviceId: string,
    role: string,
  ) {
    if (!refreshToken) {
      throw AppError.badRequest("INVALID_REFRESH_TOKEN");
    }

    return this.transactionManager.runInTransaction(async (client) => {
      const session = await this.sessionService.getSession(userId, deviceId);

      const redisVersion = await this.sessionService.getVersion(userId);

      if (!redisVersion) {
        throw AppError.unauthorized("VERSION_NOT_FOUND");
      }

      if (session && session.status === "active") {
        if (session.version !== redisVersion) {
          throw AppError.unauthorized("VERSION_MISMATCH");
        }
      } else {
        const storedToken =
          await this.tokenManagementApplicationService.findToken(
            userId,
            deviceId,
            client,
          );

        if (!storedToken) {
          throw AppError.unauthorized("INVALID_REFRESH_TOKEN");
        }

        if (storedToken.expiresAt <= new Date()) {
          throw AppError.unauthorized("REFRESH_TOKEN_EXPIRED");
        }

        const isMatch = await this.bcryptService.compare(
          refreshToken,
          storedToken.tokenHash,
        );

        if (!isMatch) {
          throw AppError.unauthorized("INVALID_REFRESH_TOKEN");
        }

        await this.sessionService.setSession(
          userId,
          deviceId,
          {
            status: "active",
            version: redisVersion,
          },
          7 * 24 * 60 * 60,
        );
      }

      await this.sessionService.setVersion(
        userId,
        redisVersion,
        30 * 24 * 60 * 60,
      );

      const newAccessToken = await this.tokenService.generateAccessToken(
        userId,
        deviceId,
        role,
      );

      return {
        accessToken: newAccessToken,
        refreshToken: refreshToken,
      };
    });
  }
}

export default RefreshTokenUseCase;

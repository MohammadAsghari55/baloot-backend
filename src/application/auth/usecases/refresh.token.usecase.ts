import ITransactionManager from "../../../shared/interfaces/itransaction.manager.js";
import IBcryptService from "../../../domains/user/Interfaces/ibcrypt.service.js";
import ITokenService from "../../../domains/user/Interfaces/itoken.service.js";
import ITokenManagementApplicationService from "../../../domains/user/Interfaces/itoken.management.application.service.js";
import IRedisService from "../../../shared/interfaces/iredis.service.js";
import AppError from "../../../shared/errors/app.error.js";

class RefreshTokenUseCase {
  constructor(
    private transactionManager: ITransactionManager,
    private bcryptService: IBcryptService,
    private tokenService: ITokenService,
    private tokenManagementApplicationService: ITokenManagementApplicationService,
    private redisService: IRedisService,
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
      const sessionKey = `session:${userId}:${deviceId}`;

      const session = await this.redisService.get<{
        status: string;
        version: number;
        expiresAt: number;
      }>(sessionKey);

      const redisVersion = await this.redisService.get<number>(
        `version:${userId}`,
      );

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

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await this.redisService.set(
          sessionKey,
          {
            status: "active",
            version: redisVersion,
            expiresAt: expiresAt.getTime(),
          },
          7 * 24 * 60 * 60,
        );
      }

      await this.redisService.set(
        `version:${userId}`,
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

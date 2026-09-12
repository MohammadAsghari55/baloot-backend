import ITransactionManager from "../../../shared/interfaces/itransaction.manager.js";
import IUserApplicationService from "../../../domains/user/Interfaces/iuser.application.service.js";
import ITokenService from "../../../domains/user/Interfaces/itoken.service.js";
import ITokenManagementApplicationService from "../../../domains/user/Interfaces/itoken.management.application.service.js";
import ISessionService from "../../../domains/user/Interfaces/isession.service.js";
import AppError from "../../../shared/errors/app.error.js";
import crypto from "crypto";
import { logger } from "../../../infrastructure/logger/winston.index.js";

class RefreshTokenUseCase {
  constructor(
    private transactionManager: ITransactionManager,
    private userApplicationService: IUserApplicationService,
    private tokenService: ITokenService,
    private tokenManagementApplicationService: ITokenManagementApplicationService,
    private sessionService: ISessionService,
  ) {}

  async execute(refreshToken: string, userId: string, deviceId: string) {
    if (!refreshToken) {
      throw AppError.badRequest("INVALID_REFRESH_TOKEN");
    }

    if (!deviceId) {
      throw AppError.badRequest("MISSING_DEVICE_ID");
    }

    const user = await this.userApplicationService.readById(userId);

    if (!user) {
      throw AppError.notFound("NOT_FOUND");
    }

    const accessType = user.isProfileCompleted ? "full" : "limited";

    const tokens = await this.tokenService.generateTokenPair(
      userId,
      deviceId,
      user.role,
      accessType,
    );

    const result = await this.transactionManager.runInTransaction(
      async (client) => {
        const hashedRefreshToken =
          this.tokenService.hashRefreshToken(refreshToken);

        const isBlacklisted =
          await this.tokenManagementApplicationService.isBlacklisted(
            hashedRefreshToken,
          );

        if (isBlacklisted) {
          throw AppError.unauthorized("INVALID_REFRESH_TOKEN");
        }

        const storedToken =
          await this.tokenManagementApplicationService.findTokenByDeviceIdAndUserId(
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

        const isEqual = crypto.timingSafeEqual(
          Buffer.from(hashedRefreshToken),
          Buffer.from(storedToken.tokenHash),
        );

        if (!isEqual) {
          throw AppError.unauthorized("INVALID_REFRESH_TOKEN");
        }

        await this.tokenManagementApplicationService.revokeByDeviceId(
          userId,
          deviceId,
          client,
        );

        await this.tokenManagementApplicationService.saveToken(
          tokens.hashedRefreshToken,
          user.id,
          deviceId,
          client,
        );

        return {
          storedToken: storedToken,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        };
      },
    );

    try {
      const ttl = Math.floor(
        (result.storedToken.expiresAt.getTime() - Date.now()) / 1000,
      );

      if (ttl > 0) {
        await this.tokenManagementApplicationService.addToBlacklist(
          result.storedToken.tokenHash,
          ttl,
        );
      }

      await this.sessionService.setSession(
        userId,
        deviceId,
        {
          status: "active",
          version: user.tokenVersion,
        },
        7 * 24 * 60 * 60,
      );

      await this.sessionService.setVersion(
        userId,
        user.tokenVersion,
        7 * 24 * 60 * 60,
      );
    } catch (error) {
      logger.error("Redis sync failed after refresh:", error);
    }

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }
}

export default RefreshTokenUseCase;

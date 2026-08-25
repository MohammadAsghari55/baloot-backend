import ITransactionManager from "../../../shared/interfaces/itransaction.manager.js";
import IUserApplicationService from "../../../domains/user/Interfaces/iuser.application.service.js";
import IBcryptService from "../../../domains/user/Interfaces/ibcrypt.service.js";
import ITokenService from "../../../domains/user/Interfaces/itoken.service.js";
import ITokenManagementApplicationService from "../../../domains/user/Interfaces/itoken.management.application.service.js";
import ISessionService from "../../../domains/user/Interfaces/isession.service.js";
import AppError from "../../../shared/errors/app.error.js";

class RefreshTokenUseCase {
  constructor(
    private transactionManager: ITransactionManager,
    private userApplicationService: IUserApplicationService,
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

    if (!deviceId) {
      throw AppError.badRequest("MISSING_DEVICE_ID");
    }

    const user = await this.userApplicationService.readById(userId);

    if (!user) {
      throw AppError.notFound("NOT_FOUND");
    }

    const tokens = await this.tokenService.generateTokenPair(
      userId,
      deviceId,
      role,
    );

    const result = await this.transactionManager.runInTransaction(
      async (client) => {
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

        const isMatch = await this.bcryptService.compare(
          refreshToken,
          storedToken.tokenHash,
        );

        if (!isMatch) {
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
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        };
      },
    );

    try {
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
      console.error("Redis sync failed after refresh:", error);
    }

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }
}

export default RefreshTokenUseCase;

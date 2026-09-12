import { LoginDto } from "../../../application/auth/dtos/login.dto.js";
import { randomUUID } from "crypto";
import ITransactionManager from "../../../shared/interfaces/itransaction.manager.js";
import IUserApplicationService from "../../../domains/user/Interfaces/iuser.application.service.js";
import IBcryptService from "../../../domains/user/Interfaces/ibcrypt.service.js";
import ITokenService from "../../../domains/user/Interfaces/itoken.service.js";
import ITokenManagementApplicationService from "../../../domains/user/Interfaces/itoken.management.application.service.js";
import IEmailVerificationApplicationService from "../../../domains/user/Interfaces/iemail.verification.application.service.js";
import ISessionService from "../../../domains/user/Interfaces/isession.service.js";
import ErrorFactory from "../../../shared/errors/error.factory.js";
import AppError from "../../../shared/errors/app.error.js";
import { logger } from "../../../infrastructure/logger/winston.index.js";

class LoginUseCase {
  constructor(
    private transactionManager: ITransactionManager,
    private userApplicationService: IUserApplicationService,
    private bcryptService: IBcryptService,
    private tokenService: ITokenService,
    private tokenManagementApplicationService: ITokenManagementApplicationService,
    private emailVerificationApplicationService: IEmailVerificationApplicationService,
    private sessionService: ISessionService,
  ) {}

  async execute(dto: LoginDto, deviceId: string) {
    const { identifier, password, code } = dto;

    const result = await this.transactionManager.runInTransaction(
      async (client) => {
        const user = await this.userApplicationService.findByIdentifier(
          identifier,
          client,
        );

        if (!user) {
          throw AppError.unauthorized("INVALID_CREDENTIALS");
        }

        if (!user.isEmailVerified && !code) {
          throw AppError.badRequest("EMAIL_NOT_VERIFIED");
        }

        if (user.wrongPasswordUntil && user.wrongPasswordUntil > new Date()) {
          const remainingSeconds = Math.floor(
            (user.wrongPasswordUntil.getTime() - Date.now()) / 1000,
          );

          const remainingMinutes = Math.ceil(remainingSeconds / 60);

          throw ErrorFactory.accountLocked(remainingMinutes);
        }

        const existingToken =
          await this.tokenManagementApplicationService.findTokenByDeviceIdAndUserId(
            user.id,
            deviceId,
            client,
          );

        if (existingToken && existingToken.expiresAt > new Date()) {
          await this.tokenManagementApplicationService.revokeByDeviceId(
            user.id,
            deviceId,
            client,
          );
        }

        const passwordIsMatch = await this.bcryptService.compare(
          password,
          user.passwordHash,
        );

        if (!passwordIsMatch) {
          const tryCounter =
            await this.userApplicationService.incrementWrongPasswordNumber(
              user.id,
              client,
            );

          if (tryCounter < 3) {
            throw ErrorFactory.invalidCredentials(3 - tryCounter);
          }

          await this.userApplicationService.resetWrongPasswordNumber(
            user.id,
            client,
          );

          await this.userApplicationService.setWrongPasswordUntil(
            user.id,
            new Date(Date.now() + 15 * 60 * 1000),
            client,
          );

          throw ErrorFactory.accountLocked(15);
        }

        await this.userApplicationService.resetWrongPasswordNumber(
          user.id,
          client,
        );

        if (!user.isEmailVerified) {
          if (!code) {
            throw AppError.badRequest("INVALID_VERIFICATION_CODE");
          }
          const emailVerification =
            await this.emailVerificationApplicationService.findByUserId(
              user.id,
              client,
            );

          if (!emailVerification) {
            throw AppError.badRequest("INVALID_VERIFICATION_CODE");
          }

          const codeIsMatch = await this.bcryptService.compare(
            code,
            emailVerification.hashedCode,
          );

          if (!codeIsMatch) {
            throw AppError.badRequest("INVALID_VERIFICATION_CODE");
          }

          await this.userApplicationService.updateEmailVerified(
            user.id,
            true,
            client,
          );

          await this.emailVerificationApplicationService.delete(
            user.id,
            client,
          );
        }

        if (!deviceId) {
          deviceId = randomUUID();
        }

        const version = user.tokenVersion;

        const accessType = user.isProfileCompleted ? "full" : "limited";

        const tokens = await this.tokenService.generateTokenPair(
          user.id,
          deviceId,
          user.role,
          accessType,
        );

        await this.tokenManagementApplicationService.saveToken(
          tokens.hashedRefreshToken,
          user.id,
          deviceId,
          client,
        );

        return {
          user,
          deviceId,
          version,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        };
      },
    );

    try {
      await this.sessionService.setSession(
        result.user.id,
        result.deviceId,
        {
          status: "active",
          version: result.version,
        },
        7 * 24 * 60 * 60,
      );

      await this.sessionService.setVersion(
        result.user.id,
        result.version,
        7 * 24 * 60 * 60,
      );
    } catch (error) {
      logger.error("Redis sync failed after login:", error);
    }

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }
}

export default LoginUseCase;

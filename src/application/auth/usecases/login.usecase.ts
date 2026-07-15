import { LoginDto } from "../../../application/auth/dtos/login.dto.js";
import ITransactionManager from "../../../shared/interfaces/itransaction.manager.js";
import UserApplicationService from "../../../application/auth/services/user.application.service.js";
import IBcryptService from "../../../domains/user/Interfaces/ibcrypt.service.js";
import ITokenService from "../../../domains/user/Interfaces/itoken.service.js";
import IRefreshTokenRepository from "../../../domains/user/repositories/irefresh.token.repository.js";
import IEmailVerificationRepository from "../../../domains/user/repositories/iemail.verification.repository.js";
import AppError from "../../../shared/errors/app.error.js";

class LoginUseCase {
  constructor(
    private transactionManager: ITransactionManager,
    private userApplicationService: UserApplicationService,
    private bcryptService: IBcryptService,
    private tokenService: ITokenService,
    private refreshTokenRepository: IRefreshTokenRepository,
    private emailVerificationRepository: IEmailVerificationRepository,
  ) {}

  async execute(dto: LoginDto, deviceId: string) {
    const { identifier, password, code } = dto;

    if (!deviceId) {
      throw AppError.badRequest("MISSING_DEVICE_ID");
    }

    return this.transactionManager.runInTransaction(async (client) => {
      const user = await this.userApplicationService.findUserByIdentifier(
        identifier,
        client,
      );

      if (!user) {
        throw AppError.unauthorized("INVALID_CREDENTIALS");
      }

      if (!user.isEmailVerified && !code) {
        throw AppError.badRequest("EMAIL_NOT_VERIFIED");
      }

      const existingToken =
        await this.refreshTokenRepository.findTokenByDeviceIdAndUserId(
          user.id,
          deviceId,
          client,
        );
      if (existingToken && existingToken.expiresAt > new Date()) {
        throw AppError.badRequest("YOU_ARE_LOGGED_IN");
      }

      const isMatch = await this.bcryptService.compare(
        password,
        user.passwordHash,
      );

      if (!isMatch) {
        throw AppError.unauthorized("INVALID_CREDENTIALS");
      }

      if (!user.isEmailVerified) {
        const emailVerification =
          await this.emailVerificationRepository.findByUserId(user.id, client);

        if (!emailVerification) {
          throw AppError.badRequest("INVALID_VERIFICATION_CODE");
        }

        if (code !== emailVerification.code) {
          throw AppError.badRequest("INVALID_VERIFICATION_CODE");
        }

        await this.userApplicationService.updateEmailVerified(
          user.id,
          true,
          client,
        );

        await this.emailVerificationRepository.deleteByUserId(user.id, client);
      }

      const tokens = await this.tokenService.generateTokenPair(
        user.id,
        user.role,
      );

      await this.refreshTokenRepository.revokeByDeviceId(
        user.id,
        deviceId,
        client,
      );

      await this.refreshTokenRepository.saveToken(
        tokens.hashedRefreshToken,
        user.id,
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

export default LoginUseCase;

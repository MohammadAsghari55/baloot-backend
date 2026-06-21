import { LoginDto } from "../dtos/login.dto.js";
import UnauthorizedError from "../../../shared/errors/unauthorized.error.js";
import ITokenService from "../../../domains/user/Interfaces/itoken.service.js";
import IRefreshTokenRepository from "../../../domains/user/repositories/refresh.token.repository.js";
import BadRequestError from "../../../shared/errors/bad-request.error.js";
import IPasswordHasher from "../../../domains/user/Interfaces/ipassword.hasher.js";
import ITransactionManager from "../../../shared/interfaces/itransaction.manager.js";
import UserApplicationService from "../../../application/auth/services/user.application.service.js";

class LoginUseCase {
  constructor(
    private userApplicationService: UserApplicationService,
    private tokenService: ITokenService,
    private refreshTokenRepository: IRefreshTokenRepository,
    private passwordHasher: IPasswordHasher,
    private transactionManager: ITransactionManager,
  ) {}

  async execute(dto: LoginDto, deviceId: string) {
    if (!deviceId) {
      throw new BadRequestError("MISSING_DEVICE_ID");
    }

    return this.transactionManager.runInTransaction(async (client) => {
      const user = await this.userApplicationService.findUserByIdentifier(
        dto.identifier,
        client,
      );

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

import IDatabaseClient from "../../../domains/shared/interfaces/idatabase.client.js";
import ITokenManagementApplicationService from "../../../domains/user/Interfaces/itoken.management.application.service.js";
import IRefreshTokenRepository from "../../../domains/user/repositories/irefresh.token.repository.js";

class TokenManagementApplicationService implements ITokenManagementApplicationService {
  constructor(private refreshTokenRepository: IRefreshTokenRepository) {}

  async saveToken(
    tokenHash: string,
    userId: string,
    deviceId: string,
    client: IDatabaseClient,
  ): Promise<void> {
    return this.refreshTokenRepository.saveToken(
      tokenHash,
      userId,
      deviceId,
      client,
    );
  }

  async revokeByDeviceId(
    userId: string,
    deviceId: string,
    client: IDatabaseClient,
  ): Promise<void> {
    return this.refreshTokenRepository.revokeByDeviceId(
      userId,
      deviceId,
      client,
    );
  }

  async revokeAllByUserId(
    userId: string,
    client: IDatabaseClient,
  ): Promise<void> {
    return this.refreshTokenRepository.revokeAllByUserId(userId, client);
  }

  async findTokenByDeviceIdAndUserId(
    userId: string,
    deviceId: string,
    client: IDatabaseClient,
  ): Promise<{
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
  } | null> {
    return this.refreshTokenRepository.findTokenByDeviceIdAndUserId(
      userId,
      deviceId,
      client,
    );
  }

  async readActiveToken(
    userId: string,
    deviceId: string,
  ): Promise<{
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
  } | null> {
    return this.refreshTokenRepository.readActiveToken(userId, deviceId);
  }

  async cleanExpiredAndRevokedTokens(): Promise<number> {
    return this.refreshTokenRepository.cleanExpiredAndRevokedTokens();
  }
}

export default TokenManagementApplicationService;

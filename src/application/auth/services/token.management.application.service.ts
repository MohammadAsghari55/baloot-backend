import IDatabaseClient from "../../../domains/shared/interfaces/idatabase.client.js";
import ITokenManagementApplicationService from "../../../domains/user/Interfaces/itoken.management.application.service.js";
import IRefreshTokenRepository from "../../../domains/user/repositories/irefresh.token.repository.js";
import IRedisService from "../../../shared/interfaces/iredis.service.js";

class TokenManagementApplicationService implements ITokenManagementApplicationService {
  constructor(
    private refreshTokenRepository: IRefreshTokenRepository,
    private redisService: IRedisService,
  ) {}

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

  async cleanExpiredAndRevokedTokens(limit: number): Promise<number> {
    return this.refreshTokenRepository.cleanExpiredAndRevokedTokens(limit);
  }

  async addToBlacklist(tokenHash: string, ttl: number): Promise<void> {
    await this.redisService.set(`blacklist:${tokenHash}`, "revoked", ttl);
  }

  async isBlacklisted(tokenHash: string): Promise<boolean> {
    return this.redisService.exists(`blacklist:${tokenHash}`);
  }
}

export default TokenManagementApplicationService;

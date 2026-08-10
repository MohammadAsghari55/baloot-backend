import IDatabaseClient from "../../shared/interfaces/idatabase.client.js";

interface IRefreshTokenRepository {
  saveToken(
    tokenHash: string,
    userId: string,
    deviceId: string,
    client: IDatabaseClient,
  ): Promise<void>;

  revokeByDeviceId(
    userId: string,
    deviceId: string,
    client: IDatabaseClient,
  ): Promise<void>;

  revokeAllByUserId(userId: string, client: IDatabaseClient): Promise<void>;

  findTokenByDeviceIdAndUserId(
    userId: string,
    deviceId: string,
    client: IDatabaseClient,
  ): Promise<{
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
  } | null>;

  readActiveToken(
    userId: string,
    deviceId: string,
  ): Promise<{
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
  } | null>;
}

export default IRefreshTokenRepository;

import { PoolClient } from "pg";

interface IRefreshTokenRepository {
  saveToken(
    tokenHash: string,
    userId: string,
    deviceId: string,
    client?: PoolClient,
  ): Promise<void>;

  revokeByDeviceId(
    userId: string,
    deviceId: string,
    client?: PoolClient,
  ): Promise<void>;

  findTokenByDeviceId(
    deviceId: string,
    client?: PoolClient,
  ): Promise<{
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
  } | null>;
}

export default IRefreshTokenRepository;

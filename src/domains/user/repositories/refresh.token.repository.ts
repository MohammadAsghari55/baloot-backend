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
}

export default IRefreshTokenRepository;

import { PoolClient } from "pg";

interface ITokenManagementApplicationService {
  saveToken(
    tokenHash: string,
    userId: string,
    deviceId: string,
    client?: PoolClient,
  ): Promise<void>;

  revokeByDevice(
    userId: string,
    deviceId: string,
    client?: PoolClient,
  ): Promise<void>;

  revokeAll(userId: string, client?: PoolClient): Promise<void>;

  findToken(
    userId: string,
    deviceId: string,
    client?: PoolClient,
  ): Promise<{
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
  } | null>;
}

export default ITokenManagementApplicationService;

import IDatabaseClient from "../../shared/interfaces/idatabase.client.js";

interface ITokenManagementApplicationService {
  saveToken(
    tokenHash: string,
    userId: string,
    deviceId: string,
    client: IDatabaseClient,
  ): Promise<void>;

  revokeByDevice(
    userId: string,
    deviceId: string,
    client: IDatabaseClient,
  ): Promise<void>;

  revokeAll(userId: string, client: IDatabaseClient): Promise<void>;

  findToken(
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

export default ITokenManagementApplicationService;

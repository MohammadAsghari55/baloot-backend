import { PoolClient } from "pg";

interface IRefreshTokenRepository {
  saveToken(
    tokenHash: string,
    userId: string,
    client?: PoolClient,
  ): Promise<void>;
}

export default IRefreshTokenRepository;

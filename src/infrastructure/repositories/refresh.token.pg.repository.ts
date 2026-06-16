import { Pool, PoolClient } from "pg";
import IRefreshTokenRepository from "../../domains/user/repositories/refresh.token.repository.js";
import DatabaseError from "../../shared/errors/database.error.js";
import { randomUUID } from "crypto";

class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private pool: Pool) {}

  async saveToken(
    tokenHash: string,
    userId: string,
    deviceId: string,
    client?: PoolClient,
  ): Promise<void> {
    const dbClient = client || this.pool;
    const query = `
    INSERT INTO refresh_token (
    id,user_id,token_hash,device_id,expires_at)
    VALUES ($1, $2, $3, $4, NOW() + INTERVAL '7 days')
    `;
    try {
      await dbClient.query(query, [randomUUID(), userId, tokenHash, deviceId]);
    } catch (error) {
      throw DatabaseError.fromPGError(error);
    }
  }

  async revokeByDeviceId(
    userId: string,
    deviceId: string,
    client?: PoolClient,
  ): Promise<void> {
    const dbClient = client || this.pool;
    const query = `
    UPDATE refresh_token 
    SET revoked_at = NOW()
    WHERE user_id = $1 AND device_id = $2 AND revoked_at IS NULL
    `;
    try {
      await dbClient.query(query, [userId, deviceId]);
    } catch (error) {
      throw DatabaseError.fromPGError(error);
    }
  }
}

export default RefreshTokenRepository;

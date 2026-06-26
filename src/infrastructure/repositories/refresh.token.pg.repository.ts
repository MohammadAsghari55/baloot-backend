import { Pool, PoolClient } from "pg";
import IRefreshTokenRepository from "../../domains/user/repositories/irefresh.token.repository.js";
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

  async findTokenByDeviceIdAndUserId(
    userId: string,
    deviceId: string,
    client?: PoolClient,
  ): Promise<{
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
  } | null> {
    const dbClient = client || this.pool;
    const query = `
    SELECT user_id, token_hash, expires_at, revoked_at 
    FROM refresh_token 
    WHERE user_id = $1 AND device_id = $2 AND revoked_at IS NULL
    ORDER BY created_at DESC
    LIMIT 1
    `;
    try {
      const token = await dbClient.query(query, [userId, deviceId]);

      if (token.rows.length === 0) {
        return null;
      }

      return {
        userId: token.rows[0].user_id,
        tokenHash: token.rows[0].token_hash,
        expiresAt: token.rows[0].expires_at,
        revokedAt: token.rows[0].revoked_at,
      };
    } catch (error) {
      throw DatabaseError.fromPGError(error);
    }
  }
}

export default RefreshTokenRepository;

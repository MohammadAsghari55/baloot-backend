import { Pool } from "pg";
import IRefreshTokenRepository from "../../domains/user/repositories/irefresh.token.repository.js";
import IDatabaseClient from "../../domains/shared/interfaces/idatabase.client.js";
import DatabaseError from "../../shared/errors/database.error.js";
import { randomUUID } from "crypto";

class RefreshTokenPgRepository implements IRefreshTokenRepository {
  constructor(private readonly pool: Pool) {}

  async saveToken(
    tokenHash: string,
    userId: string,
    deviceId: string,
    client: IDatabaseClient,
  ): Promise<void> {
    const query = `
    INSERT INTO refresh_token (
    id,user_id,token_hash,device_id,expires_at)
    VALUES ($1, $2, $3, $4, NOW() + INTERVAL '30 days')
    `;
    try {
      await client.query(query, [randomUUID(), userId, tokenHash, deviceId]);
    } catch (error) {
      throw DatabaseError.fromPGError(error);
    }
  }

  async revokeByDeviceId(
    userId: string,
    deviceId: string,
    client: IDatabaseClient,
  ): Promise<void> {
    const query = `
    UPDATE refresh_token 
    SET revoked_at = NOW()
    WHERE user_id = $1 AND device_id = $2 AND revoked_at IS NULL
    `;
    try {
      await client.query(query, [userId, deviceId]);
    } catch (error) {
      throw DatabaseError.fromPGError(error);
    }
  }

  async revokeAllByUserId(
    userId: string,
    client: IDatabaseClient,
  ): Promise<void> {
    const query = `
    UPDATE refresh_token 
    SET revoked_at = NOW()
    WHERE user_id = $1 AND revoked_at IS NULL
    `;
    try {
      await client.query(query, [userId]);
    } catch (error) {
      throw DatabaseError.fromPGError(error);
    }
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
    const query = `
    SELECT user_id, token_hash, expires_at, revoked_at 
    FROM refresh_token 
    WHERE user_id = $1 AND device_id = $2 AND revoked_at IS NULL
    ORDER BY created_at DESC
    LIMIT 1
    FOR UPDATE
    `;
    try {
      const token = await client.query(query, [userId, deviceId]);

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

  async readActiveToken(
    userId: string,
    deviceId: string,
  ): Promise<{
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
  } | null> {
    const query = `
    SELECT user_id, token_hash, expires_at, revoked_at 
    FROM refresh_token 
    WHERE user_id = $1 AND device_id = $2 AND revoked_at IS NULL
    ORDER BY created_at DESC
    LIMIT 1
    `;
    try {
      const token = await this.pool.query(query, [userId, deviceId]);

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

export default RefreshTokenPgRepository;

import { Pool, PoolClient } from "pg";
import IRefreshTokenRepository from "../../domains/user/repositories/refresh.token.repository.js";
import DatabaseError from "../../shared/errors/database.error.js";
import { randomUUID } from "crypto";

class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private pool: Pool) {}

  async saveToken(
    tokenHash: string,
    userId: string,
    client?: PoolClient,
  ): Promise<void> {
    const dbClient = client || this.pool;
    const query = `
    INSERT INTO refresh_token (
    id,user_id,token_hash,expires_at)
    VALUES ($1, $2, $3, NOW() + INTERVAL '7 days')
    `;
    try {
      await dbClient.query(query, [randomUUID(), userId, tokenHash]);
    } catch (error) {
      throw DatabaseError.fromPGError(error);
    }
  }
}

export default RefreshTokenRepository;

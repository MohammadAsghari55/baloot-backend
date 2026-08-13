import PasswordHistory from "../../domains/user/entities/password.history.entity.js";
import IPasswordHistoryRepository from "../../domains/user/repositories/ipassword.history.repository.js";
import IDatabaseClient from "../../domains/shared/interfaces/idatabase.client.js";
import DatabaseError from "../../shared/errors/database.error.js";

interface PasswordHistoryRow {
  id: string;
  user_id: string;
  password_hash: string;
  created_at: Date;
}

class PasswordHistoryPgRepository implements IPasswordHistoryRepository {
  async findRecentByUserId(
    userId: string,
    limit: number,
    client: IDatabaseClient,
  ): Promise<PasswordHistory[]> {
    const result = await client.query<PasswordHistoryRow>(
      `SELECT * FROM password_history 
     WHERE user_id = $1 
     ORDER BY created_at DESC 
     LIMIT $2
     `,
      [userId, limit],
    );
    return result.rows.map((row) => PasswordHistory.fromDB(row));
  }

  async save(
    userId: string,
    passwordHash: string,
    client: IDatabaseClient,
  ): Promise<void> {
    const query = `
      INSERT INTO password_history (user_id, password_hash)
      VALUES ($1, $2)
    `;
    try {
      await client.query(query, [userId, passwordHash]);
    } catch (error) {
      throw DatabaseError.fromPGError(error);
    }
  }

  async pruneHistory(userId: string, client: IDatabaseClient): Promise<void> {
    const query = `
      DELETE FROM password_history 
      WHERE user_id = $1 
      AND id NOT IN (
        SELECT id FROM password_history 
        WHERE user_id = $1 
        ORDER BY created_at DESC 
        LIMIT 3
      )
    `;
    try {
      await client.query(query, [userId]);
    } catch (error) {
      throw DatabaseError.fromPGError(error);
    }
  }
}
export default PasswordHistoryPgRepository;

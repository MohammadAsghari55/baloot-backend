import { Pool, PoolClient } from "pg";
import User from "../../domains/user/entities/user.entity.js";
import IUserRepository from "../../domains/user/repositories/user.repository.js";
import DatabaseError from "../../shared/errors/database.error.js";
class UserPgRepository implements IUserRepository {
  constructor(private pool: Pool) {}
  async findByEmail(email: string, client?: PoolClient): Promise<User | null> {
    const dbClient = client || this.pool;
    const result = await dbClient.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return User.fromDB(row);
  }

  async findByUsername(
    username: string,
    client?: PoolClient,
  ): Promise<User | null> {
    const dbClient = client || this.pool;
    const result = await dbClient.query(
      "SELECT * FROM users WHERE username = $1",
      [username],
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return User.fromDB(row);
  }

  async save(user: User, client?: PoolClient): Promise<void> {
    const dbClient = client || this.pool;
    const query = `
    INSERT INTO users (
      id, email, username, password_hash, role, wallet_balance,
      is_email_verified, wrong_password_number, wrong_password_until,
      created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      username = EXCLUDED.username,
      password_hash = EXCLUDED.password_hash,
      role = EXCLUDED.role,
      is_email_verified = EXCLUDED.is_email_verified,
      wrong_password_number = EXCLUDED.wrong_password_number,
      wrong_password_until = EXCLUDED.wrong_password_until,
      updated_at = EXCLUDED.updated_at
  `;
    try {
      await dbClient.query(query, [
        user.id,
        user.email,
        user.username,
        user.passwordHash,
        user.role,
        user.walletBalance,
        user.isEmailVerified,
        user.wrongPasswordNumber,
        user.wrongPasswordUntil,
        user.createdAt,
        user.updatedAt,
      ]);
    } catch (error) {
      throw DatabaseError.fromPGError(error);
    }
  }

  async countAdmins(client?: PoolClient): Promise<number> {
    const dbClient = client || this.pool;
    const adminsNumber = await dbClient.query(
      "SELECT COUNT(*) FROM users WHERE role = 'admin'",
    );
    return parseInt(adminsNumber.rows[0].count, 10);
  }

  async updateEmailVerified(
    userId: string,
    verified: boolean,
    client?: PoolClient,
  ): Promise<void> {
    const dbClient = client || this.pool;
    const query = `
    UPDATE users 
    SET is_email_verified = $1, updated_at = NOW()
    WHERE id = $2
  `;
    await dbClient.query(query, [verified, userId]);
  }
}

export default UserPgRepository;

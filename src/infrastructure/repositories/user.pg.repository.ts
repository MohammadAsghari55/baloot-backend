import { Pool, PoolClient } from "pg";
import User from "../../domains/user/entities/user.entity.js";
import IUserRepository from "../../domains/user/repositories/user.repository.js";
import InternalError from "../../shared/errors/internal.error.js";

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

  async findAdmin(client?: PoolClient): Promise<User | null> {
    const dbClient = client || this.pool;
    const result = await dbClient.query(
      "SELECT * FROM users WHERE role = 'admin'",
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
      wallet_balance = EXCLUDED.wallet_balance,
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
      throw new InternalError("DB_SAVE_FAILD");
    }
  }
}

export default UserPgRepository;

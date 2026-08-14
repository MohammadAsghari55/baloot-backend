import { Pool } from "pg";
import User from "../../domains/user/entities/user.entity.js";
import IUserRepository from "../../domains/user/repositories/iuser.repository.js";
import IDatabaseClient from "../../domains/shared/interfaces/idatabase.client.js";
import DatabaseError from "../../shared/errors/database.error.js";

class UserPgRepository implements IUserRepository {
  constructor(private readonly pool: Pool) {}

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return User.fromDB(row);
  }

  async findByUsername(username: string): Promise<User | null> {
    const result = await this.pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username],
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return User.fromDB(row);
  }

  async findById(
    userId: string,
    client: IDatabaseClient,
  ): Promise<User | null> {
    const result = await client.query(
      "SELECT * FROM users WHERE id = $1 FOR UPDATE",
      [userId],
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return User.fromDB(row);
  }

  async save(user: User, client: IDatabaseClient): Promise<void> {
    const query = `
    INSERT INTO users (
      id, email, username, password_hash, role, wallet_balance,
      is_email_verified, password_change_try, password_change_locked_until,
      wrong_password_number, wrong_password_until,
      created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `;
    try {
      await client.query(query, [
        user.id,
        user.email,
        user.username,
        user.passwordHash,
        user.role,
        user.walletBalance,
        user.isEmailVerified,
        user.passwordChangeTry,
        user.passwordChangeLockedUntil,
        user.wrongPasswordNumber,
        user.wrongPasswordUntil,
        user.createdAt,
        user.updatedAt,
      ]);
    } catch (error) {
      throw DatabaseError.fromPGError(error);
    }
  }

  async countAdmins(): Promise<number> {
    const adminsNumber = await this.pool.query(
      "SELECT COUNT(*) FROM users WHERE role = 'admin'",
    );
    return parseInt(adminsNumber.rows[0].count, 10);
  }

  async updateEmailVerified(
    userId: string,
    verified: boolean,
    client: IDatabaseClient,
  ): Promise<void> {
    const query = `
    UPDATE users 
    SET is_email_verified = $1, updated_at = NOW()
    WHERE id = $2
  `;
    await client.query(query, [verified, userId]);
  }

  async updatePassword(
    userId: string,
    hashedPassword: string,
    passwordChangeTry: number,
    passwordChangeLockedUntil: Date | null,
    client: IDatabaseClient,
  ): Promise<void> {
    const query = `
    UPDATE users 
    SET password_hash = $1, password_change_try = $2, password_change_locked_until = $3, updated_at = NOW()
    WHERE id = $4
  `;
    await client.query(query, [
      hashedPassword,
      passwordChangeTry,
      passwordChangeLockedUntil,
      userId,
    ]);
  }

  async updatePasswordChangeFields(
    userId: string,
    passwordChangeTry: number,
    passwordChangeLockedUntil: Date | null,
    client: IDatabaseClient,
  ): Promise<void> {
    const query = `
    UPDATE users 
    SET password_change_try = $1, password_change_locked_until = $2
    WHERE id = $3
  `;
    await client.query(query, [
      passwordChangeTry,
      passwordChangeLockedUntil,
      userId,
    ]);
  }
}

export default UserPgRepository;

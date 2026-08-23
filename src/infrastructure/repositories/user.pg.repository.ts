import { Pool } from "pg";
import User from "../../domains/user/entities/user.entity.js";
import IUserRepository from "../../domains/user/repositories/iuser.repository.js";
import IDatabaseClient from "../../domains/shared/interfaces/idatabase.client.js";
import DatabaseError from "../../shared/errors/database.error.js";

interface UserRow {
  id: string;
  email: string;
  username: string;
  password_hash: string;
  role: "user" | "admin" | "super_admin";
  wallet_balance: number;
  is_email_verified: boolean;
  wrong_password_number: number;
  wrong_password_until: Date | null;
  password_change_try: number;
  password_change_locked_until: Date | null;
  token_version: number;
  created_at: Date;
  updated_at: Date;
}

class UserPgRepository implements IUserRepository {
  constructor(private readonly pool: Pool) {}

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.pool.query<UserRow>(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return User.fromDB(row);
  }

  async findByUsername(username: string): Promise<User | null> {
    const result = await this.pool.query<UserRow>(
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
    const result = await client.query<UserRow>(
      "SELECT * FROM users WHERE id = $1 FOR UPDATE",
      [userId],
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return User.fromDB(row);
  }

  async readById(userId: string): Promise<User | null> {
    const result = await this.pool.query<UserRow>(
      "SELECT * FROM users WHERE id = $1",
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
      wrong_password_number, wrong_password_until, token_version,
      created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
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
        user.tokenVersion,
        user.createdAt,
        user.updatedAt,
      ]);
    } catch (error) {
      throw DatabaseError.fromPGError(error);
    }
  }

  async saveAdmin(
    user: User,
    maxAdmins: number,
    client: IDatabaseClient,
  ): Promise<boolean> {
    const query = `
    INSERT INTO users (
    id, email, username, password_hash, role, wallet_balance,
    is_email_verified, password_change_try, password_change_locked_until,
    wrong_password_number, wrong_password_until, token_version,
    created_at, updated_at
    )
    SELECT $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
    WHERE (SELECT COUNT(*) FROM users WHERE role = 'admin') < $15
      `;
    try {
      const result = await client.query(query, [
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
        user.tokenVersion,
        user.createdAt,
        user.updatedAt,
        maxAdmins,
      ]);

      return result.rowCount > 0;
    } catch (error) {
      throw DatabaseError.fromPGError(error);
    }
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

  async increaseVersion(
    userId: string,
    client: IDatabaseClient,
  ): Promise<number> {
    const query = `
    UPDATE users 
    SET token_version = token_version + 1 
    WHERE id = $1 
    RETURNING token_version
    `;
    const result = await client.query<{ token_version: number }>(query, [
      userId,
    ]);

    return result.rows[0].token_version;
  }
}

export default UserPgRepository;

import { Pool } from "pg";
import User from "../../domains/user/entities/user.entity.js";
import IUserRepository from "../../domains/user/repositories/iuser.repository.js";
import IDatabaseClient from "../../domains/shared/interfaces/idatabase.client.js";
import DatabaseError from "../../shared/errors/database.error.js";

interface UserRow {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: "user" | "admin" | "super_admin";
  email: string;
  address: string | null;
  phone_number: string | null;
  username: string;
  password_hash: string;
  card_number: string | null;
  birth_date: Date | null;
  password_change_try: number;
  password_change_locked_until: Date | null;
  wrong_password_number: number;
  wrong_password_until: Date | null;
  is_profile_completed: boolean;
  is_email_verified: boolean;
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

  async readByIdentifier(
    identifier: string,
  ): Promise<Pick<User, "id" | "email"> | null> {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const result = await this.pool.query<{ id: string; email: string }>(
      `SELECT id, email FROM users WHERE ${isEmail ? "email" : "username"} = $1`,
      [identifier],
    );
    if (result.rows.length === 0) return null;
    return result.rows[0];
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
        id, first_name, last_name, role, email, address, phone_number,
        username, password_hash, card_number, birth_date,
        password_change_try, password_change_locked_until,
        wrong_password_number, wrong_password_until,
        is_profile_completed, is_email_verified, token_version,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      `;
    try {
      await client.query(query, [
        user.id,
        user.firstName,
        user.lastName,
        user.role,
        user.email,
        user.address,
        user.phoneNumber,
        user.username,
        user.passwordHash,
        user.cardNumber,
        user.birthDate,
        user.passwordChangeTry,
        user.passwordChangeLockedUntil,
        user.wrongPasswordNumber,
        user.wrongPasswordUntil,
        user.isProfileCompleted,
        user.isEmailVerified,
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
        id, first_name, last_name, role, email, address, phone_number,
        username, password_hash, card_number, birth_date,
        password_change_try, password_change_locked_until,
        wrong_password_number, wrong_password_until,
        is_profile_completed, is_email_verified, token_version,
        created_at, updated_at
      )
      SELECT $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
      WHERE (SELECT COUNT(*) FROM users WHERE role = 'admin') < $21
      `;
    try {
      const result = await client.query(query, [
        user.id,
        user.firstName,
        user.lastName,
        user.role,
        user.email,
        user.address,
        user.phoneNumber,
        user.username,
        user.passwordHash,
        user.cardNumber,
        user.birthDate,
        user.passwordChangeTry,
        user.passwordChangeLockedUntil,
        user.wrongPasswordNumber,
        user.wrongPasswordUntil,
        user.isProfileCompleted,
        user.isEmailVerified,
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

  async updateUserProfile(
    userId: string,
    data: {
      firstName: string;
      lastName: string;
      address: string;
      phoneNumber: string;
      birthDate?: Date | null;
    },
    client: IDatabaseClient,
  ): Promise<number> {
    const query = `
    UPDATE users 
    SET 
      first_name = $1,
      last_name = $2,
      address = $3,
      phone_number = $4,
      birth_date = $5,
      is_profile_completed = true,
      updated_at = NOW()
    WHERE id = $6 AND is_profile_completed = false
  `;
    const result = await client.query(query, [
      data.firstName,
      data.lastName,
      data.address,
      data.phoneNumber,
      data.birthDate ?? null,
      userId,
    ]);

    return result.rowCount ?? 0;
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

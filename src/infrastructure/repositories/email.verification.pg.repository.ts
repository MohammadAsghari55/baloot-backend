import { Pool, PoolClient } from "pg";
import EmailVerification from "../../domains/user/entities/email.verification.entity.js";
import IEmailVerificationRepository from "../../domains/user/repositories/email.verification.repository.js";
import DatabaseError from "../../shared/errors/database.error.js";

class EmailVerificationPgRepository implements IEmailVerificationRepository {
  constructor(private readonly pool: Pool) {}

  async findByUserId(
    userId: string,
    client?: PoolClient,
  ): Promise<EmailVerification | null> {
    const dbClient = client || this.pool;
    const result = await dbClient.query(
      "SELECT * FROM email_verifications WHERE user_id = $1",
      [userId],
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return EmailVerification.fromDB(row);
  }

  async save(
    emailVerification: EmailVerification,
    client?: PoolClient,
  ): Promise<void> {
    const dbClient = client || this.pool;
    const query = `
    INSERT INTO email_verifications (
    id,user_id,code, expires_at)
    VALUES ($1, $2, $3, $4)
    `;
    try {
      await dbClient.query(query, [
        emailVerification.id,
        emailVerification.userId,
        emailVerification.code,
        emailVerification.expiresAt,
      ]);
    } catch (error) {
      throw DatabaseError.fromPGError(error);
    }
  }

  async deleteByUserId(userId: string, client?: PoolClient): Promise<void> {
    const dbClient = client || this.pool;
    const query = `
    DELETE FROM email_verifications 
    WHERE user_id = $1 
    `;
    try {
      await dbClient.query(query, [userId]);
    } catch (error) {
      throw DatabaseError.fromPGError(error);
    }
  }
}
export default EmailVerificationPgRepository;

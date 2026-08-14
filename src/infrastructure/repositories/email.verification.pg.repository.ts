import EmailVerification from "../../domains/user/entities/email.verification.entity.js";
import IEmailVerificationRepository from "../../domains/user/repositories/iemail.verification.repository.js";
import IDatabaseClient from "../../domains/shared/interfaces/idatabase.client.js";
import DatabaseError from "../../shared/errors/database.error.js";

interface EmailVerificationRow {
  id: string;
  user_id: string;
  code: string;
  created_at: Date;
  updated_at: Date;
  expires_at: Date;
}

class EmailVerificationPgRepository implements IEmailVerificationRepository {
  async findByUserId(
    userId: string,
    client: IDatabaseClient,
  ): Promise<EmailVerification | null> {
    const result = await client.query<EmailVerificationRow>(
      "SELECT * FROM email_verifications WHERE user_id = $1 FOR UPDATE",
      [userId],
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return EmailVerification.fromDB(row);
  }

  async save(
    emailVerification: EmailVerification,
    client: IDatabaseClient,
  ): Promise<void> {
    const query = `
    INSERT INTO email_verifications (
    id, user_id, code, updated_at, expires_at)
    VALUES ($1, $2, $3, $4, $5)
    `;
    try {
      await client.query(query, [
        emailVerification.id,
        emailVerification.userId,
        emailVerification.code,
        null,
        emailVerification.expiresAt,
      ]);
    } catch (error) {
      throw DatabaseError.fromPGError(error);
    }
  }

  async deleteByUserId(userId: string, client: IDatabaseClient): Promise<void> {
    const query = `
    DELETE FROM email_verifications 
    WHERE user_id = $1 
    `;
    try {
      await client.query(query, [userId]);
    } catch (error) {
      throw DatabaseError.fromPGError(error);
    }
  }

  async updateUpdatedAt(
    userId: string,
    client: IDatabaseClient,
  ): Promise<void> {
    await client.query(
      `UPDATE email_verifications SET updated_at = NOW() WHERE user_id = $1`,
      [userId],
    );
  }
}
export default EmailVerificationPgRepository;

import { PoolClient } from "pg";
import EmailVerification from "../entities/email.verification.entity.js";
interface IEmailVerificationRepository {
  findByUserId(
    userId: string,
    client?: PoolClient,
  ): Promise<EmailVerification | null>;

  save(
    emailVerification: EmailVerification,
    client?: PoolClient,
  ): Promise<void>;

  deleteByUserId(userId: string, client?: PoolClient): Promise<void>;

  updateUpdatedAt(userId: string, client?: PoolClient): Promise<void>;
}

export default IEmailVerificationRepository;

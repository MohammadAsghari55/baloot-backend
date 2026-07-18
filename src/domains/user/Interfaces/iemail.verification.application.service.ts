import { PoolClient } from "pg";
import EmailVerification from "../entities/email.verification.entity.js";
interface IEmailVerificationApplicationService {
  findByUserId(
    userId: string,
    client?: PoolClient,
  ): Promise<EmailVerification | null>;

  save(
    emailVerification: EmailVerification,
    client?: PoolClient,
  ): Promise<void>;

  delete(userId: string, client?: PoolClient): Promise<void>;

  update(userId: string, client?: PoolClient): Promise<void>;
}

export default IEmailVerificationApplicationService;

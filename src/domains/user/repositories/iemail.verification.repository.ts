import IDatabaseClient from "../../shared/interfaces/idatabase.client.js";
import EmailVerification from "../entities/email.verification.entity.js";
interface IEmailVerificationRepository {
  findByUserId(
    userId: string,
    client?: IDatabaseClient,
  ): Promise<EmailVerification | null>;

  save(
    emailVerification: EmailVerification,
    client?: IDatabaseClient,
  ): Promise<void>;

  deleteByUserId(userId: string, client?: IDatabaseClient): Promise<void>;

  updateUpdatedAt(userId: string, client?: IDatabaseClient): Promise<void>;
}

export default IEmailVerificationRepository;

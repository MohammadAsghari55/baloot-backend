import IDatabaseClient from "../../shared/interfaces/idatabase.client.js";
import EmailVerification from "../entities/email.verification.entity.js";
interface IEmailVerificationApplicationService {
  findByUserId(
    userId: string,
    client: IDatabaseClient,
  ): Promise<EmailVerification | null>;

  save(
    emailVerification: EmailVerification,
    client: IDatabaseClient,
  ): Promise<void>;

  delete(userId: string, client: IDatabaseClient): Promise<void>;
}

export default IEmailVerificationApplicationService;

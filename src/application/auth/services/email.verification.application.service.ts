import IDatabaseClient from "../../../domains/shared/interfaces/idatabase.client.js";
import IEmailVerificationApplicationService from "../../../domains/user/Interfaces/iemail.verification.application.service.js";
import IEmailVerificationRepository from "../../../domains/user/repositories/iemail.verification.repository.js";
import EmailVerification from "../../../domains/user/entities/email.verification.entity.js";

class EmailVerificationApplicationService implements IEmailVerificationApplicationService {
  constructor(
    private emailVerificationRepository: IEmailVerificationRepository,
  ) {}

  async findByUserId(
    userId: string,
    client?: IDatabaseClient,
  ): Promise<EmailVerification | null> {
    return this.emailVerificationRepository.findByUserId(userId, client);
  }

  async save(
    emailVerification: EmailVerification,
    client?: IDatabaseClient,
  ): Promise<void> {
    return this.emailVerificationRepository.save(emailVerification, client);
  }

  async delete(userId: string, client?: IDatabaseClient): Promise<void> {
    return this.emailVerificationRepository.deleteByUserId(userId, client);
  }

  async update(userId: string, client?: IDatabaseClient): Promise<void> {
    return this.emailVerificationRepository.updateUpdatedAt(userId, client);
  }
}
export default EmailVerificationApplicationService;

import IVerificationService from "../../../domains/user/Interfaces/iverification.service.js";
import IEmailService from "../../../domains/user/Interfaces/iemail.service.js";
import AppError from "../../../shared/errors/app.error.js";
import { randomInt } from "crypto";

class VerificationService implements IVerificationService {
  constructor(private emailService: IEmailService) {}
  generateVerificationCode(): string {
    return randomInt(100000, 999999).toString();
  }
  async emailSender(email: string, code: string): Promise<void> {
    try {
      await this.emailService.verify();
      await this.emailService.sendVerificationEmail(email, code);
    } catch (error) {
      throw AppError.internalWithOptions("EMAIL_SEND_FAILED", {
        publicMessage:
          "Failed to send verification email. Please try again later.",
        cause: error,
      });
    }
  }
}

export default VerificationService;

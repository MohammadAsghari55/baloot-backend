import IEmailOrchestrationService from "../../../domains/user/Interfaces/iemail.orchestration.service.js";
import IEmailService from "../../../domains/user/Interfaces/iemail.service.js";
import AppError from "../../../shared/errors/app.error.js";
import { randomInt } from "crypto";

class EmailOrchestrationService implements IEmailOrchestrationService {
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

  async notifEmailSender(email: string): Promise<void> {
    try {
      await this.emailService.verify();
      await this.emailService.sendPasswordChangeNotification(email);
    } catch (error) {
      throw AppError.internalWithOptions("EMAIL_SEND_FAILED", {
        publicMessage:
          "Failed to send password change notification email. Please try again later.",
        cause: error,
      });
    }
  }
}

export default EmailOrchestrationService;

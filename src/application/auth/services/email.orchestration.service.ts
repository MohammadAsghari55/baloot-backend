import IEmailOrchestrationService from "../../../domains/user/Interfaces/iemail.orchestration.service.js";
import IEmailService from "../../../domains/user/Interfaces/iemail.service.js";
import AppError from "../../../shared/errors/app.error.js";
import { randomInt } from "crypto";
import { logger } from "../../../infrastructure/logger/winston.index.js";

class EmailOrchestrationService implements IEmailOrchestrationService {
  constructor(private emailService: IEmailService) {}
  generateVerificationCode(): string {
    return randomInt(100000, 999999).toString();
  }
  async sendVerificationEmail(email: string, code: string): Promise<void> {
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

  async sendVerificationEmailWithWarning(
    email: string,
    code: string,
  ): Promise<string | undefined> {
    try {
      await this.sendVerificationEmail(email, code);
      return undefined;
    } catch (error) {
      const appError = AppError.internalWithOptions("EMAIL_SEND_FAILED", {
        publicMessage:
          "Failed to send verification email. Please try again later.",
        cause: error,
      });
      logger.error("Failed to send verification email:", {
        code: appError.code,
        message: appError.message,
        publicMessage: appError.publicMessage,
        cause: appError.cause,
      });

      return "Verification email could not be sent. Please request a new code.";
    }
  }

  async sendNotificationEmail(email: string): Promise<void> {
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

  async sendNotificationEmailWithWarning(
    email: string,
  ): Promise<string | undefined> {
    try {
      await this.sendNotificationEmail(email);
      return undefined;
    } catch (error) {
      const appError = AppError.internalWithOptions("EMAIL_SEND_FAILED", {
        publicMessage: "Failed to send notification email.",
        cause: error,
      });

      logger.error("Failed to send notification email:", {
        code: appError.code,
        message: appError.message,
        publicMessage: appError.publicMessage,
        cause: appError.cause,
      });

      return "Notification email could not be sent.";
    }
  }
}

export default EmailOrchestrationService;

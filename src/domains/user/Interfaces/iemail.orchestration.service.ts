interface IEmailOrchestrationService {
  generateVerificationCode(): string;

  sendVerificationEmail(email: string, code: string): Promise<void>;

  sendVerificationEmailWithWarning(
    email: string,
    code: string,
  ): Promise<string | undefined>;

  sendNotificationEmail(email: string): Promise<void>;

  sendNotificationEmailWithWarning(email: string): Promise<string | undefined>;
}

export default IEmailOrchestrationService;

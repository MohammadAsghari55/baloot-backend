interface IVerificationService {
  generateVerificationCode(): string;

  emailSender(email: string, code: string): Promise<void>;

  notifEmailSender(email: string): Promise<void>;
}

export default IVerificationService;

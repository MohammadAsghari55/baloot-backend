interface IVerificationService {
  generateVerificationCode(): string;

  emailSender(email: string, code: string): Promise<void>;
}

export default IVerificationService;

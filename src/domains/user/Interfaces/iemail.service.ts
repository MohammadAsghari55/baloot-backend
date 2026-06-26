interface IEmailService {
  verify(): Promise<void>;
  sendVerificationEmail(to: string, code: string): Promise<void>;
}

export default IEmailService;

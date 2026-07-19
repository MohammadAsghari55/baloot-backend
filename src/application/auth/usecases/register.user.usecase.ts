import { RegisterDto } from "../../../shared/validators/auth/register.schema.js";
import ITransactionManager from "../../../shared/interfaces/itransaction.manager.js";
import UserDomainService from "../../../domains/user/services/user.domain.service.js";
import IUserApplicationService from "../../../domains/user/Interfaces/iuser.application.service.js";
import IBcryptService from "../../../domains/user/Interfaces/ibcrypt.service.js";
import IEmailOrchestrationService from "../../../domains/user/Interfaces/iemail.orchestration.service.js";
import IEmailVerificationApplicationService from "../../../domains/user/Interfaces/iemail.verification.application.service.js";
import EmailVerification from "../../../domains/user/entities/email.verification.entity.js";
import AppError from "../../../shared/errors/app.error.js";

class RegisterUserUseCase {
  constructor(
    private transactionManager: ITransactionManager,
    private userDomainService: UserDomainService,
    private userApplicationService: IUserApplicationService,
    private bcryptService: IBcryptService,
    private emailOrchestrationService: IEmailOrchestrationService,
    private emailVerificationApplicationService: IEmailVerificationApplicationService,
  ) {}

  async execute(dto: RegisterDto) {
    if (dto.role && dto.role !== "user") {
      throw AppError.forbidden("INVALID_ROLE");
    }
    if (dto.password !== dto.confirmPassword) {
      throw AppError.validation("PASSWORD_MISMATCH");
    }

    const { user, code, response } =
      await this.transactionManager.runInTransaction(async (client) => {
        const existingEmail = await this.userApplicationService.findUserByEmail(
          dto.email,
          client,
        );

        const existingUsername =
          await this.userApplicationService.findUserByUsername(
            dto.username,
            client,
          );

        await this.userDomainService.checkUniqueness(
          existingEmail,
          existingUsername,
        );

        const hashedPassword = await this.bcryptService.hash(dto.password);

        const user = this.userDomainService.createUser(
          dto.email,
          dto.username,
          hashedPassword,
          "user",
        );

        await this.userApplicationService.saveUser(user, client);

        const code = this.emailOrchestrationService.generateVerificationCode();
        const emailVerification = EmailVerification.createNew(user.id, code);

        await this.emailVerificationApplicationService.save(
          emailVerification,
          client,
        );

        return {
          user,
          code,
          response: {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
          },
        };
      });
    let warning: string | undefined;

    try {
      await this.emailOrchestrationService.emailSender(user.email, code);
    } catch (error) {
      warning =
        "User registered, but verification email could not be sent. Please request a new code.";
      const appError = AppError.internalWithOptions("EMAIL_SEND_FAILED", {
        publicMessage:
          "Failed to send verification email. Please request a new code later.",
        cause: error,
      });

      console.error(
        JSON.stringify({
          code: appError.code,
          message: appError.message,
          publicMessage: appError.publicMessage,
          cause: appError.cause,
        }),
      );
    }

    return { response, warning };
  }
}

export default RegisterUserUseCase;

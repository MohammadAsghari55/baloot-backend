import { ResendVerificationDto } from "../../../application/auth/dtos/resend.verification.dto.js";
import ITransactionManager from "../../../shared/interfaces/itransaction.manager.js";
import UserApplicationService from "../../../application/auth/services/user.application.service.js";
import IVerificationService from "../../../domains/user/Interfaces/iverification.service.js";
import IEmailVerificationRepository from "../../../domains/user/repositories/iemail.verification.repository.js";
import EmailVerification from "../../../domains/user/entities/email.verification.entity.js";
import AppError from "../../../shared/errors/app.error.js";

class ResendVerificationUseCase {
  constructor(
    private transactionManager: ITransactionManager,
    private userApplicationService: UserApplicationService,
    private verificationService: IVerificationService,
    private emailVerificationRepository: IEmailVerificationRepository,
  ) {}

  async execute(dto: ResendVerificationDto) {
    const { user, code, response } =
      await this.transactionManager.runInTransaction(async (client) => {
        const user = await this.userApplicationService.findUserByIdentifier(
          dto.identifier,
          client,
        );

        if (!user) {
          throw AppError.notFound("NOT_FOUND");
        }

        if (user.isEmailVerified) {
          throw AppError.badRequest("ALREADY_VERIFIED");
        }

        const tableEmailVerification =
          await this.emailVerificationRepository.findByUserId(user.id, client);
        let code: string;

        if (
          tableEmailVerification &&
          tableEmailVerification.expiresAt > new Date()
        ) {
          code = tableEmailVerification.code;
        } else {
          if (tableEmailVerification) {
            await this.emailVerificationRepository.deleteByUserId(
              user.id,
              client,
            );
          }
          code = this.verificationService.generateVerificationCode();
          const emailVerification = EmailVerification.createNew(user.id, code);
          await this.emailVerificationRepository.save(
            emailVerification,
            client,
          );
        }
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
      await this.verificationService.emailSender(user.email, code);
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

export default ResendVerificationUseCase;

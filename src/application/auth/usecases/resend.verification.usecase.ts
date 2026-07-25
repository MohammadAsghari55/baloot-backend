import { ResendVerificationDto } from "../../../application/auth/dtos/resend.verification.dto.js";
import ITransactionManager from "../../../shared/interfaces/itransaction.manager.js";
import IUserApplicationService from "../../../domains/user/Interfaces/iuser.application.service.js";
import IEmailOrchestrationService from "../../../domains/user/Interfaces/iemail.orchestration.service.js";
import IEmailVerificationApplicationService from "../../../domains/user/Interfaces/iemail.verification.application.service.js";
import EmailVerification from "../../../domains/user/entities/email.verification.entity.js";
import UserResponseDto from "../dtos/user.response.dto.js";
import AppError from "../../../shared/errors/app.error.js";
import config from "../../../infrastructure/config/env.index.js";

class ResendVerificationUseCase {
  constructor(
    private transactionManager: ITransactionManager,
    private userApplicationService: IUserApplicationService,
    private emailOrchestrationService: IEmailOrchestrationService,
    private emailVerificationApplicationService: IEmailVerificationApplicationService,
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

        const existEmail =
          await this.emailVerificationApplicationService.findByUserId(
            user.id,
            client,
          );

        let code: string;

        if (existEmail && existEmail.expiresAt > new Date()) {
          if (existEmail.updatedAt) {
            const lastResend = Date.now() - existEmail.updatedAt.getTime();

            if (lastResend < config.RESEND_LIMIT_VALID) {
              throw AppError.fromCode("TOO_MANY_REQUESTS");
            }
          }
          code = existEmail.code;
          await this.emailVerificationApplicationService.update(
            user.id,
            client,
          );
        } else {
          if (existEmail) {
            const creationEmail = Date.now() - existEmail.createdAt.getTime();
            if (creationEmail < config.RESEND_LIMIT_EXPIRED) {
              throw AppError.fromCode("TOO_MANY_REQUESTS");
            }

            await this.emailVerificationApplicationService.delete(
              user.id,
              client,
            );
          }

          code = this.emailOrchestrationService.generateVerificationCode();
          const emailVerification = EmailVerification.createNew(user.id, code);
          await this.emailVerificationApplicationService.save(
            emailVerification,
            client,
          );
        }

        const userDto: UserResponseDto = {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        };

        return {
          user,
          code,
          response: userDto,
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

export default ResendVerificationUseCase;

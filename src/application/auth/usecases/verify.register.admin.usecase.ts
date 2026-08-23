import { VerifyRegisterDto } from "../../../shared/validators/auth/verify.register.schema.js";
import ITransactionManager from "../../../shared/interfaces/itransaction.manager.js";
import UserDomainService from "../../../domains/user/services/user.domain.service.js";
import IUserApplicationService from "../../../domains/user/Interfaces/iuser.application.service.js";
import IEmailOrchestrationService from "../../../domains/user/Interfaces/iemail.orchestration.service.js";
import IEmailVerificationApplicationService from "../../../domains/user/Interfaces/iemail.verification.application.service.js";
import IPasswordHistoryApplicationService from "../../../domains/user/Interfaces/ipassword.history.application.service.js";
import IRegisterAdminService from "../../../domains/user/Interfaces/iregister.admin.service.js";
import EmailVerification from "../../../domains/user/entities/email.verification.entity.js";
import UserResponseDto from "../dtos/user.response.dto.js";
import AppError from "../../../shared/errors/app.error.js";

class VerifyRegisterAdminUseCase {
  constructor(
    private transactionManager: ITransactionManager,
    private userDomainService: UserDomainService,
    private userApplicationService: IUserApplicationService,
    private emailOrchestrationService: IEmailOrchestrationService,
    private emailVerificationApplicationService: IEmailVerificationApplicationService,
    private passwordHistoryApplicationService: IPasswordHistoryApplicationService,
    private registerAdminService: IRegisterAdminService,
  ) {}

  async execute(dto: VerifyRegisterDto, userId: string, userRole: string) {
    if (userRole !== "super_admin") {
      throw AppError.forbidden("INVALID_ROLE");
    }

    const redisNewAdmin =
      await this.registerAdminService.getPendingAdmin(userId);

    if (!redisNewAdmin) {
      throw AppError.unauthorized("INVALID_CREDENTIALS");
    }

    if (dto.code !== redisNewAdmin.code) {
      throw AppError.unauthorized("INVALID_CREDENTIALS");
    }

    const { user, code, response } =
      await this.transactionManager.runInTransaction(async (client) => {
        const user = this.userDomainService.createUser(
          redisNewAdmin.email,
          redisNewAdmin.username,
          redisNewAdmin.passwordHash,
          redisNewAdmin.role,
        );

        await this.userApplicationService.save(user, client);

        const code = this.emailOrchestrationService.generateVerificationCode();
        const emailVerification = EmailVerification.createNew(user.id, code);

        await this.emailVerificationApplicationService.save(
          emailVerification,
          client,
        );

        await this.passwordHistoryApplicationService.save(
          user.id,
          redisNewAdmin.passwordHash,
          client,
        );

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

    await this.registerAdminService.deletePendingAdmin(userId);

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

export default VerifyRegisterAdminUseCase;

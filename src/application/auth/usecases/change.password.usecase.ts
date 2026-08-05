import { ChangePasswordDto } from "../dtos/change.password.dto.js";
import ITransactionManager from "../../../shared/interfaces/itransaction.manager.js";
import IUserApplicationService from "../../../domains/user/Interfaces/iuser.application.service.js";
import IBcryptService from "../../../domains/user/Interfaces/ibcrypt.service.js";
import IEmailOrchestrationService from "../../../domains/user/Interfaces/iemail.orchestration.service.js";
import ITokenManagementApplicationService from "../../../domains/user/Interfaces/itoken.management.application.service.js";
import ISessionManagementApplicationService from "../../../domains/user/Interfaces/isession.management.application.service.js";
import AppError from "../../../shared/errors/app.error.js";

class ChangePasswordUseCase {
  constructor(
    private transactionManager: ITransactionManager,
    private userApplicationService: IUserApplicationService,
    private bcryptService: IBcryptService,
    private emailOrchestrationService: IEmailOrchestrationService,
    private tokenManagementApplicationService: ITokenManagementApplicationService,
    private sessionManagementApplicationService: ISessionManagementApplicationService,
  ) {}

  async execute(
    dto: ChangePasswordDto,
    userId: string,
    deviceId: string,
  ): Promise<void> {
    const { oldPassword, newPassword } = dto;

    const userEmail = await this.transactionManager.runInTransaction(
      async (client) => {
        const user = await this.userApplicationService.findUserById(
          userId,
          client,
        );

        if (!user) {
          throw AppError.notFound("NOT_FOUND");
        }

        const isMatch = await this.bcryptService.compare(
          oldPassword,
          user.passwordHash,
        );

        if (!isMatch) {
          throw AppError.unauthorized("INVALID_CREDENTIALS");
        }

        if (oldPassword === newPassword) {
          throw AppError.badRequest("SAME_PASSWORD");
        }

        const hashedPassword = await this.bcryptService.hash(newPassword);

        await this.userApplicationService.updatePassword(
          user.id,
          hashedPassword,
          client,
        );

        await this.tokenManagementApplicationService.revokeAll(user.id, client);

        await this.sessionManagementApplicationService.increaseVersion(
          user.id,
          deviceId,
        );

        return user.email;
      },
    );

    try {
      await this.emailOrchestrationService.notifEmailSender(userEmail);
    } catch (error) {
      const appError = AppError.internalWithOptions("EMAIL_SEND_FAILED", {
        publicMessage: "Failed to send Notification email.",
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
  }
}

export default ChangePasswordUseCase;

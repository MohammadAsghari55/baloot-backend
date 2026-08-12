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

    const result = await this.transactionManager.runInTransaction(
      async (client) => {
        const user = await this.userApplicationService.findUserById(
          userId,
          client,
        );

        if (!user) {
          throw AppError.notFound("NOT_FOUND");
        }

        let passwordChangeTry = user.passwordChangeTry;
        let passwordChangeLockedUntil = user.passwordChangeLockedUntil;

        if (
          passwordChangeLockedUntil &&
          passwordChangeLockedUntil < new Date()
        ) {
          passwordChangeTry = 0;
          passwordChangeLockedUntil = null;
        }

        if (
          passwordChangeLockedUntil &&
          passwordChangeLockedUntil >= new Date()
        ) {
          if (passwordChangeTry === 0) {
            throw AppError.fromCode("PASSWORD_RECENTLY_CHANGED");
          } else {
            throw AppError.fromCode("PASSWORD_CHANGE_LOCKED");
          }
        }

        const isMatch = await this.bcryptService.compare(
          oldPassword,
          user.passwordHash,
        );

        if (!isMatch) {
          passwordChangeTry++;
          if (passwordChangeTry >= 3) {
            passwordChangeLockedUntil = new Date(
              Date.now() + 24 * 60 * 60 * 1000,
            );
          }

          await this.userApplicationService.updatePasswordChangeFields(
            user.id,
            passwordChangeTry,
            passwordChangeLockedUntil,
            client,
          );
          return { success: false as const };
        }

        if (oldPassword === newPassword) {
          throw AppError.badRequest("SAME_PASSWORD");
        }

        const hashedPassword = await this.bcryptService.hash(newPassword);

        passwordChangeTry = 0;

        passwordChangeLockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await this.userApplicationService.updatePassword(
          user.id,
          hashedPassword,
          passwordChangeTry,
          passwordChangeLockedUntil,
          client,
        );

        await this.tokenManagementApplicationService.revokeAll(user.id, client);

        await this.sessionManagementApplicationService.increaseVersion(
          user.id,
          deviceId,
        );
        return {
          success: true as const,
          email: user.email,
        };
      },
    );

    if (!result.success) {
      throw AppError.unauthorized("INVALID_CREDENTIALS");
    }

    try {
      await this.emailOrchestrationService.notifEmailSender(result.email);
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

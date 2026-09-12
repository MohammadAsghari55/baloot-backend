import { ResetPasswordDto } from "../dtos/reset.password.dto.js";
import ITransactionManager from "../../../shared/interfaces/itransaction.manager.js";
import IUserApplicationService from "../../../domains/user/Interfaces/iuser.application.service.js";
import IBcryptService from "../../../domains/user/Interfaces/ibcrypt.service.js";
import IEmailOrchestrationService from "../../../domains/user/Interfaces/iemail.orchestration.service.js";
import ITokenManagementApplicationService from "../../../domains/user/Interfaces/itoken.management.application.service.js";
import IPasswordHistoryApplicationService from "../../../domains/user/Interfaces/ipassword.history.application.service.js";
import ISessionService from "../../../domains/user/Interfaces/isession.service.js";
import IForgetPasswordService from "../../../domains/user/Interfaces/iforget.password.service.js";
import AppError from "../../../shared/errors/app.error.js";
import { logger } from "../../../infrastructure/logger/winston.index.js";

class ResetPasswordUseCase {
  constructor(
    private transactionManager: ITransactionManager,
    private userApplicationService: IUserApplicationService,
    private bcryptService: IBcryptService,
    private emailOrchestrationService: IEmailOrchestrationService,
    private tokenManagementApplicationService: ITokenManagementApplicationService,
    private passwordHistoryApplicationService: IPasswordHistoryApplicationService,
    private sessionService: ISessionService,
    private forgetPasswordService: IForgetPasswordService,
  ) {}

  async execute(dto: ResetPasswordDto) {
    const userInfo = await this.userApplicationService.readByIdentifier(
      dto.identifier,
    );

    if (!userInfo) {
      throw AppError.unauthorized("INVALID_CREDENTIALS");
    }
    const resetCode = await this.forgetPasswordService.getResetCode(
      userInfo.id,
    );

    if (!resetCode) {
      throw AppError.unauthorized("INVALID_CREDENTIALS");
    }

    const isMatch = await this.bcryptService.compare(
      dto.code,
      resetCode.hashedCode,
    );

    if (!isMatch) {
      throw AppError.unauthorized("INVALID_CREDENTIALS");
    }

    const { user, response } = await this.transactionManager.runInTransaction(
      async (client) => {
        const user = await this.userApplicationService.findById(
          userInfo.id,
          client,
        );

        if (!user) {
          throw AppError.notFound("NOT_FOUND");
        }

        const deleted = await this.forgetPasswordService.deleteResetCode(
          userInfo.id,
        );

        if (!deleted) {
          throw AppError.unauthorized("INVALID_CREDENTIALS");
        }

        const hashedPassword = await this.bcryptService.hash(dto.newPassword);

        await this.userApplicationService.updatePassword(
          user.id,
          hashedPassword,
          0,
          null,
          client,
        );

        await this.passwordHistoryApplicationService.save(
          user.id,
          hashedPassword,
          client,
        );

        await this.passwordHistoryApplicationService.pruneHistory(
          user.id,
          client,
        );

        await this.tokenManagementApplicationService.revokeAllByUserId(
          user.id,
          client,
        );

        const newTokenVersion =
          await this.userApplicationService.increaseVersion(user.id, client);

        return {
          user,
          response: {
            success: true as const,
            newVersion: newTokenVersion,
          },
        };
      },
    );

    try {
      await this.sessionService.setVersion(
        user.id,
        response.newVersion,
        7 * 24 * 60 * 60,
      );
    } catch (error) {
      logger.error("Redis version sync failed after password change:", error);
    }

    await this.emailOrchestrationService.sendNotificationEmailWithWarning(
      user.email,
    );

    return response;
  }
}

export default ResetPasswordUseCase;

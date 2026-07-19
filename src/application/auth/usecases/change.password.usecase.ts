import { ChangePasswordDto } from "../dtos/change.password.dto.js";
import ITransactionManager from "../../../shared/interfaces/itransaction.manager.js";
import IUserApplicationService from "../../../domains/user/Interfaces/iuser.application.service.js";
import IBcryptService from "../../../domains/user/Interfaces/ibcrypt.service.js";
import IVerificationService from "../../../domains/user/Interfaces/iverification.service.js";
import ITokenManagementApplicationService from "../../../domains/user/Interfaces/itoken.management.application.service.js";
import AppError from "../../../shared/errors/app.error.js";

class ChangePasswordUseCase {
  constructor(
    private transactionManager: ITransactionManager,
    private userApplicationService: IUserApplicationService,
    private bcryptService: IBcryptService,
    private verificationService: IVerificationService,
    private tokenManagementApplicationService: ITokenManagementApplicationService,
  ) {}

  async execute(dto: ChangePasswordDto): Promise<void> {
    const { identifier, oldPassword, newPassword } = dto;

    const userEmail = await this.transactionManager.runInTransaction(
      async (client) => {
        const user = await this.userApplicationService.findUserByIdentifier(
          identifier,
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

        const hashedPassword = await this.bcryptService.hash(newPassword);

        await this.userApplicationService.updatePassword(
          user.id,
          hashedPassword,
          client,
        );

        await this.tokenManagementApplicationService.revokeAll(user.id, client);
        return user.email;
      },
    );

    try {
      await this.verificationService.notifEmailSender(userEmail);
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

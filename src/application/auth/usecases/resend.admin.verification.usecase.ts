import IUserApplicationService from "../../../domains/user/Interfaces/iuser.application.service.js";
import IEmailOrchestrationService from "../../../domains/user/Interfaces/iemail.orchestration.service.js";
import IRegisterAdminService from "../../../domains/user/Interfaces/iregister.admin.service.js";
import AppError from "../../../shared/errors/app.error.js";

class ResendAdminVerificationUseCase {
  constructor(
    private userApplicationService: IUserApplicationService,
    private emailOrchestrationService: IEmailOrchestrationService,
    private registerAdminService: IRegisterAdminService,
  ) {}
  async execute(userId: string, userRole: string) {
    if (userRole !== "super_admin") {
      throw AppError.forbidden("INVALID_ROLE");
    }

    const redisNewAdmin =
      await this.registerAdminService.getPendingAdmin(userId);

    if (!redisNewAdmin) {
      throw AppError.badRequest("NO_PENDING_REQUEST");
    }

    const user = await this.userApplicationService.readById(userId);

    if (!user) {
      throw AppError.unauthorized("INVALID_CREDENTIALS");
    }

    let warning: string | undefined;

    try {
      await this.emailOrchestrationService.emailSender(
        user.email,
        redisNewAdmin.code,
      );
    } catch (error) {
      warning =
        "verification email could not be sent. Please request a new code.";

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

    return warning;
  }
}

export default ResendAdminVerificationUseCase;

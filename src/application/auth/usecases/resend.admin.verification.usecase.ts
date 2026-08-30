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

    const warning =
      await this.emailOrchestrationService.sendVerificationEmailWithWarning(
        user.email,
        redisNewAdmin.code,
      );

    return warning;
  }
}

export default ResendAdminVerificationUseCase;

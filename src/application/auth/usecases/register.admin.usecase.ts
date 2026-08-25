import { RegisterDto } from "../../../shared/validators/auth/register.schema.js";
import UserDomainService from "../../../domains/user/services/user.domain.service.js";
import IUserApplicationService from "../../../domains/user/Interfaces/iuser.application.service.js";
import IBcryptService from "../../../domains/user/Interfaces/ibcrypt.service.js";
import IEmailOrchestrationService from "../../../domains/user/Interfaces/iemail.orchestration.service.js";
import IRegisterAdminService from "../../../domains/user/Interfaces/iregister.admin.service.js";
import AppError from "../../../shared/errors/app.error.js";

class RegisterAdminUseCase {
  constructor(
    private userDomainService: UserDomainService,
    private userApplicationService: IUserApplicationService,
    private bcryptService: IBcryptService,
    private emailOrchestrationService: IEmailOrchestrationService,
    private registerAdminService: IRegisterAdminService,
  ) {}

  async execute(dto: RegisterDto, userId: string, userRole: string) {
    if (userRole !== "super_admin") {
      throw AppError.forbidden("INVALID_ROLE");
    }

    const redisNewAdmin =
      await this.registerAdminService.getPendingAdmin(userId);

    if (redisNewAdmin) {
      throw AppError.fromCode("PENDING_ADMIN_REQUEST_EXISTS");
    }

    const existingEmail = await this.userApplicationService.findByEmail(
      dto.email,
    );

    const existingUsername = await this.userApplicationService.findByUsername(
      dto.username,
    );

    await this.userDomainService.checkUniqueness(
      existingEmail,
      existingUsername,
    );

    const user = await this.userApplicationService.readById(userId);

    if (!user) {
      throw AppError.unauthorized("INVALID_CREDENTIALS");
    }

    const hashedPassword = await this.bcryptService.hash(dto.password);

    const superAdminCreationCode =
      this.emailOrchestrationService.generateVerificationCode();

    const saved = await this.registerAdminService.savePendingAdmin(
      userId,
      {
        email: dto.email,
        username: dto.username,
        passwordHash: hashedPassword,
        role: "admin",
      },
      superAdminCreationCode,
    );

    if (!saved) {
      throw AppError.fromCode("TOO_MANY_REQUESTS");
    }

    let warning: string | undefined;

    try {
      await this.emailOrchestrationService.emailSender(
        user.email,
        superAdminCreationCode,
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

export default RegisterAdminUseCase;

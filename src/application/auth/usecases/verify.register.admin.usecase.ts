import { VerifyRegisterDto } from "../../../shared/validators/auth/verify.register.schema.js";
import ITransactionManager from "../../../shared/interfaces/itransaction.manager.js";
import UserDomainService from "../../../domains/user/services/user.domain.service.js";
import IUserApplicationService from "../../../domains/user/Interfaces/iuser.application.service.js";
import IBcryptService from "../../../domains/user/Interfaces/ibcrypt.service.js";
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
    private bcryptService: IBcryptService,
    private emailOrchestrationService: IEmailOrchestrationService,
    private emailVerificationApplicationService: IEmailVerificationApplicationService,
    private passwordHistoryApplicationService: IPasswordHistoryApplicationService,
    private registerAdminService: IRegisterAdminService,
    private readonly maxAdmins: number,
    private readonly expireTimeMs: number,
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

        const inserted = await this.userApplicationService.saveAdmin(
          user,
          this.maxAdmins,
          client,
        );

        if (!inserted) {
          throw AppError.forbidden("MAX_ADMINS_EXCEEDED");
        }

        const code = this.emailOrchestrationService.generateVerificationCode();

        const hashedCode = await this.bcryptService.hash(code);

        const emailVerification = EmailVerification.createNew(
          user.id,
          hashedCode,
          new Date(Date.now() + this.expireTimeMs),
        );

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

    const warning =
      await this.emailOrchestrationService.sendVerificationEmailWithWarning(
        user.email,
        code,
      );

    return { response, warning };
  }
}

export default VerifyRegisterAdminUseCase;

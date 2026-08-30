import { IdentifierDto } from "../../../application/auth/dtos/resend.verification.dto.js";
import IUserApplicationService from "../../../domains/user/Interfaces/iuser.application.service.js";
import IBcryptService from "../../../domains/user/Interfaces/ibcrypt.service.js";
import IEmailOrchestrationService from "../../../domains/user/Interfaces/iemail.orchestration.service.js";
import IForgetPasswordService from "../../../domains/user/Interfaces/iforget.password.service.js";
import AppError from "../../../shared/errors/app.error.js";

class ForgetPasswordUseCase {
  constructor(
    private userApplicationService: IUserApplicationService,
    private bcryptService: IBcryptService,
    private emailOrchestrationService: IEmailOrchestrationService,
    private forgetPasswordService: IForgetPasswordService,
  ) {}
  async execute(dto: IdentifierDto) {
    const userInfo = await this.userApplicationService.readByIdentifier(
      dto.identifier,
    );

    if (!userInfo) {
      throw AppError.unauthorized("INVALID_CREDENTIALS");
    }

    const resetCode = await this.forgetPasswordService.getResetCode(
      userInfo.id,
    );

    if (resetCode) {
      throw AppError.badRequest("TOO_MANY_REQUESTS");
    }

    const code = this.emailOrchestrationService.generateVerificationCode();

    const hashedCode = await this.bcryptService.hash(code);

    await this.forgetPasswordService.saveResetCode(userInfo.id, hashedCode);

    const warning =
      await this.emailOrchestrationService.sendVerificationEmailWithWarning(
        userInfo.email,
        code,
      );

    return warning;
  }
}

export default ForgetPasswordUseCase;

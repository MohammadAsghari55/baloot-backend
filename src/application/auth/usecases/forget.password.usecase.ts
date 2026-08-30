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

    let warning: string | undefined;

    try {
      await this.emailOrchestrationService.emailSender(userInfo.email, code);
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

export default ForgetPasswordUseCase;

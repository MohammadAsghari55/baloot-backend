import { IdentifierDto } from "../../../application/auth/dtos/resend.verification.dto.js";
import ITransactionManager from "../../../shared/interfaces/itransaction.manager.js";
import IUserApplicationService from "../../../domains/user/Interfaces/iuser.application.service.js";
import IBcryptService from "../../../domains/user/Interfaces/ibcrypt.service.js";
import IEmailOrchestrationService from "../../../domains/user/Interfaces/iemail.orchestration.service.js";
import IEmailVerificationApplicationService from "../../../domains/user/Interfaces/iemail.verification.application.service.js";
import EmailVerification from "../../../domains/user/entities/email.verification.entity.js";
import UserResponseDto from "../dtos/user.response.dto.js";
import AppError from "../../../shared/errors/app.error.js";

class ResendVerificationUseCase {
  constructor(
    private transactionManager: ITransactionManager,
    private userApplicationService: IUserApplicationService,
    private bcryptService: IBcryptService,
    private emailOrchestrationService: IEmailOrchestrationService,
    private emailVerificationApplicationService: IEmailVerificationApplicationService,
    private readonly expireTime: number,
  ) {}

  async execute(dto: IdentifierDto) {
    const { user, code, response } =
      await this.transactionManager.runInTransaction(async (client) => {
        const user = await this.userApplicationService.findByIdentifier(
          dto.identifier,
        );

        if (!user) {
          throw AppError.notFound("NOT_FOUND");
        }

        if (user.isEmailVerified) {
          throw AppError.badRequest("ALREADY_VERIFIED");
        }

        const existEmail =
          await this.emailVerificationApplicationService.findByUserId(
            user.id,
            client,
          );

        if (existEmail) {
          const timeSinceCreation = Date.now() - existEmail.createdAt.getTime();

          if (timeSinceCreation < this.expireTime) {
            throw AppError.fromCode("TOO_MANY_REQUESTS");
          }

          await this.emailVerificationApplicationService.delete(
            user.id,
            client,
          );
        }

        const newCode =
          this.emailOrchestrationService.generateVerificationCode();

        const hashedNewCode = await this.bcryptService.hash(newCode);

        const emailVerification = EmailVerification.createNew(
          user.id,
          hashedNewCode,
        );

        await this.emailVerificationApplicationService.save(
          emailVerification,
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
          code: newCode,
          response: userDto,
        };
      });

    const warning =
      await this.emailOrchestrationService.sendVerificationEmailWithWarning(
        user.email,
        code,
      );

    return { response, warning };
  }
}

export default ResendVerificationUseCase;

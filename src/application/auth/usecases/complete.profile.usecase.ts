import { CompleteProfileDto } from "../dtos/complete.profile.dto.js";
import ITransactionManager from "../../../shared/interfaces/itransaction.manager.js";
import IUserApplicationService from "../../../domains/user/Interfaces/iuser.application.service.js";
import ITokenManagementApplicationService from "../../../domains/user/Interfaces/itoken.management.application.service.js";
import ISessionService from "../../../domains/user/Interfaces/isession.service.js";
import AppError from "../../../shared/errors/app.error.js";

class CompleteProfileUseCase {
  constructor(
    private transactionManager: ITransactionManager,
    private userApplicationService: IUserApplicationService,
    private tokenManagementApplicationService: ITokenManagementApplicationService,
    private sessionService: ISessionService,
  ) {}

  async execute(dto: CompleteProfileDto, userId: string) {
    if (!dto.firstName || !dto.lastName || !dto.address || !dto.phoneNumber) {
      throw AppError.badRequest("MISSING_REQUIRED_FIELDS");
    }

    const { user, response } = await this.transactionManager.runInTransaction(
      async (client) => {
        const user = await this.userApplicationService.findById(userId, client);

        if (!user) {
          throw AppError.notFound("NOT_FOUND");
        }

        if (user.isProfileCompleted) {
          throw AppError.badRequest("PROFILE_ALREADY_COMPLETED");
        }

        const updateUser = await this.userApplicationService.updateUserProfile(
          user.id,
          {
            firstName: dto.firstName,
            lastName: dto.lastName,
            address: dto.address,
            phoneNumber: dto.phoneNumber,
            birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
          },
          client,
        );

        if (updateUser === 0) {
          throw AppError.badRequest("PROFILE_ALREADY_COMPLETED");
        }

        await this.tokenManagementApplicationService.revokeAllByUserId(
          user.id,
          client,
        );

        const newTokenVersion =
          await this.userApplicationService.increaseVersion(user.id, client);

        return {
          user,
          response: {
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
      console.error(
        "Redis version sync failed after profile completion:",
        error,
      );
    }

    return response;
  }
}

export default CompleteProfileUseCase;

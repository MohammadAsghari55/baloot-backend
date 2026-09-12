import ITransactionManager from "../../../shared/interfaces/itransaction.manager.js";
import IUserApplicationService from "../../../domains/user/Interfaces/iuser.application.service.js";
import ITokenManagementApplicationService from "../../../domains/user/Interfaces/itoken.management.application.service.js";
import ISessionManagementApplicationService from "../../../domains/user/Interfaces/isession.management.application.service.js";
import ISessionService from "../../../domains/user/Interfaces/isession.service.js";
import { logger } from "../../../infrastructure/logger/winston.index.js";

class LogoutUseCase {
  constructor(
    private transactionManager: ITransactionManager,
    private userApplicationService: IUserApplicationService,
    private tokenManagementApplicationService: ITokenManagementApplicationService,
    private sessionManagementApplicationService: ISessionManagementApplicationService,
    private sessionService: ISessionService,
  ) {}

  async execute(
    userId: string,
    deviceId: string,
    allDevice: boolean,
  ): Promise<void> {
    if (allDevice) {
      await this.logoutAllDevices(userId);
    } else {
      await this.logoutSingleDevice(userId, deviceId);
    }
  }

  private async logoutAllDevices(userId: string) {
    const newTokenVersion = await this.transactionManager.runInTransaction(
      async (client) => {
        await this.tokenManagementApplicationService.revokeAllByUserId(
          userId,
          client,
        );
        return this.userApplicationService.increaseVersion(userId, client);
      },
    );

    try {
      await this.sessionService.setVersion(
        userId,
        newTokenVersion,
        7 * 24 * 60 * 60,
      );
    } catch (error) {
      logger.error("Redis sync failed:", error);
    }
  }

  private async logoutSingleDevice(userId: string, deviceId: string) {
    await this.transactionManager.runInTransaction(async (client) => {
      await this.tokenManagementApplicationService.revokeByDeviceId(
        userId,
        deviceId,
        client,
      );
    });

    try {
      await this.sessionManagementApplicationService.inactiveSession(
        userId,
        deviceId,
      );
    } catch (error) {
      logger.error("Redis sync failed:", error);
    }
  }
}

export default LogoutUseCase;

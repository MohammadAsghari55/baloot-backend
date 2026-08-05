import ITransactionManager from "../../../shared/interfaces/itransaction.manager.js";
import ITokenManagementApplicationService from "../../../domains/user/Interfaces/itoken.management.application.service.js";
import ISessionManagementApplicationService from "../../../domains/user/Interfaces/isession.management.application.service.js";

class LogoutUseCase {
  constructor(
    private transactionManager: ITransactionManager,
    private tokenManagementApplicationService: ITokenManagementApplicationService,
    private sessionManagementApplicationService: ISessionManagementApplicationService,
  ) {}

  async execute(
    userId: string,
    deviceId: string,
    allDevice: boolean,
  ): Promise<void> {
    await this.transactionManager.runInTransaction(async (client) => {
      if (allDevice) {
        await this.tokenManagementApplicationService.revokeAll(userId, client);

        await this.sessionManagementApplicationService.increaseVersion(
          userId,
          deviceId,
        );
      } else {
        await this.tokenManagementApplicationService.revokeByDevice(
          userId,
          deviceId,
          client,
        );

        await this.sessionManagementApplicationService.inactiveSession(
          userId,
          deviceId,
        );
      }
    });
  }
}

export default LogoutUseCase;

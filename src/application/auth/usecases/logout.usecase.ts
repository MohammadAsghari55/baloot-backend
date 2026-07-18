import ITransactionManager from "../../../shared/interfaces/itransaction.manager.js";
import ITokenManagementApplicationService from "../../../domains/user/Interfaces/itoken.management.application.service.js";

class LogoutUseCase {
  constructor(
    private transactionManager: ITransactionManager,
    private tokenManagementApplicationService: ITokenManagementApplicationService,
  ) {}

  async execute(
    userId: string,
    deviceId: string,
    allDevice: boolean,
  ): Promise<void> {
    await this.transactionManager.runInTransaction(async (client) => {
      if (allDevice) {
        await this.tokenManagementApplicationService.revokeAll(userId, client);
      } else {
        await this.tokenManagementApplicationService.revokeByDevice(
          userId,
          deviceId,
          client,
        );
      }
    });
  }
}

export default LogoutUseCase;

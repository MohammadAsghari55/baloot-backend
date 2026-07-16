import ITransactionManager from "../../../shared/interfaces/itransaction.manager.js";
import IRefreshTokenRepository from "../../../domains/user/repositories/irefresh.token.repository.js";

class LogoutUseCase {
  constructor(
    private transactionManager: ITransactionManager,
    private refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(
    userId: string,
    deviceId: string,
    allDevice: boolean,
  ): Promise<void> {
    await this.transactionManager.runInTransaction(async (client) => {
      if (allDevice) {
        await this.refreshTokenRepository.revokeAllByUserId(userId, client);
      } else {
        await this.refreshTokenRepository.revokeByDeviceId(
          userId,
          deviceId,
          client,
        );
      }
    });
  }
}

export default LogoutUseCase;

import IDatabaseClient from "../../../domains/shared/interfaces/idatabase.client.js";
import IPasswordHistoryApplicationService from "../../../domains/user/Interfaces/ipassword.history.application.service.js";
import IPasswordHistoryRepository from "../../../domains/user/repositories/ipassword.history.repository.js";
import PasswordHistory from "../../../domains/user/entities/password.history.entity.js";

class PasswordHistoryApplicationService implements IPasswordHistoryApplicationService {
  constructor(private passwordHistoryRepository: IPasswordHistoryRepository) {}
  async findRecentByUserId(
    userId: string,
    limit: number,
    client: IDatabaseClient,
  ): Promise<PasswordHistory[]> {
    return this.passwordHistoryRepository.findRecentByUserId(
      userId,
      limit,
      client,
    );
  }

  async save(
    userId: string,
    passwordHash: string,
    client: IDatabaseClient,
  ): Promise<void> {
    return this.passwordHistoryRepository.save(userId, passwordHash, client);
  }

  async pruneHistory(userId: string, client: IDatabaseClient): Promise<void> {
    return this.passwordHistoryRepository.pruneHistory(userId, client);
  }
}

export default PasswordHistoryApplicationService;

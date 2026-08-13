import IDatabaseClient from "../../shared/interfaces/idatabase.client.js";
import PasswordHistory from "../entities/password.history.entity.js";
interface IPasswordHistoryRepository {
  findRecentByUserId(
    userId: string,
    limit: number,
    client: IDatabaseClient,
  ): Promise<PasswordHistory[]>;

  save(
    userId: string,
    passwordHash: string,
    client: IDatabaseClient,
  ): Promise<void>;

  pruneHistory(userId: string, client: IDatabaseClient): Promise<void>;
}

export default IPasswordHistoryRepository;

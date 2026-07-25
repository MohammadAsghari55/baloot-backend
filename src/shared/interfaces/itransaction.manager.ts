import IDatabaseClient from "../../domains/shared/interfaces/idatabase.client.js";

interface ITransactionManager {
  runInTransaction<T>(
    callback: (client: IDatabaseClient) => Promise<T>,
  ): Promise<T>;
}

export default ITransactionManager;

import { PoolClient } from "pg";

interface ITransactionManager {
  runInTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T>;
}

export default ITransactionManager;

import { Pool, PoolClient } from "pg";
import IDatabaseClient from "../../domains/shared/interfaces/idatabase.client.js";
import PgDatabaseClient from "./pg.database.client.js";
import ITransactionManager from "../../shared/interfaces/itransaction.manager.js";

class PgTransactionManager implements ITransactionManager {
  constructor(private pool: Pool) {}

  async runInTransaction<T>(
    callback: (client: IDatabaseClient) => Promise<T>,
  ): Promise<T> {
    const poolclient = await this.pool.connect();
    const dbClient = new PgDatabaseClient(poolclient);

    try {
      await poolclient.query("BEGIN");

      const result = await callback(dbClient);

      await poolclient.query("COMMIT");

      return result;
    } catch (error) {
      await poolclient.query("ROLLBACK");
      throw error;
    } finally {
      poolclient.release();
    }
  }
}

export default PgTransactionManager;

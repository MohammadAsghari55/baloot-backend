import { PoolClient } from "pg";
import IDatabaseClient from "../../domains/shared/interfaces/idatabase.client.js";

class PgDatabaseClient implements IDatabaseClient {
  constructor(private client: PoolClient) {}

  async query(sql: string, params?: any[]): Promise<any> {
    return this.client.query(sql, params);
  }
}

export default PgDatabaseClient;

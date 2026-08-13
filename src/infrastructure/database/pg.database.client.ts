import { PoolClient } from "pg";
import IDatabaseClient from "../../domains/shared/interfaces/idatabase.client.js";

class PgDatabaseClient implements IDatabaseClient {
  constructor(private client: PoolClient) {}

  async query<T = any>(sql: string, params?: any[]): Promise<{ rows: T[] }> {
    const result = await this.client.query(sql, params);
    return result;
  }
}

export default PgDatabaseClient;

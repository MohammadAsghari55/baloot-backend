import { PoolClient } from "pg";
import IDatabaseClient from "../../domains/shared/interfaces/idatabase.client.js";

class PgDatabaseClient implements IDatabaseClient {
  constructor(private client: PoolClient) {}

  async query<T = unknown>(
    sql: string,
    params?: unknown[],
  ): Promise<{ rows: T[]; rowCount: number }> {
    const result = await this.client.query(sql, params);
    return {
      rows: result.rows,
      rowCount: result.rowCount ?? 0,
    };
  }
}

export default PgDatabaseClient;

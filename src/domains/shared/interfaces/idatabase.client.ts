interface IDatabaseClient {
  query<T = any>(
    sql: string,
    params?: any[],
  ): Promise<{ rows: T[]; rowCount: number }>;
}

export default IDatabaseClient;

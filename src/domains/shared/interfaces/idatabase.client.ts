interface IDatabaseClient {
  query<T = any>(sql: string, params?: any[]): Promise<{ rows: T[] }>;
}

export default IDatabaseClient;

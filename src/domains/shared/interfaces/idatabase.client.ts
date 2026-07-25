interface IDatabaseClient {
  query(sql: string, params?: any[]): Promise<any>;
}

export default IDatabaseClient;

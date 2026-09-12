interface IRedisService {
  connect(): Promise<void>;

  set(key: string, value: unknown, ttl?: number): Promise<void>;

  setIfNotExists(key: string, value: string, ttl: number): Promise<boolean>;

  get<T = unknown>(key: string): Promise<T | null>;

  del(key: string): Promise<number>;

  incr(key: string): Promise<number>;

  exists(key: string): Promise<boolean>;

  keys(pattern: string): Promise<string[]>;

  quit(): Promise<void>;
}

export default IRedisService;

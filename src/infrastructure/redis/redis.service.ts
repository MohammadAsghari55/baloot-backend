import { createClient, RedisClientType } from "redis";
import IRedisService from "../../shared/interfaces/iredis.service.js";
import AppError from "../../shared/errors/app.error.js";
import config from "../config/env.index.js";

class RedisService implements IRedisService {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      socket: {
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error(
              "❌ Redis reconnect failed after 10 attempts, giving up",
            );
            return new Error("Redis unreachable");
          }
          return Math.min(retries * 100, 3000);
        },
      },
      password: config.REDIS_PASSWORD || undefined,
      database: config.REDIS_DB,
    });

    this.client.on("error", (err) => {
      console.error("❌ Redis Client Error:", err);
    });

    this.client.on("connect", () => {
      console.log("✅ Redis connected successfully");
    });

    this.connect().catch((err) => {
      console.error("❌ Initial Redis connection failed:", err.message);
    });
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      console.error(
        "❌ Redis initial connect failed, will retry via reconnectStrategy:",
        error,
      );
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const stringValue =
        typeof value === "string" ? value : JSON.stringify(value);
      if (ttl) {
        await this.client.setEx(key, ttl, stringValue);
      } else {
        await this.client.set(key, stringValue);
      }
    } catch (error) {
      throw new AppError(
        `Failed to set key "${key}" in Redis`,
        500,
        "REDIS_OPERATION_FAILED",
        { cause: error, isPublic: false },
      );
    }
  }

  async setIfNotExists(
    key: string,
    value: string,
    ttl: number,
  ): Promise<boolean> {
    try {
      const result = await this.client.set(key, value, {
        EX: ttl,
        NX: true,
      });
      return result === "OK";
    } catch (error) {
      throw new AppError(
        "Failed to set key in Redis",
        500,
        "REDIS_OPERATION_FAILED",
      );
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      throw new AppError(
        `Failed to get key "${key}" from Redis`,
        500,
        "REDIS_OPERATION_FAILED",
        { cause: error, isPublic: false },
      );
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      throw new AppError(
        `Failed to delete key "${key}" from Redis`,
        500,
        "REDIS_OPERATION_FAILED",
        { cause: error, isPublic: false },
      );
    }
  }

  async incr(key: string): Promise<number> {
    try {
      return await this.client.incr(key);
    } catch (error) {
      throw new AppError(
        `Failed to increment key "${key}" in Redis`,
        500,
        "REDIS_OPERATION_FAILED",
        { cause: error, isPublic: false },
      );
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      throw new AppError(
        `Failed to check existence of key "${key}" in Redis`,
        500,
        "REDIS_OPERATION_FAILED",
        { cause: error, isPublic: false },
      );
    }
  }

  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.client.keys(pattern);
    } catch (error) {
      throw new AppError(
        `Failed to list keys with pattern "${pattern}" in Redis`,
        500,
        "REDIS_OPERATION_FAILED",
        { cause: error, isPublic: false },
      );
    }
  }

  async quit(): Promise<void> {
    try {
      await this.client.quit();
    } catch (error) {
      console.warn("Redis quit error:", error);
    }
  }
}

const redisService = new RedisService();
export default redisService;

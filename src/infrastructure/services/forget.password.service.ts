import IRedisService from "../../shared/interfaces/iredis.service.js";
import IForgetPasswordService from "../../domains/user/Interfaces/iforget.password.service.js";
import ResetPasswordData from "../../type/reset.password.types.js";
import config from "../config/env.index.js";

class ForgetPasswordService implements IForgetPasswordService {
  constructor(private redisService: IRedisService) {}

  private getKey(userId: string): string {
    return `forget-password:${userId}`;
  }

  private readonly TTL = config.EXPIRE_TIME;

  async saveResetCode(userId: string, hashedCode: string): Promise<boolean> {
    const key = this.getKey(userId);

    const value: ResetPasswordData = {
      hashedCode,
      createdAt: Date.now(),
    };

    const result = await this.redisService.setIfNotExists(
      key,
      JSON.stringify(value),
      this.TTL,
    );

    return result;
  }

  async getResetCode(userId: string): Promise<ResetPasswordData | null> {
    const key = this.getKey(userId);
    const data = await this.redisService.get<string>(key);
    if (!data) return null;
    return JSON.parse(data) as ResetPasswordData;
  }

  async deleteResetCode(userId: string): Promise<void> {
    const key = this.getKey(userId);
    await this.redisService.del(key);
  }
}

export default ForgetPasswordService;

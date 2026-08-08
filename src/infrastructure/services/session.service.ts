import ISessionService from "../../domains/user/Interfaces/isession.service.js";
import IRedisService from "../../shared/interfaces/iredis.service.js";
import SessionData from "../../type/session.types.js";

class SessionService implements ISessionService {
  constructor(private redisService: IRedisService) {}

  async getSession(
    userId: string,
    deviceId: string,
  ): Promise<SessionData | null> {
    return this.redisService.get(`session:${userId}:${deviceId}`);
  }

  async setSession(
    userId: string,
    deviceId: string,
    data: SessionData,
    ttl: number,
  ): Promise<void> {
    await this.redisService.set(`session:${userId}:${deviceId}`, data, ttl);
  }

  async getVersion(userId: string): Promise<number | null> {
    return this.redisService.get(`version:${userId}`);
  }

  async setVersion(
    userId: string,
    version: number,
    ttl: number,
  ): Promise<void> {
    await this.redisService.set(`version:${userId}`, version, ttl);
  }
}

export default SessionService;

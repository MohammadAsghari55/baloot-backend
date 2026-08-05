import ISessionManagementApplicationService from "../../../domains/user/Interfaces/isession.management.application.service.js";
import IRedisService from "../../../shared/interfaces/iredis.service.js";
import AppError from "../../../shared/errors/app.error.js";
class SessionManagementApplicationService implements ISessionManagementApplicationService {
  constructor(private redisService: IRedisService) {}

  async inactiveSession(userId: string, deviceId: string): Promise<void> {
    const sessionKey = `session:${userId}:${deviceId}`;

    const session = await this.redisService.get<{
      status: string;
      version: number;
      expiresAt: number;
    }>(sessionKey);

    if (!session) {
      throw AppError.unauthorized("SESSION_INACTIVE");
    } else {
      await this.redisService.set(
        sessionKey,
        {
          status: "inactive",
          version: session.version,
          expiresAt: session.expiresAt,
        },
        60,
      );
    }
  }

  async increaseVersion(userId: string, deviceId: string): Promise<void> {
    let redisVersion = await this.redisService.get<number>(`version:${userId}`);

    if (!redisVersion) {
      const sessionKey = `session:${userId}:${deviceId}`;

      const session = await this.redisService.get<{
        status: string;
        version: number;
        expiresAt: number;
      }>(sessionKey);

      if (!session) {
        throw AppError.unauthorized("SESSION_INACTIVE");
      } else {
        redisVersion = session.version;
      }
    }
    const newVersion = (redisVersion ?? 0) + 1;

    await this.redisService.set(
      `version:${userId}`,
      newVersion,
      30 * 24 * 60 * 60,
    );
  }
}

export default SessionManagementApplicationService;

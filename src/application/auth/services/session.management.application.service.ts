import ISessionManagementApplicationService from "../../../domains/user/Interfaces/isession.management.application.service.js";
import ISessionService from "../../../domains/user/Interfaces/isession.service.js";
import AppError from "../../../shared/errors/app.error.js";

class SessionManagementApplicationService implements ISessionManagementApplicationService {
  constructor(private sessionService: ISessionService) {}

  async inactiveSession(userId: string, deviceId: string): Promise<void> {
    const session = await this.sessionService.getSession(userId, deviceId);

    if (!session) {
      throw AppError.unauthorized("SESSION_INACTIVE");
    } else {
      await this.sessionService.setSession(
        userId,
        deviceId,
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
    let redisVersion = await this.sessionService.getVersion(userId);

    if (!redisVersion) {
      const session = await this.sessionService.getSession(userId, deviceId);

      if (!session) {
        throw AppError.unauthorized("SESSION_INACTIVE");
      } else {
        redisVersion = session.version;
      }
    }
    const newVersion = (redisVersion ?? 0) + 1;

    await this.sessionService.setVersion(userId, newVersion, 30 * 24 * 60 * 60);
  }
}

export default SessionManagementApplicationService;

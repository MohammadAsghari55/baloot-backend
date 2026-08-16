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
        },
        60,
      );
    }
  }
}

export default SessionManagementApplicationService;

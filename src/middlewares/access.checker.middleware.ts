import { Request, Response, NextFunction } from "express";
import ISessionService from "../domains/user/Interfaces/isession.service.js";
import ITokenManagementApplicationService from "../domains/user/Interfaces/itoken.management.application.service.js";
import AppError from "../shared/errors/app.error.js";

const accessCheckerMiddleware = (
  sessionService: ISessionService,
  tokenManagementApplicationService: ITokenManagementApplicationService,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId || !req.deviceId || !req.role) {
      throw AppError.unauthorized("INVALID_ACCESS_TOKEN");
    }

    if (!req.tokenValidation) {
      throw AppError.unauthorized("ACCESS_TOKEN_EXPIRED");
    }

    const session = await sessionService.getSession(req.userId, req.deviceId);

    const redisVersion = await sessionService.getVersion(req.userId);

    if (session && session.status === "active" && redisVersion) {
      if (session.version !== redisVersion) {
        throw AppError.unauthorized("VERSION_MISMATCH");
      }
      return next();
    }

    const storedToken = await tokenManagementApplicationService.readActiveToken(
      req.userId,
      req.deviceId,
    );

    if (!storedToken || storedToken.expiresAt <= new Date()) {
      throw AppError.unauthorized("SESSION_INACTIVE");
    }

    const version = redisVersion ?? 1;

    await sessionService.setSession(
      req.userId,
      req.deviceId,
      {
        status: "active",
        version: version,
      },
      7 * 24 * 60 * 60,
    );

    await sessionService.setVersion(req.userId, version, 30 * 24 * 60 * 60);

    next();
  };
};

export default accessCheckerMiddleware;

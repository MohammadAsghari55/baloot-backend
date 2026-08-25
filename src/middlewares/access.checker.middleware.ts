import { Request, Response, NextFunction } from "express";
import IUserApplicationService from "../domains/user/Interfaces/iuser.application.service.js";
import ITokenManagementApplicationService from "../domains/user/Interfaces/itoken.management.application.service.js";
import ISessionService from "../domains/user/Interfaces/isession.service.js";
import AppError from "../shared/errors/app.error.js";

const accessCheckerMiddleware = (
  userApplicationService: IUserApplicationService,
  tokenManagementApplicationService: ITokenManagementApplicationService,
  sessionService: ISessionService,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId || !req.deviceId || !req.role) {
      throw AppError.unauthorized("INVALID_ACCESS_TOKEN");
    }

    if (!req.tokenValidation) {
      throw AppError.unauthorized("ACCESS_TOKEN_EXPIRED");
    }

    let session = null;
    let redisVersion = null;

    try {
      session = await sessionService.getSession(req.userId, req.deviceId);
      redisVersion = await sessionService.getVersion(req.userId);
    } catch (error) {
      console.error(
        "Redis read failed in accessCheckerMiddleware, falling back to Postgres:",
        error,
      );
    }

    if (session && session.status === "active" && redisVersion) {
      if (session.version !== redisVersion) {
        throw AppError.unauthorized("VERSION_MISMATCH");
      }
      return next();
    }

    const user = await userApplicationService.readById(req.userId);

    if (!user) {
      throw AppError.notFound("NOT_FOUND");
    }

    const storedToken = await tokenManagementApplicationService.readActiveToken(
      req.userId,
      req.deviceId,
    );

    if (!storedToken || storedToken.expiresAt <= new Date()) {
      throw AppError.unauthorized("SESSION_INACTIVE");
    }

    try {
      await sessionService.setSession(
        req.userId,
        req.deviceId,
        {
          status: "active",
          version: user.tokenVersion,
        },
        7 * 24 * 60 * 60,
      );

      await sessionService.setVersion(
        req.userId,
        user.tokenVersion,
        7 * 24 * 60 * 60,
      );
    } catch (error) {
      console.error(
        "Redis sync failed in accessCheckerMiddleware fallback:",
        error,
      );
    }

    next();
  };
};

export default accessCheckerMiddleware;

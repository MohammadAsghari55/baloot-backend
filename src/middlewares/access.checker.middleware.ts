import { Request, Response, NextFunction } from "express";
import IRedisService from "../shared/interfaces/iredis.service.js";
import AppError from "../shared/errors/app.error.js";

const accessCheckerMiddleware = (redisService: IRedisService) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId || !req.deviceId || !req.role) {
      throw AppError.unauthorized("INVALID_ACCESS_TOKEN");
    }

    if (!req.tokenValidation) {
      throw AppError.unauthorized("ACCESS_TOKEN_EXPIRED");
    }

    const session = await redisService.get<{
      status: string;
      version: number;
      expiresAt: number;
    }>(`session:${req.userId}:${req.deviceId}`);

    if (!session || session.status !== "active") {
      throw AppError.unauthorized("SESSION_INACTIVE");
    }

    const redisVersion = await redisService.get<number>(
      `version:${req.userId}`,
    );

    if (!redisVersion) {
      throw AppError.unauthorized("VERSION_NOT_FOUND");
    }

    if (session.version !== redisVersion) {
      throw AppError.unauthorized("VERSION_MISMATCH");
    }

    next();
  };
};

export default accessCheckerMiddleware;

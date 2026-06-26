import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ITokenService from "../domains/user/Interfaces/itoken.service.js";
import AppError from "../shared/errors/app.error.js";

const accessCheckerMiddleware = (
  tokenService: ITokenService,
  extractUser: boolean,
  allowExpired: boolean = false,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.accessToken;

      if (!accessToken) {
        throw AppError.unauthorized("INVALID_ACCESS_TOKEN");
      }

      let payload: { userId: string; role: string };

      try {
        payload = tokenService.verifyAccessToken(accessToken);
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError && allowExpired) {
          const decoded = tokenService.decodeAccessToken(accessToken);
          if (!decoded) throw AppError.unauthorized("INVALID_ACCESS_TOKEN");
          payload = decoded;
        } else {
          throw AppError.unauthorized("INVALID_ACCESS_TOKEN");
        }
      }

      if (extractUser) {
        req.user = {
          userId: payload.userId,
          role: payload.role as "user" | "admin",
        };
      }

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return next(AppError.unauthorized("ACCESS_TOKEN_EXPIRED"));
      }
      return next(AppError.unauthorized("INVALID_ACCESS_TOKEN"));
    }
  };
};

export default accessCheckerMiddleware;

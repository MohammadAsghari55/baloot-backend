import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ITokenService from "../domains/user/Interfaces/itoken.service.js";
import UnauthorizedError from "../shared/errors/unauthorized.error.js";

const accessCheckerMiddleware = (
  tokenService: ITokenService,
  extractUser: boolean,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.accessToken;

      if (!accessToken) {
        throw new UnauthorizedError("INVALID_ACCESS_TOKEN");
      }

      const payload = tokenService.verifyAccessToken(accessToken);
      if (extractUser) {
        req.user = {
          userId: payload.userId,
          role: payload.role as "user" | "admin",
        };
      }

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return next(new UnauthorizedError("ACCESS_TOKEN_EXPIRED"));
      }
      return next(new UnauthorizedError("INVALID_ACCESS_TOKEN"));
    }
  };
};

export default accessCheckerMiddleware;

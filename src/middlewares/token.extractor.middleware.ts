import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ITokenService from "../domains/user/Interfaces/itoken.service.js";

const tokenExtractorMiddleware = (tokenService: ITokenService) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      req.userId = null;
      req.deviceId = null;
      req.role = null;
      req.tokenValidation = false;

      return next();
    }

    let payload: {
      userId: string;
      deviceId: string;
      role: "user" | "admin";
    } | null = null;

    let isValid = false;

    try {
      payload = tokenService.verifyAccessToken(accessToken) as {
        userId: string;
        deviceId: string;
        role: "user" | "admin";
      };
      isValid = true;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        payload = tokenService.decodeAccessToken(accessToken) as {
          userId: string;
          deviceId: string;
          role: "user" | "admin";
        } | null;
        isValid = false;
      } else {
        payload = null;
        isValid = false;
      }
    }

    req.userId = payload?.userId ?? null;
    req.deviceId = payload?.deviceId ?? null;
    req.role = payload?.role ?? null;
    req.tokenValidation = isValid;

    next();
  };
};

export default tokenExtractorMiddleware;

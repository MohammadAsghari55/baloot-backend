import { Request, Response, NextFunction } from "express";
import AppError from "../shared/errors/app.error.js";

const deviceIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const deviceId = req.headers["x-device-id"] as string;

  if (!deviceId) {
    throw AppError.badRequest("MISSING_DEVICE_ID");
  }

  req.deviceId = deviceId;

  next();
};

export default deviceIdMiddleware;

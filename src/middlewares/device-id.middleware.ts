import { Request, Response, NextFunction } from "express";
import BadRequestError from "../shared/errors/bad-request.error.js";

const deviceIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const deviceId = req.headers["x-device-id"] as string;

  if (!deviceId) {
    throw new BadRequestError("MISSING_DEVICE_ID");
  }

  req.deviceId = deviceId;

  next();
};

export default deviceIdMiddleware;

import { Request, Response, NextFunction } from "express";
import AppError from "../shared/errors/app.error.js";

const fullAccessGuardMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.accessType) {
    throw AppError.unauthorized("INVALID_ACCESS_TOKEN");
  }

  if (req.accessType !== "full") {
    throw AppError.forbidden("PROFILE_INCOMPLETE");
  }

  next();
};

export default fullAccessGuardMiddleware;

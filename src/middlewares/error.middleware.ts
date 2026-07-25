import { Request, Response, NextFunction } from "express";
import AppError from "../shared/errors/app.error.js";
import ZodValidationError from "../shared/errors/zod.validation.error.js";
import zodErrorMapper from "../shared/utils/zod.error.mapper.js";
import config from "../infrastructure/config/env.index.js";

function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof ZodValidationError) {
    const mappedDetails = zodErrorMapper(err.details || []);
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: mappedDetails,
      },
    });
  }

  if (err instanceof AppError) {
    const message =
      config.NODE_ENV === "production"
        ? err.isPublic
          ? (err.publicMessage ?? err.message)
          : "Something went wrong"
        : err.message;

    return res.status(err.statusCode).json({
      success: false,
      error: {
        message,
        code: err.code,
        statusCode: err.statusCode,
      },
    });
  }

  console.error("UNEXPECTED ERROR:", err);

  return res.status(500).json({
    success: false,
    error: {
      message:
        config.NODE_ENV === "production" ? "Something went wrong" : err.message,
      code: "INTERNAL_ERROR",
      statusCode: 500,
    },
  });
}

export default errorMiddleware;

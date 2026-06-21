import { ErrorCodes, ErrorCode } from "./error.catalogue.js";

class AppError extends Error {
  statusCode: number;
  code: string;
  isOperational: boolean;
  isPublic: boolean;
  publicMessage?: string;
  details?: { path: string; message: string }[];

  constructor(
    message: string,
    statusCode: number,
    code: string,
    options?: {
      isPublic?: boolean;
      publicMessage?: string;
      details?: { path: string; message: string }[];
    },
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    this.isPublic = options?.isPublic ?? true;
    this.publicMessage = options?.publicMessage;
    this.details = options?.details;

    Error.captureStackTrace(this, this.constructor);
  }
  static fromCode(code: ErrorCode): AppError {
    const error = ErrorCodes[code];
    return new AppError(error.message, error.status, error.code);
  }

  static badRequest(code: ErrorCode): AppError {
    const error = ErrorCodes[code];
    return new AppError(error.message, 400, error.code);
  }

  static unauthorized(code: ErrorCode): AppError {
    const error = ErrorCodes[code];
    return new AppError(error.message, 401, error.code);
  }

  static forbidden(code: ErrorCode): AppError {
    const error = ErrorCodes[code];
    return new AppError(error.message, 403, error.code);
  }

  static conflict(code: ErrorCode): AppError {
    const error = ErrorCodes[code];
    return new AppError(error.message, 409, error.code);
  }

  static notFound(code: ErrorCode): AppError {
    const error = ErrorCodes[code];
    return new AppError(error.message, 404, error.code);
  }

  static internal(code: ErrorCode): AppError {
    const error = ErrorCodes[code];
    return new AppError(error.message, 500, error.code);
  }

  static validation(
    message: string,
    details?: { path: string; message: string }[],
  ): AppError {
    return new AppError(message, 400, "VALIDATION_ERROR", { details });
  }
}
export default AppError;

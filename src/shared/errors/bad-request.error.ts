import AppError from "./app.error.js";
import { ErrorCodes, ErrorCode } from "./error.catalogue.js";

class BadRequestError extends AppError {
  constructor(code: ErrorCode) {
    const error = ErrorCodes[code];
    super(error.message, error.status, error.code);
  }
}

export default BadRequestError;

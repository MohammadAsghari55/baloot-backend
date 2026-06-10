import AppError from "./app.error.js";
import { ErrorCodes, ErrorCode } from "./error.catalogue.js";

class DatabaseError extends AppError {
  constructor(code: ErrorCode, details?: string) {
    const error = ErrorCodes[code];
    super(error.message, error.status, error.code);
    if (details) {
      this.publicMessage = details;
    }
  }
}

export default DatabaseError;

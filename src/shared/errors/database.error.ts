import { ErrorCodes, ErrorCode } from "./error.catalogue.js";
import AppError from "./app.error.js";
import ConflictError from "./conflict.error.js";
class DatabaseError extends AppError {
  constructor(code: ErrorCode, details?: string) {
    const error = ErrorCodes[code];
    super(error.message, error.status, error.code);
    if (details) {
      this.publicMessage = details;
    }
  }

  static fromPGError(error: any): never {
    if (error.code === "23505") {
      if (error.constraint === "users_email_key") {
        throw new ConflictError("EMAIL_EXISTS");
      }
      if (error.constraint === "users_username_key") {
        throw new ConflictError("USERNAME_EXISTS");
      }
      throw new ConflictError("DUPLICATE_ENTRY");
    }
    throw new DatabaseError("DB_SAVE_FAILD");
  }
}

export default DatabaseError;

import AppError from "./app.error.js";

class DatabaseError extends AppError {
  constructor(message: string, code: string = "DB_ERROR") {
    super(message, 500, code);
  }

  static fromPGError(error: any): never {
    if (error.code === "23505") {
      if (error.constraint === "users_email_key") {
        throw AppError.conflict("EMAIL_EXISTS");
      }
      if (error.constraint === "users_username_key") {
        throw AppError.conflict("USERNAME_EXISTS");
      }
      throw AppError.conflict("DUPLICATE_ENTRY");
    }
    throw new DatabaseError("Database operation failed", "DB_SAVE_FAILED");
  }
}

export default DatabaseError;

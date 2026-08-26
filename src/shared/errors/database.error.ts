import AppError from "./app.error.js";

function isPGError(
  error: unknown,
): error is { code: string; constraint?: string } {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const maybeError = error as Record<string, unknown>;

  if (typeof maybeError.code !== "string") {
    return false;
  }

  if (
    maybeError.constraint !== undefined &&
    typeof maybeError.constraint !== "string"
  ) {
    return false;
  }

  return true;
}

class DatabaseError extends AppError {
  constructor(message: string, code: string = "DB_ERROR") {
    super(message, 500, code);
  }

  static fromPGError(error: unknown): never {
    if (!isPGError(error)) {
      throw new DatabaseError("Database operation failed", "DB_SAVE_FAILED");
    }

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

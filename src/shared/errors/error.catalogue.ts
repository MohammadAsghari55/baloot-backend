export const ErrorCodes = {
  EMAIL_EXISTS: {
    code: "EMAIL_EXISTS",
    message: "Email already exists",
    status: 409,
  },
  USERNAME_EXISTS: {
    code: "USERNAME_EXISTS",
    message: "Username already taken",
    status: 409,
  },
  ADMIN_EXISTS: {
    code: "ADMIN_EXISTS",
    message: "Admin already exists",
    status: 403,
  },
  INVALID_CREDENTIALS: {
    code: "INVALID_CREDENTIALS",
    message: "Invalid username or password",
    status: 401,
  },
  DB_SAVE_FAILD: {
    code: "DB_SAVE_FAILD",
    message: "Database save failed",
    status: 500,
  },
  NOT_FOUND: {
    code: "NOT_FOUND",
    message: "Resource not found",
    status: 404,
  },
  MIGRATION_FILE_INVALID: {
    code: "MIGRATION_FILE_INVALID",
    message: "Migration file is missing UP/DOWN sections",
    status: 500,
  },
  MIGRATION_EXECUTION_FAILED: {
    code: "MIGRATION_EXECUTION_FAILED",
    message: "Failed to execute migration file",
    status: 500,
  },
  DB_CONNECTION_FAILED: {
    code: "DB_CONNECTION_FAILED",
    message: "Could not connect to the database",
    status: 500,
  },
  DUPLICATE_ENTRY: {
    code: "DUPLICATE_ENTRY",
    message: "Duplicate entry violates unique constraint",
    status: 409,
  },
  INVALID_ROLE: {
    code: "INVALID_ROLE",
    message: "Invalid role for this endpoint",
    status: 403,
  },
  PASSWORD_MISMATCH: {
    code: "PASSWORD_MISMATCH",
    message: "Passwords do not match",
    status: 400,
  },
} as const;
export type ErrorCode = keyof typeof ErrorCodes;

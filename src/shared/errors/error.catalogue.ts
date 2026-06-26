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
  MISSING_DEVICE_ID: {
    code: "MISSING_DEVICE_ID",
    message: "Device ID is required in X-Device-Id header",
    status: 400,
  },
  MAX_ADMINS_EXCEEDED: {
    code: "MAX_ADMINS_EXCEEDED",
    message: "Maximum number of admins reached",
    status: 403,
  },
  INVALID_REFRESH_TOKEN: {
    code: "INVALID_REFRESH_TOKEN",
    message: "Invalid refresh token",
    status: 401,
  },
  INVALID_ACCESS_TOKEN: {
    code: "INVALID_ACCESS_TOKEN",
    message: "Invalid access token",
    status: 401,
  },
  ACCESS_TOKEN_EXPIRED: {
    code: "ACCESS_TOKEN_EXPIRED",
    message: "Access token has expired",
    status: 401,
  },
  EMAIL_NOT_VERIFIED: {
    code: "EMAIL_NOT_VERIFIED",
    message:
      "Email address is not verified. Please provide the verification code.",
    status: 403,
  },

  INVALID_VERIFICATION_CODE: {
    code: "INVALID_VERIFICATION_CODE",
    message: "The verification code is invalid or expired.",
    status: 400,
  },

  ALREADY_VERIFIED: {
    code: "ALREADY_VERIFIED",
    message: "Email address is already verified.",
    status: 400,
  },

  EMAIL_SEND_FAILED: {
    code: "EMAIL_SEND_FAILED",
    message: "Failed to send verification email. Please try again later.",
    status: 500,
  },
} as const;
export type ErrorCode = keyof typeof ErrorCodes;

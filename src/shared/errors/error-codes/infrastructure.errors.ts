export const InfrastructureErrors = {
  DB_CONNECTION_FAILED: {
    code: "DB_CONNECTION_FAILED",
    message: "Could not connect to the database",
    status: 500,
  },
  DB_SAVE_FAILED: {
    code: "DB_SAVE_FAILED",
    message: "Database save failed",
    status: 500,
  },
  REDIS_CONNECTION_FAILED: {
    code: "REDIS_CONNECTION_FAILED",
    message: "Redis connection failed. Please check your Redis server.",
    status: 500,
  },
  REDIS_OPERATION_FAILED: {
    code: "REDIS_OPERATION_FAILED",
    message: "Redis operation failed.",
    status: 500,
  },
  EMAIL_SEND_FAILED: {
    code: "EMAIL_SEND_FAILED",
    message: "Failed to send verification email. Please try again later.",
    status: 500,
  },
} as const;

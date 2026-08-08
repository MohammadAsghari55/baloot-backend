export const UserErrors = {
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
  MAX_ADMINS_EXCEEDED: {
    code: "MAX_ADMINS_EXCEEDED",
    message: "Maximum number of admins reached",
    status: 403,
  },
} as const;

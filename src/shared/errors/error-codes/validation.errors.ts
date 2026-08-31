export const ValidationErrors = {
  PASSWORD_MISMATCH: {
    code: "PASSWORD_MISMATCH",
    message: "Passwords do not match",
    status: 400,
  },
  SAME_PASSWORD: {
    code: "SAME_PASSWORD",
    message: "New password cannot be the same as the old password.",
    status: 400,
  },
  MISSING_DEVICE_ID: {
    code: "MISSING_DEVICE_ID",
    message: "Device ID is required in X-Device-Id header",
    status: 400,
  },
  TOO_MANY_REQUESTS: {
    code: "TOO_MANY_REQUESTS",
    message: "Too many requests. Please try again later.",
    status: 429,
  },
  CANNOT_REUSE_OLD_PASSWORD: {
    code: "CANNOT_REUSE_OLD_PASSWORD",
    message: "You cannot reuse one of your recent passwords.",
    status: 400,
  },
  MISSING_REQUIRED_FIELDS: {
    code: "MISSING_REQUIRED_FIELDS",
    message: "All required fields must be provided.",
    status: 400,
  },
  PROFILE_ALREADY_COMPLETED: {
    code: "PROFILE_ALREADY_COMPLETED",
    message: "Profile is already completed.",
    status: 400,
  },
} as const;

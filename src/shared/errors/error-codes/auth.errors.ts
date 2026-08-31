export const AuthErrors = {
  INVALID_CREDENTIALS: {
    code: "INVALID_CREDENTIALS",
    message: "Invalid username or password",
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
  INVALID_REFRESH_TOKEN: {
    code: "INVALID_REFRESH_TOKEN",
    message: "Invalid refresh token",
    status: 401,
  },
  REFRESH_TOKEN_EXPIRED: {
    code: "REFRESH_TOKEN_EXPIRED",
    message: "Refresh token has expired",
    status: 401,
  },
  SESSION_INACTIVE: {
    code: "SESSION_INACTIVE",
    message: "Your session is no longer active. Please log in again.",
    status: 401,
  },
  VERSION_NOT_FOUND: {
    code: "VERSION_NOT_FOUND",
    message: "User version not found. Please log in again.",
    status: 401,
  },
  VERSION_MISMATCH: {
    code: "VERSION_MISMATCH",
    message: "Session version mismatch. Please log in again.",
    status: 401,
  },
  PASSWORD_CHANGE_LOCKED: {
    code: "PASSWORD_CHANGE_LOCKED",
    message: "Too many failed attempts. Password change is temporarily locked.",
    status: 429,
  },
  PASSWORD_RECENTLY_CHANGED: {
    code: "PASSWORD_RECENTLY_CHANGED",
    message: "Password was changed recently. Please try again later.",
    status: 429,
  },
  NO_PENDING_REQUEST: {
    code: "NO_PENDING_REQUEST",
    message: "No pending admin registration request found.",
    status: 404,
  },
  PENDING_ADMIN_REQUEST_EXISTS: {
    code: "PENDING_ADMIN_REQUEST_EXISTS",
    message:
      "You already have a pending admin registration request. Please complete it or wait for it to expire.",
    status: 409,
  },
  PROFILE_INCOMPLETE: {
    code: "PROFILE_INCOMPLETE",
    message: "Profile is not complete. Please complete your profile first.",
    status: 403,
  },
} as const;

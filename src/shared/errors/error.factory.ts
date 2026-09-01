import AppError from "./app.error.js";

class ErrorFactory {
  static accountLocked(minutes: number): AppError {
    return new AppError(
      `Too many failed attempts. Please try again in ${minutes} minute(s).`,
      403,
      "ACCOUNT_LOCKED",
      { publicMessage: `Your account is locked for ${minutes} minute(s).` },
    );
  }

  static invalidCredentials(remainingAttempts: number): AppError {
    return new AppError(
      `Invalid credentials. You have ${remainingAttempts} attempt(s) left.`,
      401,
      "INVALID_CREDENTIALS",
      {
        publicMessage: `Invalid username or password. ${remainingAttempts} attempt(s) remaining.`,
      },
    );
  }
}

export default ErrorFactory;

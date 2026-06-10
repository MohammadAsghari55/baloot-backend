import AppError from "./app.error.js";

class ValidationError extends AppError {
  public details?: { path: string; message: string }[];

  constructor(
    message: string = "Validation failed",
    details?: { path: string; message: string }[],
  ) {
    super(message, 400, "VALIDATION_ERROR");
    this.details = details;
  }
}

export default ValidationError;

import { ZodError } from "zod";
import AppError from "./app.error.js";

class ZodValidationError extends AppError {
  constructor(zodError: ZodError) {
    const details = zodError.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
    super("Validation failed", 400, "VALIDATION_ERROR", { details });
  }
}

export default ZodValidationError;

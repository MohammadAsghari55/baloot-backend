import { ZodError } from "zod";
import ValidationError from "./validation.error.js";

class ZodValidationError extends ValidationError {
  constructor(zodError: ZodError) {
    const details = zodError.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
    super("Validation failed", details);
  }
}

export default ZodValidationError;

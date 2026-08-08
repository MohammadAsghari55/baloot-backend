import { AuthErrors } from "./error-codes/auth.errors.js";
import { UserErrors } from "./error-codes/user.errors.js";
import { VerificationErrors } from "./error-codes/verification.errors.js";
import { ValidationErrors } from "./error-codes/validation.errors.js";
import { InfrastructureErrors } from "./error-codes/infrastructure.errors.js";
import { MigrationErrors } from "./error-codes/migration.errors.js";
import { GeneralErrors } from "./error-codes/general.errors.js";

export const ErrorCodes = {
  ...AuthErrors,
  ...UserErrors,
  ...VerificationErrors,
  ...ValidationErrors,
  ...InfrastructureErrors,
  ...MigrationErrors,
  ...GeneralErrors,
} as const;

export type ErrorCode = keyof typeof ErrorCodes;

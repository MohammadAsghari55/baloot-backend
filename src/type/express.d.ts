// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string | null;
      deviceId?: string | null;
      role?: "user" | "admin" | "super_admin" | null;
      tokenValidation?: boolean | null;
      accessType?: "full" | "limited" | null;
    }
  }
}

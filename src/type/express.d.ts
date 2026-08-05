import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string | null;
      deviceId?: string | null;
      role?: "user" | "admin" | null;
      tokenValidation?: boolean | null;
    }
  }
}

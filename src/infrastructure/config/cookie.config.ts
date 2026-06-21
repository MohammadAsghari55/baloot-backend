import { CookieOptions } from "express";
import { config } from "./index.js";

export const accessCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: config.NODE_ENV === "production",
  maxAge: 15 * 60 * 1000,
};

export const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: config.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

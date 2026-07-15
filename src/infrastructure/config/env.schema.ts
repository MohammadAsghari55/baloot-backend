import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number(),

  NODE_ENV: z.enum(["development", "production", "test"]),

  DATABASE_URL: z.string().url().startsWith("postgresql://"),

  JWT_ACCESS_SECRET: z.string().min(32),

  MAX_ADMINS: z.coerce.number().positive().default(1),

  SMTP_HOST: z.string().min(1).default("localhost"),
  SMTP_PORT: z.coerce.number().positive().default(1025),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_SECURE: z.preprocess((val) => {
    if (typeof val === "string") {
      return val.toLowerCase() === "true";
    }
    return val;
  }, z.boolean().default(false)),
  EXPIRE_TIME: z.coerce
    .number()
    .positive()
    .default(24 * 60 * 60 * 1000),
  RESEND_LIMIT_VALID: z.coerce
    .number()
    .positive()
    .default(20 * 60 * 1000),
  RESEND_LIMIT_EXPIRED: z.coerce
    .number()
    .positive()
    .default(4 * 60 * 60 * 1000),
});

export default envSchema;

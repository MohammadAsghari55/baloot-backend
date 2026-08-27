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
  ADMIN_REGISTER_EXPIRE_TIME: z.coerce.number().positive().default(3600),
  EXPIRE_TIME: z.coerce
    .number()
    .positive()
    .default(15 * 60 * 1000),
  RESEND_LIMIT_VALID: z.coerce
    .number()
    .positive()
    .default(5 * 60 * 1000),
  RESEND_LIMIT_EXPIRED: z.coerce
    .number()
    .positive()
    .default(60 * 60 * 1000),
  REDIS_HOST: z.string().min(1).default("localhost"),
  REDIS_PORT: z.coerce.number().positive().default(6379),
  REDIS_PASSWORD: z.string().optional().default(""),
  REDIS_DB: z.coerce.number().min(0).default(0),
  CRON_SCHEDULE: z.string().default("0 3 * * *"),
  CLEANUP_BATCH_SIZE: z.coerce.number().positive().default(1000),
  ADMIN_USERNAME: z.string().min(5).default("BalootSuperAdmin"),
  ADMIN_EMAIL: z.string().email().default("admin@baloot.local"),
  ADMIN_PASSWORD: z.string().min(8),
});

export default envSchema;

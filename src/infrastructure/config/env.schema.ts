import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number(),

  NODE_ENV: z.string().min(9),

  DATABASE_URL: z.string().url().startsWith("postgresql://"),

  JWT_ACCESS_SECRET: z.string().min(32),

  MAX_ADMINS: z.coerce.number().positive().default(1),
});

export default envSchema;

import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(5, { message: "identifier must be at least 5 characters" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type LoginDto = z.infer<typeof loginSchema>;

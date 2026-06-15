import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(5, { message: "Username must be at least 5 characters" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type LoginDto = z.infer<typeof loginSchema>;

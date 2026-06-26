import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(5, { message: "identifier must be at least 5 characters" }),

  password: z.string().min(1, { message: "Password is required" }),

  code: z
    .string()
    .length(6, { message: "Code must be exactly 6 characters" })
    .optional(),
});

export type LoginDto = z.infer<typeof loginSchema>;

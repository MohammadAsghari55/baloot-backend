import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    username: z
      .string()
      .min(5, { message: "Username must be at least 5 characters" })
      .max(40, { message: "Username must be at most 40 characters" })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message:
          "Username can only contain letters, numbers, and underscore (_)",
      }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^a-zA-Z0-9]/, {
        message:
          "Password must contain at least one special character like @ - $ & !",
      }),
    confirmPassword: z.string(),
    role: z.enum(["user", "admin", "super_admin"]).default("user"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterDto = z.infer<typeof registerSchema>;

import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    identifier: z
      .string()
      .min(5, { message: "identifier must be at least 5 characters" }),
    newPassword: z
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
    confirmNewPassword: z.string(),
    code: z
      .string()
      .length(6, { message: "Code must be exactly 6 characters" }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;

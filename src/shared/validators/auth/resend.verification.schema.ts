import { z } from "zod";

export const ResendVerificationSchema = z.object({
  identifier: z
    .string()
    .min(5, { message: "identifier must be at least 5 characters" }),
});

export type ResendVerificationDto = z.infer<typeof ResendVerificationSchema>;

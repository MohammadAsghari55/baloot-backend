import { z } from "zod";

export const verifyRegisterSchema = z.object({
  code: z.string().length(6, { message: "Code must be exactly 6 characters" }),
});

export type VerifyRegisterDto = z.infer<typeof verifyRegisterSchema>;

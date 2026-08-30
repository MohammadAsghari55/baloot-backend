import { z } from "zod";

export const identifierSchema = z.object({
  identifier: z
    .string()
    .min(5, { message: "identifier must be at least 5 characters" }),
});

export type IdentifierDto = z.infer<typeof identifierSchema>;

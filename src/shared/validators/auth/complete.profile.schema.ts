import { z } from "zod";

export const completeProfileSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "First name must be at least 3 characters" })
    .max(70, { message: "First name must be at most 70 characters" }),
  lastName: z
    .string()
    .min(3, { message: "Last name must be at least 3 characters" })
    .max(70, { message: "Last name must be at most 70 characters" }),
  address: z
    .string()
    .min(10, { message: "address must be at least 10 characters" })
    .max(255, { message: "address must be at most 255 characters" }),
  phoneNumber: z
    .string()
    .min(8, { message: "Phone Number must be at least 8 characters" })
    .max(40, { message: "Phone Number must be at most 40 characters" })
    .regex(/^[0-9]+$/, { message: "Phone number must contain only digits" }),
  birthDate: z
    .string()
    .date({ message: "Invalid date format. Expected YYYY-MM-DD" })
    .optional(),
});

export type CompleteProfileDto = z.infer<typeof completeProfileSchema>;

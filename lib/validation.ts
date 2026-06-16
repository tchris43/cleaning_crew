import { z } from "zod";
import type { NormalizedAppointmentRequest } from "../types/appointment";

const optionalString = () =>
  z.preprocess((value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }, z.string().optional());

const nameSchema = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `Please enter your ${label}.`)
    .max(50, `${label.charAt(0).toUpperCase() + label.slice(1)} is too long.`);

const phoneSchema = z
  .string()
  .regex(/^\+?[0-9().\-\s]{7,20}$/, "Please enter a valid phone number.");

const emailSchema = z.string().email("Please enter a valid email address.");

export const appointmentRequestSchema = z.object({
  firstName: nameSchema("first name"),
  lastName: nameSchema("last name"),
  phone: phoneSchema,
  email: emailSchema,
  serviceTier: z.enum(["BASIC_REFRESH", "DEEP_CLEAN", "PREMIUM_RESTORE"]),
  vehicleMake: nameSchema("vehicle make"),
  vehicleModel: nameSchema("vehicle model"),
  vehicleSize: z.enum(["SMALL", "MID-SIZED", "LARGE"]),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid appointment date."),
  appointmentTime: z.string().regex(/^\d{2}:\d{2}$/, "Please enter a valid appointment time."),
  notes: optionalString(),
  addons: z.array(z.string()).default([])
});

export function parseAppointmentRequest(input: unknown):
  | { success: true; data: NormalizedAppointmentRequest }
  | { success: false; errors: Array<{ path: string; message: string }> } {
  const result = appointmentRequestSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map((issue) => ({
        path: issue.path.join(".") || "form",
        message: issue.message
      }))
    };
  }

  return {
    success: true,
    data: result.data
  };
}

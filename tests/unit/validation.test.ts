import { describe, expect, it } from "vitest";
import { parseAppointmentRequest } from "../../lib/validation";
import { getTimeBlockForAppointmentTime, getBookingWindow } from "../../lib/slots";

describe("booking validation", () => {
  it("rejects missing contact information", () => {
    const result = parseAppointmentRequest({
      name: "Jordan Miles",
      serviceTier: "DEEP_CLEAN",
      vehicleMake: "Toyota",
      vehicleModel: "Camry",
      appointmentDate: "2026-06-15",
      appointmentTime: "09:00",
      photoPermission: true
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some((error) => error.message.includes("phone number or email address"))).toBe(true);
    }
  });

  it("rejects invalid email format", () => {
    const result = parseAppointmentRequest({
      name: "Jordan Miles",
      phone: "555-123-4567",
      email: "not-an-email",
      serviceTier: "DEEP_CLEAN",
      vehicleMake: "Toyota",
      vehicleModel: "Camry",
      appointmentDate: "2026-06-15",
      appointmentTime: "09:00",
      photoPermission: true
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some((error) => error.path === "email")).toBe(true);
    }
  });

  it("rejects invalid phone format", () => {
    const result = parseAppointmentRequest({
      name: "Jordan Miles",
      phone: "abc123",
      serviceTier: "DEEP_CLEAN",
      vehicleMake: "Toyota",
      vehicleModel: "Camry",
      appointmentDate: "2026-06-15",
      appointmentTime: "09:00",
      photoPermission: true
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some((error) => error.path === "phone")).toBe(true);
    }
  });

  it("rejects notes over 500 characters", () => {
    const result = parseAppointmentRequest({
      name: "Jordan Miles",
      phone: "555-123-4567",
      serviceTier: "DEEP_CLEAN",
      vehicleMake: "Toyota",
      vehicleModel: "Camry",
      appointmentDate: "2026-06-15",
      appointmentTime: "09:00",
      photoPermission: true,
      notes: "x".repeat(501)
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some((error) => error.path === "notes")).toBe(true);
    }
  });

  it("accepts a valid slot time and booking window", () => {
    expect(getTimeBlockForAppointmentTime("09:00")).toBe("MORNING");
    expect(getTimeBlockForAppointmentTime("13:30")).toBe("AFTERNOON");
    expect(getTimeBlockForAppointmentTime("19:00")).toBe("EVENING");

    const window = getBookingWindow(new Date("2026-06-08T12:00:00Z"));
    expect(window.earliestBookingDate).toBe("2026-06-15");
    expect(window.latestBookingDate).toBe("2026-08-07");
  });
});

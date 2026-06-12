import { describe, expect, it, vi } from "vitest";
import { processAppointmentSubmission } from "../../lib/bookings";
import type { AppointmentRpcClient } from "../../lib/supabase";
import type { BookingEmailSender } from "../../lib/email";

function buildValidRequest() {
  return {
    name: "Jordan Miles",
    phone: "555-123-4567",
    serviceTier: "DEEP_CLEAN",
    vehicleMake: "Toyota",
    vehicleModel: "Camry",
    appointmentDate: "2026-06-15",
    appointmentTime: "09:00",
    photoPermission: true,
    notes: "Please call on arrival."
  };
}

describe("booking service", () => {
  it("creates a booking successfully", async () => {
    const rpcClient: AppointmentRpcClient = {
      createAppointment: vi.fn().mockResolvedValue({ success: true, appointmentId: "appt_123" })
    };

    const emailSender: BookingEmailSender = {
      sendOwnerNotification: vi.fn().mockResolvedValue(undefined),
      sendCustomerNotification: vi.fn().mockResolvedValue(undefined)
    };

    const result = await processAppointmentSubmission(buildValidRequest(), {
      rpcClient,
      emailSender,
      now: () => new Date("2026-06-08T12:00:00Z")
    });

    expect(result.status).toBe(200);
    if (result.status === 200) {
      expect(result.body.success).toBe(true);
      expect(result.body.appointmentId).toBe("appt_123");
    }
    expect(rpcClient.createAppointment).toHaveBeenCalledTimes(1);
    expect(emailSender.sendOwnerNotification).toHaveBeenCalledTimes(1);
  });

  it("returns BLOCK_FULL when the rpc rejects capacity", async () => {
    const rpcClient: AppointmentRpcClient = {
      createAppointment: vi.fn().mockResolvedValue({ success: false, code: "BLOCK_FULL" })
    };

    const emailSender: BookingEmailSender = {
      sendOwnerNotification: vi.fn().mockResolvedValue(undefined)
    };

    const result = await processAppointmentSubmission(buildValidRequest(), {
      rpcClient,
      emailSender,
      now: () => new Date("2026-06-08T12:00:00Z")
    });

    expect(result.status).toBe(409);
    if (result.status === 409) {
      expect(result.body.code).toBe("BLOCK_FULL");
    }
  });

  it("does not treat email failure as a booking failure", async () => {
    const rpcClient: AppointmentRpcClient = {
      createAppointment: vi.fn().mockResolvedValue({ success: true, appointmentId: "appt_456" })
    };

    const emailSender: BookingEmailSender = {
      sendOwnerNotification: vi.fn().mockRejectedValue(new Error("email down")),
      sendCustomerNotification: vi.fn().mockRejectedValue(new Error("email down"))
    };

    const result = await processAppointmentSubmission(buildValidRequest(), {
      rpcClient,
      emailSender,
      now: () => new Date("2026-06-08T12:00:00Z")
    });

    expect(result.status).toBe(200);
    if (result.status === 200) {
      expect(result.body.appointmentId).toBe("appt_456");
    }
  });

  it("returns validation errors before calling the rpc", async () => {
    const rpcClient: AppointmentRpcClient = {
      createAppointment: vi.fn().mockResolvedValue({ success: true, appointmentId: "appt_789" })
    };

    const emailSender: BookingEmailSender = {
      sendOwnerNotification: vi.fn().mockResolvedValue(undefined)
    };

    const result = await processAppointmentSubmission(
      {
        ...buildValidRequest(),
        phone: undefined,
        email: undefined
      },
      {
        rpcClient,
        emailSender,
        now: () => new Date("2026-06-08T12:00:00Z")
      }
    );

    expect(result.status).toBe(400);
    expect(rpcClient.createAppointment).not.toHaveBeenCalled();
  });
});

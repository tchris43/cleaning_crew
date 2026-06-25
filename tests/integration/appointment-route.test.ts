import { describe, expect, it, vi } from "vitest";
import { createAppointmentHandler } from "../../lib/appointment-route";
import type { AppointmentRpcClient } from "../../lib/appointment-db";
import type { BookingEmailSender } from "../../lib/email";

class InMemoryCapacityRpc implements AppointmentRpcClient {
  private count = 0;

  async createAppointment() {
    await new Promise((resolve) => setTimeout(resolve, 5));

    if (this.count >= 3) {
      return { success: false, code: "BLOCK_FULL" as const };
    }

    this.count += 1;
    return { success: true, appointmentId: `appt_${this.count}` };
  }

  get currentCount() {
    return this.count;
  }
}

function buildRequest() {
  return new Request("http://localhost/api/appointments", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      name: "Jordan Miles",
      phone: "555-123-4567",
      serviceTier: "DEEP_CLEAN",
      vehicleMake: "Toyota",
      vehicleModel: "Camry",
      appointmentDate: "2026-06-15",
      appointmentTime: "09:00",
      photoPermission: true,
      notes: "Please call on arrival."
    })
  });
}

describe("appointment route", () => {
  it("returns exactly three successes and seven capacity failures for concurrent requests", async () => {
    const rpcClient = new InMemoryCapacityRpc();
    const emailSender: BookingEmailSender = {
      sendOwnerNotification: vi.fn().mockResolvedValue(undefined)
    };

    const handler = createAppointmentHandler({
      rpcClient,
      emailSender,
      now: () => new Date("2026-06-08T12:00:00Z")
    });

    const responses = await Promise.all(Array.from({ length: 10 }, () => handler(buildRequest())));
    const statuses = await Promise.all(responses.map(async (response) => response.status));

    expect(statuses.filter((status) => status === 200)).toHaveLength(3);
    expect(statuses.filter((status) => status === 409)).toHaveLength(7);
    expect(rpcClient.currentCount).toBe(3);
  });
});

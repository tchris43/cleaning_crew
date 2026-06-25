import { neon } from "@neondatabase/serverless";
import type { CreateAppointmentRpcInput, CreateAppointmentRpcResult } from "../types/appointment";

export interface AppointmentRpcClient {
  createAppointment(input: CreateAppointmentRpcInput): Promise<CreateAppointmentRpcResult>;
}

function normalizeAppointmentTime(time: string): string {
  return /^\d{2}:\d{2}$/.test(time) ? `${time}:00` : time;
}

type CreateAppointmentRow = {
  result: {
    success?: boolean;
    appointmentId?: string;
    code?: string;
  };
};

export function createNeonAppointmentRpcClient(databaseUrl: string): AppointmentRpcClient {
  const sql = neon(databaseUrl);

  return {
    async createAppointment(input) {
      const name = `${input.firstName} ${input.lastName}`.trim();
      const appointmentTime = normalizeAppointmentTime(input.appointmentTime);
      const notes = input.notes ?? null;

      try {
        const rows = (await sql`
          SELECT public.create_appointment(
            ${name},
            ${input.phone ?? null},
            ${input.email ?? null},
            ${input.serviceTier}::service_tier,
            ${input.vehicleMake},
            ${input.vehicleModel},
            ${input.appointmentDate}::date,
            ${appointmentTime}::time,
            ${input.timeBlock}::time_block,
            ${input.blockCapacitySnapshot},
            ${false},
            ${notes}
          ) AS result
        `) as CreateAppointmentRow[];

        const response = rows[0]?.result;

        if (!response || typeof response !== "object") {
          console.error("Neon create_appointment returned invalid data:", rows);
          return { success: false, code: "SERVER_ERROR" };
        }

        if (response.success && typeof response.appointmentId === "string") {
          return { success: true, appointmentId: response.appointmentId };
        }

        if (response.code === "BLOCK_FULL") {
          return { success: false, code: "BLOCK_FULL" };
        }

        console.error("Neon create_appointment failed:", response);
        return { success: false, code: "SERVER_ERROR" };
      } catch (error) {
        console.error("Neon create_appointment error:", error);
        return { success: false, code: "SERVER_ERROR" };
      }
    }
  };
}

export function getDatabaseUrl(): string | undefined {
  return process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
}

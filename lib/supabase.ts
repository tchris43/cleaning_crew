import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { CreateAppointmentRpcInput, CreateAppointmentRpcResult } from "../types/appointment";

export interface AppointmentRpcClient {
  createAppointment(input: CreateAppointmentRpcInput): Promise<CreateAppointmentRpcResult>;
}

export function createSupabaseServerClient(supabaseUrl: string, supabaseServiceRoleKey: string): SupabaseClient {
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

function normalizeAppointmentTime(time: string): string {
  return /^\d{2}:\d{2}$/.test(time) ? `${time}:00` : time;
}

export function createSupabaseAppointmentRpcClient(supabaseUrl: string, supabaseServiceRoleKey: string): AppointmentRpcClient {
  const supabase = createSupabaseServerClient(supabaseUrl, supabaseServiceRoleKey);

  return {
    async createAppointment(input) {
      const { data, error } = await supabase.rpc("create_appointment", {
        p_name: `${input.firstName} ${input.lastName}`.trim(),
        p_phone: input.phone ?? null,
        p_email: input.email ?? null,
        p_service_tier: input.serviceTier,
        p_vehicle_make: input.vehicleMake,
        p_vehicle_model: input.vehicleModel,
        p_appointment_date: input.appointmentDate,
        p_appointment_time: normalizeAppointmentTime(input.appointmentTime),
        p_time_block: input.timeBlock,
        p_block_capacity_snapshot: input.blockCapacitySnapshot,
        p_photo_permission: false,
        p_notes: input.notes ?? null
      });

      if (error) {
        console.error("Supabase create_appointment RPC error:", error.message, error.details, error.hint);

        if (typeof error.message === "string" && error.message.toUpperCase().includes("BLOCK_FULL")) {
          return { success: false, code: "BLOCK_FULL" };
        }

        return { success: false, code: "SERVER_ERROR" };
      }

      if (!data || typeof data !== "object") {
        console.error("Supabase create_appointment returned invalid data:", data);
        return { success: false, code: "SERVER_ERROR" };
      }

      const response = data as { success?: boolean; appointmentId?: string; code?: string };

      if (response.success && typeof response.appointmentId === "string") {
        return { success: true, appointmentId: response.appointmentId };
      }

      if (response.code === "BLOCK_FULL") {
        return { success: false, code: "BLOCK_FULL" };
      }

      console.error("Supabase create_appointment failed:", response);
      return { success: false, code: "SERVER_ERROR" };
    }
  };
}

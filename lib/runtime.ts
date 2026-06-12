import { createAppointmentHandler } from "./appointment-route";
import { createResendBookingEmailSender } from "./email";
import { createSupabaseAppointmentRpcClient } from "./supabase";
import type { BookingServiceDeps } from "./bookings";

export function createProductionBookingDependencies(): BookingServiceDeps {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;
  const ownerNotificationEmail = process.env.OWNER_NOTIFICATION_EMAIL;

  if (!supabaseUrl || !supabaseServiceRoleKey || !resendApiKey || !ownerNotificationEmail) {
    throw new Error("Missing required environment variables for booking runtime.");
  }

  return {
    rpcClient: createSupabaseAppointmentRpcClient(supabaseUrl, supabaseServiceRoleKey),
    emailSender: createResendBookingEmailSender(resendApiKey, ownerNotificationEmail),
    now: () => new Date()
  };
}

export function createProductionAppointmentHandler() {
  return createAppointmentHandler(createProductionBookingDependencies());
}

import { createAppointmentHandler } from "./appointment-route";
import { createNeonAppointmentRpcClient, getDatabaseUrl } from "./appointment-db";
import { createResendBookingEmailSender } from "./email";
import type { BookingServiceDeps } from "./bookings";

export function createProductionBookingDependencies(): BookingServiceDeps {
  const databaseUrl = getDatabaseUrl();
  const resendApiKey = process.env.RESEND_API_KEY;
  const ownerNotificationEmail = process.env.OWNER_NOTIFICATION_EMAIL;

  if (!databaseUrl || !resendApiKey || !ownerNotificationEmail) {
    throw new Error("Missing required environment variables for booking runtime.");
  }

  return {
    rpcClient: createNeonAppointmentRpcClient(databaseUrl),
    emailSender: createResendBookingEmailSender(resendApiKey, ownerNotificationEmail),
    now: () => new Date()
  };
}

export function createProductionAppointmentHandler() {
  return createAppointmentHandler(createProductionBookingDependencies());
}

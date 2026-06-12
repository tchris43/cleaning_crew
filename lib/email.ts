import { Resend } from "resend";
import type { AppointmentRequest, CreateAppointmentRpcInput } from "../types/appointment";

export interface BookingEmailSender {
  sendOwnerNotification(input: CreateAppointmentRpcInput & { appointmentId: string }): Promise<void>;
  sendCustomerNotification?(input: AppointmentRequest & { appointmentId: string }): Promise<void>;
}

function formatBookingDetails(input: AppointmentRequest & { appointmentId: string }) {
  return [
    `Appointment ID: ${input.appointmentId}`,
    `Phone: ${input.phone ?? ""}`,
    `Email: ${input.email ?? ""}`,
    `Tier: ${input.serviceTier}`,
    `Vehicle Size: ${input.vehicleSize}`,
    `Date: ${input.appointmentDate}`,
    `Time: ${input.appointmentTime}`,
    `Add-ons: ${input.addons?.length ? input.addons.join(", ") : "None"}`,
    `Notes: ${input.notes ?? ""}`
  ].join("\n");
}

export function createResendBookingEmailSender(resendApiKey: string, ownerNotificationEmail: string): BookingEmailSender {
  const resend = new Resend(resendApiKey);

  return {
    async sendOwnerNotification(input) {
      await resend.emails.send({
        from: "Clean Crew Detailing <onboarding@resend.dev>",
        to: ownerNotificationEmail,
        subject: "New appointment booked",
        text: formatBookingDetails(input)
      });
    },
    async sendCustomerNotification(input) {
      if (!input.email) {
        return;
      }

      await resend.emails.send({
        from: "Clean Crew Detailing <onboarding@resend.dev>",
        to: input.email,
        subject: "Your appointment request was received",
        text: formatBookingDetails(input)
      });
    }
  };
}

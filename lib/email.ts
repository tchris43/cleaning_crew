import { Resend } from "resend";
import { ADDONS, SERVICE_TIERS, type TierId } from "./services";
import { formatTimeLabel } from "./slots";
import type { AppointmentRequest, CreateAppointmentRpcInput } from "../types/appointment";

export interface BookingEmailSender {
  sendOwnerNotification(input: CreateAppointmentRpcInput & { appointmentId: string }): Promise<void>;
  sendCustomerNotification?(input: AppointmentRequest & { appointmentId: string }): Promise<void>;
}

function formatOwnerBookingDetails(input: CreateAppointmentRpcInput & { appointmentId: string }) {
  const tierTitle = SERVICE_TIERS[input.serviceTier as TierId]?.title ?? input.serviceTier;
  const addonLabels =
    input.addons?.map((id) => ADDONS.find((addon) => addon.id === id)?.label ?? id) ?? [];

  return [
    `Appointment ID: ${input.appointmentId}`,
    `Phone: ${input.phone ?? ""}`,
    `Email: ${input.email ?? ""}`,
    `Package: ${tierTitle}`,
    `Vehicle Size: ${input.vehicleSize}`,
    `Date: ${input.appointmentDate}`,
    `Time: ${formatTimeLabel(input.appointmentTime)}`,
    `Add-ons: ${addonLabels.length ? addonLabels.join(", ") : "None"}`,
    `Notes: ${input.notes ?? ""}`
  ].join("\n");
}

function formatCustomerOrderConfirmation(input: AppointmentRequest) {
  const tierTitle = SERVICE_TIERS[input.serviceTier as TierId]?.title ?? input.serviceTier;
  const addonLabels =
    input.addons?.map((id) => ADDONS.find((addon) => addon.id === id)?.label ?? id) ?? [];

  const lines = [
    "Thank you for booking with Clean Crew Detailing!",
    "",
    `Phone: ${input.phone}`,
    `Email: ${input.email}`,
    `Package: ${tierTitle}`,
    `Vehicle Size: ${input.vehicleSize}`,
    `Date: ${input.appointmentDate}`,
    `Time: ${formatTimeLabel(input.appointmentTime)}`,
    `Add-ons: ${addonLabels.length ? addonLabels.join(", ") : "None"}`
  ];

  if (input.notes) {
    lines.push(`Notes: ${input.notes}`);
  }

  lines.push("", "Contact 385-685-8941 for any questions.");

  return lines.join("\n");
}

export function createResendBookingEmailSender(resendApiKey: string, ownerNotificationEmail: string): BookingEmailSender {
  const resend = new Resend(resendApiKey);

  return {
    async sendOwnerNotification(input) {
      await resend.emails.send({
        from: "Clean Crew Detailing <onboarding@resend.dev>",
        to: ownerNotificationEmail,
        subject: "New appointment booked",
        text: formatOwnerBookingDetails(input)
      });
    },
    async sendCustomerNotification(input) {
      if (!input.email) {
        return;
      }

      await resend.emails.send({
        from: "Clean Crew Detailing <onboarding@resend.dev>",
        to: input.email,
        subject: "Order Confirmation",
        text: formatCustomerOrderConfirmation(input)
      });
    }
  };
}

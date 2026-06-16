import { Resend } from "resend";

import { formatBookingDateLong, formatVehicleSizeLabel, getEstimatedTotal } from "./booking-display";
import { BOOKING_FROM_ADDRESS, SUPPORT_PHONE, SUPPORT_PHONE_TEL } from "./contact";
import { ADDONS, SERVICE_TIERS, type TierId, type VehicleSize } from "./services";
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
    `Name: ${input.firstName} ${input.lastName}`,
    `Phone: ${input.phone ?? ""}`,
    `Email: ${input.email ?? ""}`,
    `Package: ${tierTitle}`,
    `Vehicle: ${input.vehicleMake} ${input.vehicleModel}`,
    `Vehicle Size: ${input.vehicleSize}`,
    `Date: ${input.appointmentDate}`,
    `Time: ${formatTimeLabel(input.appointmentTime)}`,
    `Add-ons: ${addonLabels.length ? addonLabels.join(", ") : "None"}`,
    `Notes: ${input.notes ?? ""}`
  ].join("\n");
}

function buildCustomerSummary(input: AppointmentRequest) {
  const tierId = input.serviceTier as TierId;
  const tierTitle = SERVICE_TIERS[tierId]?.title ?? input.serviceTier;
  const addonLabels =
    input.addons?.map((id) => ADDONS.find((addon) => addon.id === id)?.label ?? id) ?? [];
  const vehicle = `${input.vehicleMake} ${input.vehicleModel}`.trim();
  const formattedDate = formatBookingDateLong(input.appointmentDate);
  const formattedTime = formatTimeLabel(input.appointmentTime);
  const vehicleSize = formatVehicleSizeLabel(input.vehicleSize);
  const estimatedTotal = getEstimatedTotal(tierId, input.vehicleSize as VehicleSize);
  const customerName = `${input.firstName} ${input.lastName}`.trim();

  return {
    tierTitle,
    addonLabels,
    vehicle,
    formattedDate,
    formattedTime,
    vehicleSize,
    estimatedTotal,
    customerName
  };
}

function formatCustomerOrderConfirmationText(input: AppointmentRequest) {
  const summary = buildCustomerSummary(input);

  const lines = [
    "APPOINTMENT CONFIRMED",
    "You're booked with Clean Crew Detail",
    "",
    "We received your request and will follow up if anything else is needed.",
    "",
    "ORDER SUMMARY",
    "",
    `Date & time: ${summary.formattedDate}`,
    `Time: ${summary.formattedTime}`,
    `Package: ${summary.tierTitle}`,
    `Vehicle size: ${summary.vehicleSize}`,
    `Vehicle: ${summary.vehicle}`,
    `Customer: ${summary.customerName}`,
    `Estimated total: ${summary.estimatedTotal}`,
    "Final price confirmed at service. Add-ons may apply."
  ];

  if (summary.addonLabels.length > 0) {
    lines.push(`Add-ons: ${summary.addonLabels.join(", ")}`);
  }

  if (input.notes) {
    lines.push(`Notes: ${input.notes}`);
  }

  lines.push("", `Questions? Call or text ${SUPPORT_PHONE}.`);

  return lines.join("\n");
}

function detailCell(label: string, value: string, subvalue?: string) {
  const subvalueHtml = subvalue
    ? `<div style="margin-top:2px;font-size:15px;font-weight:500;line-height:1.4;color:rgba(32,38,63,0.78);">${subvalue}</div>`
    : "";

  return `
    <td style="width:100%;padding:16px 18px;background-color:#fafbfc;border:1px solid rgba(32,38,63,0.08);border-radius:12px;vertical-align:top;">
      <div style="font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(32,38,63,0.48);">${label}</div>
      <div style="margin-top:6px;font-size:16px;font-weight:600;line-height:1.4;color:#20263f;">${value}</div>
      ${subvalueHtml}
    </td>
  `;
}

function formatCustomerOrderConfirmationHtml(input: AppointmentRequest) {
  const summary = buildCustomerSummary(input);
  const addonsHtml =
    summary.addonLabels.length > 0
      ? `
        <tr>
          <td style="padding-top:12px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>${detailCell("Add-ons", summary.addonLabels.join(", "))}</tr>
            </table>
          </td>
        </tr>
      `
      : "";
  const notesHtml = input.notes
    ? `
      <tr>
        <td style="padding-top:12px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>${detailCell("Notes", input.notes)}</tr>
          </table>
        </td>
      </tr>
    `
    : "";

  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:24px 16px;background-color:#eef1f5;font-family:Inter,Arial,sans-serif;color:#20263f;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:640px;margin:0 auto;">
      <tr>
        <td>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="overflow:hidden;border:1px solid rgba(32,38,63,0.1);border-radius:16px;background-color:#ffffff;box-shadow:0 8px 30px rgba(32,38,63,0.06);">
            <tr>
              <td style="padding:32px 24px 28px;text-align:center;background:linear-gradient(180deg,#f7fafc 0%,#ffffff 100%);border-bottom:1px solid rgba(32,38,63,0.08);">
                <div style="display:inline-block;width:48px;height:48px;border-radius:9999px;border:1px solid #a5d6a7;background-color:#e8f5e9;color:#2e7d32;font-size:24px;line-height:48px;text-align:center;">&#10003;</div>
                <div style="margin-top:16px;font-size:12px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:rgba(32,38,63,0.5);">Appointment confirmed</div>
                <h1 style="margin:8px 0 0;font-family:Arial,sans-serif;font-size:32px;font-weight:700;line-height:1.1;color:#20263f;">You&apos;re booked</h1>
                <p style="max-width:480px;margin:14px auto 0;font-size:15px;line-height:1.65;color:rgba(32,38,63,0.72);">
                  We received your request and will follow up if anything else is needed.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <div style="font-size:13px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(32,38,63,0.5);">Order summary</div>

                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:16px;">
                  <tr>
                    <td>
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>${detailCell("Date &amp; time", summary.formattedDate, summary.formattedTime)}</tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:12px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          ${detailCell("Package", summary.tierTitle)}
                          <td style="width:12px;font-size:0;line-height:0;">&nbsp;</td>
                          ${detailCell("Vehicle size", summary.vehicleSize)}
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:12px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>${detailCell("Vehicle", summary.vehicle)}</tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:12px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>${detailCell("Customer", summary.customerName)}</tr>
                      </table>
                    </td>
                  </tr>
                  ${addonsHtml}
                  ${notesHtml}
                  <tr>
                    <td style="padding-top:16px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid rgba(217,166,46,0.28);border-radius:12px;background:linear-gradient(180deg,#fffdf7 0%,#fff9ec 100%);">
                        <tr>
                          <td style="padding:16px 18px;">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                              <tr>
                                <td style="vertical-align:top;">
                                  <div style="font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#20263f;">Estimated total</div>
                                  <div style="margin-top:4px;font-size:12px;line-height:1.5;color:rgba(32,38,63,0.58);">Final price confirmed at service. Add-ons may apply.</div>
                                </td>
                                <td style="width:96px;text-align:right;vertical-align:top;font-family:Arial,sans-serif;font-size:28px;font-weight:700;line-height:1;color:#20263f;white-space:nowrap;">
                                  ${summary.estimatedTotal}
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 28px;border-top:1px solid rgba(32,38,63,0.08);">
                <p style="margin:20px 0 0;font-size:14px;line-height:1.6;text-align:center;color:rgba(32,38,63,0.68);">
                  Questions or need to make a change? Call or text
                  <a href="tel:${SUPPORT_PHONE_TEL}" style="font-weight:600;color:#20263f;text-decoration:none;">${SUPPORT_PHONE}</a>.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function createResendBookingEmailSender(resendApiKey: string, ownerNotificationEmail: string): BookingEmailSender {
  const resend = new Resend(resendApiKey);

  return {
    async sendOwnerNotification(input) {
      await resend.emails.send({
        from: BOOKING_FROM_ADDRESS,
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
        from: BOOKING_FROM_ADDRESS,
        to: input.email,
        subject: "Appointment confirmed — Clean Crew Detail",
        text: formatCustomerOrderConfirmationText(input),
        html: formatCustomerOrderConfirmationHtml(input)
      });
    }
  };
}

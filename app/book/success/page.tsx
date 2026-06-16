"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { formatBookingDateLong, formatVehicleSizeLabel } from "../../../lib/booking-display";
import { BOOKING_CONFIRMATION_KEY, type BookingConfirmation } from "../../../lib/booking-confirmation";
import { SERVICE_ADDRESS, SERVICE_ADDRESS_MAPS_URL, SUPPORT_PHONE, SUPPORT_PHONE_TEL } from "../../../lib/contact";

export default function BookingSuccessPage() {
  const router = useRouter();
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(BOOKING_CONFIRMATION_KEY);

    if (!raw) {
      router.replace("/book");
      return;
    }

    try {
      setConfirmation(JSON.parse(raw) as BookingConfirmation);
    } catch {
      router.replace("/book");
    }
  }, [router]);

  if (!confirmation) {
    return (
      <div className="confirmation-loading">
        Loading confirmation…
      </div>
    );
  }

  return (
    <main className="confirmation-page">
      <div className="confirmation-card">
        <header className="confirmation-header">
          <div className="success-checkmark" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="confirmation-eyebrow">Appointment confirmed</p>
          <h1 className="confirmation-title">You&apos;re booked</h1>
          <p className="confirmation-lead">
            We received your request and will follow up if anything else is needed.
            {confirmation.email ? (
              <>
                {" "}
                A confirmation email is on its way to{" "}
                <span className="confirmation-highlight">{confirmation.email}</span>.
              </>
            ) : (
              " A confirmation email is on its way."
            )}
          </p>
        </header>

        <section className="confirmation-details" aria-label="Appointment details">
          <h2 className="confirmation-details-title">Order summary</h2>

          <div className="confirmation-details-grid">
            <div className="confirmation-detail confirmation-detail--wide">
              <span className="confirmation-detail-label">Date &amp; time</span>
              <span className="confirmation-detail-value">{formatBookingDateLong(confirmation.date)}</span>
              <span className="confirmation-detail-subvalue">{confirmation.time}</span>
            </div>

            <div className="confirmation-detail">
              <span className="confirmation-detail-label">Package</span>
              <span className="confirmation-detail-value">{confirmation.tier}</span>
            </div>

            <div className="confirmation-detail">
              <span className="confirmation-detail-label">Vehicle size</span>
              <span className="confirmation-detail-value">{formatVehicleSizeLabel(confirmation.vehicleSize)}</span>
            </div>

            <div className="confirmation-detail confirmation-detail--wide">
              <span className="confirmation-detail-label">Vehicle</span>
              <span className="confirmation-detail-value">{confirmation.vehicle}</span>
            </div>

            <div className="confirmation-detail confirmation-detail--wide">
              <span className="confirmation-detail-label">Customer</span>
              <span className="confirmation-detail-value">
                {confirmation.firstName} {confirmation.lastName}
              </span>
            </div>
          </div>

          {confirmation.estimatedTotal ? (
            <div className="confirmation-total">
              <div>
                <span className="confirmation-total-label">Estimated total</span>
                <p className="confirmation-total-note">Final price confirmed at service. Add-ons may apply.</p>
              </div>
              <span className="confirmation-total-value">{confirmation.estimatedTotal}</span>
            </div>
          ) : null}

          <div className="confirmation-dropoff">
            <p className="confirmation-dropoff-label">Drop-off location</p>
            <p className="confirmation-dropoff-text">
              Please bring your car to{" "}
              <a
                href={SERVICE_ADDRESS_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="confirmation-dropoff-link"
              >
                {SERVICE_ADDRESS}
              </a>{" "}
              at your scheduled appointment time.
            </p>
          </div>
        </section>

        <footer className="confirmation-footer">
          <p className="confirmation-support">
            Questions or didn&apos;t get the email? Call or text{" "}
            <a href={`tel:${SUPPORT_PHONE_TEL}`} className="confirmation-support-link">
              {SUPPORT_PHONE}
            </a>
            .
          </p>

          <div className="confirmation-actions">
            <Link href="/" className="btn-primary px-6 py-3 text-base">
              Back to home
            </Link>
            <Link href="/book" className="btn-secondary px-6 py-3 text-base">
              Book another
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}

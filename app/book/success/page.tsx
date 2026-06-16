"use client";

import Link from "next/link";
import { format, parse } from "date-fns";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { BOOKING_CONFIRMATION_KEY, type BookingConfirmation } from "../../../lib/booking-confirmation";
import { SUPPORT_PHONE, SUPPORT_PHONE_TEL } from "../../../lib/contact";

function formatBookingDate(date: string): string {
  try {
    return format(parse(date, "yyyy-MM-dd", new Date()), "EEEE, MMMM d, yyyy");
  } catch {
    return date;
  }
}

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
      <div className="flex min-h-[calc(100dvh-13rem)] items-center justify-center text-sm font-medium text-[#20263F]/45 md:min-h-[calc(100dvh-14rem)]">
        Loading confirmation…
      </div>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-lg min-h-[calc(100dvh-13rem)] flex-col justify-center py-4 md:min-h-[calc(100dvh-14rem)] md:py-6">
      <div className="w-full rounded-2xl border border-[#20263F]/10 bg-[#FAFBFC] px-6 py-8 text-center md:px-10 md:py-10">
        <div className="success-checkmark mx-auto mb-4" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-[#20263F] md:text-3xl">Thank you!</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#20263F]/70 md:text-base">
          Your appointment request was received. You&apos;ll get an email confirmation shortly
          {confirmation.email ? (
            <>
              {" "}
              at <span className="font-medium text-[#20263F]">{confirmation.email}</span>
            </>
          ) : null}
          .
        </p>
        <p className="mt-4 text-sm text-[#20263F]/65">
          Didn&apos;t get the email or have questions? Call or text{" "}
          <a
            href={`tel:${SUPPORT_PHONE_TEL}`}
            className="font-semibold text-[#20263F] underline-offset-2 hover:underline"
          >
            {SUPPORT_PHONE}
          </a>
          .
        </p>

        <div className="mt-6 space-y-3 rounded-xl border border-[#20263F]/8 bg-white p-5 text-left text-sm">
          <div className="flex justify-between gap-4 border-b border-[#20263F]/8 pb-3">
            <span className="text-[#20263F]/55">Name</span>
            <span className="text-right font-medium text-[#20263F]">
              {confirmation.firstName} {confirmation.lastName}
            </span>
          </div>
          <div className="flex justify-between gap-4 border-b border-[#20263F]/8 pb-3">
            <span className="text-[#20263F]/55">Date & time</span>
            <span className="text-right font-medium text-[#20263F]">
              {formatBookingDate(confirmation.date)}
              <br />
              {confirmation.time}
            </span>
          </div>
          <div className="flex justify-between gap-4 border-b border-[#20263F]/8 pb-3">
            <span className="text-[#20263F]/55">Package</span>
            <span className="font-medium text-[#20263F]">{confirmation.tier}</span>
          </div>
          <div className="flex justify-between gap-4 border-b border-[#20263F]/8 pb-3">
            <span className="text-[#20263F]/55">Vehicle</span>
            <span className="text-right font-medium text-[#20263F]">{confirmation.vehicle}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[#20263F]/55">Vehicle size</span>
            <span className="font-medium text-[#20263F]">{confirmation.vehicleSize}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/" className="btn-primary px-6 py-3 text-base">
            Back to home
          </Link>
          <Link href="/book" className="btn-secondary px-6 py-3 text-base">
            Book another
          </Link>
        </div>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { format, parse } from "date-fns";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { BOOKING_CONFIRMATION_KEY, type BookingConfirmation } from "../../../lib/booking-confirmation";

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
      <div className="py-16 text-center text-sm font-medium text-[#20263F]/45">
        Loading confirmation…
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-lg pb-4 md:pb-6">
      <div className="rounded-2xl border border-[#20263F]/10 bg-[#FAFBFC] px-6 py-10 text-center md:px-10 md:py-12">
        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D32]">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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

        <div className="mt-8 space-y-3 rounded-xl border border-[#20263F]/8 bg-white p-5 text-left text-sm">
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
          <div className="flex justify-between gap-4">
            <span className="text-[#20263F]/55">Vehicle size</span>
            <span className="font-medium text-[#20263F]">{confirmation.vehicle}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
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

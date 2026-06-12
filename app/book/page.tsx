"use client";

import React, { Suspense } from "react";
import BookingForm from "../../components/booking-form";

export default function BookingPage() {
  return (
    <main className="space-y-6 pb-4 md:pb-6">
      <Suspense
        fallback={
          <div className="py-16 text-center text-sm font-medium text-[#20263F]/45">
            Loading booking form…
          </div>
        }
      >
        <BookingForm />
      </Suspense>
    </main>
  );
}

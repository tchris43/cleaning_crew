"use client";
import React, { Suspense } from 'react';
import BookingForm from '../../components/booking-form';

export default function BookingPage() {
  return (
    <div className="w-full">
      <Suspense fallback={
        <div className="text-center py-20 font-bold uppercase tracking-widest text-[#20263F]/40 animate-pulse">
          Loading Booking System...
        </div>
      }>
        <BookingForm />
      </Suspense>
    </div>
  );
}

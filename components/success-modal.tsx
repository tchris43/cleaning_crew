"use client";

import React from "react";

export default function SuccessModal({
  open,
  onClose,
  details
}: {
  open: boolean;
  onClose: () => void;
  details?: { date: string; time: string; tier: string; vehicle: string };
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#20263F]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-[#20263F]/15 bg-white p-6 shadow-xl md:p-8">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D32]">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-center text-2xl font-semibold text-[#20263F]">Appointment booked</h2>
        <p className="mt-1 text-center text-sm text-[#20263F]/60">
          We&apos;ll confirm your slot shortly.
        </p>

        {details && (
          <div className="mt-6 space-y-3 rounded-xl bg-[#FAFBFC] p-4 text-sm">
            <div className="flex justify-between gap-4 border-b border-[#20263F]/8 pb-2">
              <span className="text-[#20263F]/55">Date & time</span>
              <span className="font-medium text-[#20263F]">
                {details.date} · {details.time}
              </span>
            </div>
            <div className="flex justify-between gap-4 border-b border-[#20263F]/8 pb-2">
              <span className="text-[#20263F]/55">Package</span>
              <span className="font-medium text-[#20263F]">{details.tier}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#20263F]/55">Vehicle size</span>
              <span className="font-medium text-[#20263F]">{details.vehicle}</span>
            </div>
          </div>
        )}

        <button type="button" onClick={onClose} className="btn-primary mt-6 w-full">
          Done
        </button>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { VEHICLE_SIZE_GUIDE } from "../lib/vehicle-size-guide";

export default function SizeGuideModal({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#20263F]/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#20263F]/15 bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="size-guide-title"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#20263F]/10 px-5 py-4 md:px-6">
          <h2 id="size-guide-title" className="section-title text-xl md:text-2xl">
            Vehicle Size Guide
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm font-semibold text-[#20263F]/60 transition hover:bg-[#20263F]/5 hover:text-[#20263F]"
            aria-label="Close size guide"
          >
            Close
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4 md:px-6 md:py-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {VEHICLE_SIZE_GUIDE.map((category) => (
              <article
                key={category.size}
                className={`rounded-xl p-4 ${category.cardClass}`}
              >
                <div className="size-guide-pill inline-flex rounded-full px-3 py-1 text-sm font-semibold text-[#20263F] md:text-base">
                  {category.size}
                </div>
                <p className="mt-2 text-xs font-medium uppercase tracking-wide text-[#20263F]/55">
                  {category.description}
                </p>
                <ul className="mt-2 grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs text-[#20263F]/90 sm:text-sm">
                  {category.vehicles.map((vehicle) => (
                    <li key={vehicle}>{vehicle}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

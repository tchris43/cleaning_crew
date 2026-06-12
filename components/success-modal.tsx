"use client";
import React from "react";

export default function SuccessModal({ 
  open, 
  onClose, 
  details 
}: { 
  open: boolean; 
  onClose: () => void; 
  details?: { date: string; time: string; tier: string; vehicle: string } 
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-[#20263F]/80 backdrop-blur-md" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-[2.5rem] bg-white p-8 text-center shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border-8 border-[#3F4E8C]">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="flyer-heading text-3xl font-black uppercase tracking-tighter text-[#20263F]">Appointment Booked!</h2>
        <p className="mt-2 font-bold uppercase tracking-widest text-[#20263F]/40 text-xs">We'll see you soon</p>
        
        {details && (
          <div className="mt-8 space-y-4 rounded-2xl bg-[#F0F2F5] p-6 text-left">
            <div className="flex justify-between border-b border-[#20263F]/5 pb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#20263F]/50">Date & Time</span>
              <span className="text-sm font-black text-[#20263F]">{details.date} @ {details.time}</span>
            </div>
            <div className="flex justify-between border-b border-[#20263F]/5 pb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#20263F]/50">Package</span>
              <span className="text-sm font-black text-[#20263F] uppercase tracking-tighter">{details.tier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-[#20263F]/50">Vehicle</span>
              <span className="text-sm font-black text-[#20263F] uppercase tracking-tighter">{details.vehicle}</span>
            </div>
          </div>
        )}

        <button 
          onClick={onClose} 
          className="mt-8 w-full rounded-xl bg-[#20263F] py-4 text-sm font-black uppercase tracking-[0.2em] text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Sounds Good!
        </button>
      </div>
    </div>
  );
}

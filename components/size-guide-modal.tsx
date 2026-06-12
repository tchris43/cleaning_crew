"use client";
import React from 'react';
import { VEHICLE_SIZE_GUIDE } from '../lib/vehicle-size-guide';

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
      />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl md:p-10 border-4 border-[#20263F]">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-2xl font-black text-[#20263F] hover:scale-110 transition-transform"
        >
          ✕
        </button>
        
        <h2 className="flyer-heading text-3xl font-black uppercase tracking-tighter text-[#20263F]">Vehicle Size Guide</h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {VEHICLE_SIZE_GUIDE.map((category) => (
            <article key={category.size} className={`rounded-xl border-2 border-[#20263F]/5 p-6 shadow-sm ${category.badgeClass}`}>
              <div className="inline-flex rounded-full bg-white/40 px-4 py-1 text-2xl font-black text-[#20263F]">
                {category.size}
              </div>
              <p className="mt-3 text-xs font-bold uppercase tracking-wider text-[#20263F]/60 px-1">{category.description}</p>
              <ul className="mt-4 space-y-1.5 text-sm font-medium text-[#20263F]">
                {category.vehicles.map((vehicle) => (
                  <li key={vehicle} className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-[#20263F]/20"></span>
                    {vehicle}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

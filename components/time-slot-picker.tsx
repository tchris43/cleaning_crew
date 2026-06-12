"use client";
import React from "react";
import { TIME_SLOTS } from "../lib/slots";

export default function TimeSlotPicker({
  value,
  selectedDate,
  onChange
}: {
  value: string;
  selectedDate?: string;
  onChange: (v: string) => void;
}) {
  const getSlotsForDay = () => {
    if (!selectedDate) return [];
    
    // Parse date in a way that avoids timezone shifts (yyyy-mm-dd)
    const [year, month, day] = selectedDate.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.

    let availableBlocks: Array<keyof typeof TIME_SLOTS> = [];

    // Monday-Saturday: Morning (9 AM - 12 PM)
    if (dayOfWeek >= 1 && dayOfWeek <= 6) {
      availableBlocks.push("MORNING");
    }

    // Tuesday & Thursday: Afternoon (12 PM - 4 PM)
    if (dayOfWeek === 2 || dayOfWeek === 4) {
      availableBlocks.push("AFTERNOON");
    }

    // Monday & Wednesday: Evening (6 PM - 9 PM)
    if (dayOfWeek === 1 || dayOfWeek === 3) {
      availableBlocks.push("EVENING");
    }

    return availableBlocks.flatMap(block => TIME_SLOTS[block]);
  };

  const availableSlots = getSlotsForDay();

  function formatTimeLabel(slot: string) {
    const [h, m] = slot.split(":").map(Number);
    const suffix = h >= 12 ? "PM" : "AM";
    const normalizedHour = h % 12 === 0 ? 12 : h % 12;
    return `${normalizedHour}:${String(m).padStart(2, "0")} ${suffix}`;
  }

  return (
    <div className="relative">
      {!selectedDate && (
        <p className="mt-1 text-sm italic text-[#20263F]/50">Please select a date first</p>
      )}
      
      {selectedDate && availableSlots.length === 0 && (
        <p className="mt-1 text-sm italic text-red-500/70">No slots available for this day. (We are closed on Sundays)</p>
      )}

      {selectedDate && availableSlots.length > 0 && (
        <select
          id="appointmentTime"
          name="appointmentTime"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 block w-full rounded-lg border-2 border-[#20263F]/10 bg-white p-3 text-sm font-bold uppercase text-[#20263F] outline-none transition focus:border-[#20263F]"
        >
          <option value="">Select a time</option>
          {availableSlots.map((slot) => {
            const isHalfHour = slot.endsWith(":30");
            return (
              <option 
                key={slot} 
                value={slot}
                style={{ backgroundColor: isHalfHour ? "#FFF9C4" : "#FFFFFF" }}
              >
                {formatTimeLabel(slot)}
              </option>
            );
          })}
        </select>
      )}
    </div>
  );
}

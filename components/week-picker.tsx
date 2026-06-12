"use client";
import React, { useState, useMemo } from 'react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { TIME_SLOTS } from '../lib/slots';

export default function WeekPicker({
  selectedDate,
  selectedTime,
  onChange
}: {
  selectedDate: Date | null;
  selectedTime: string | null;
  onChange: (date: Date, time: string) => void;
}) {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const nextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  const prevWeek = () => {
    // Don't go back before current week
    const lastWeek = subWeeks(currentWeekStart, 1);
    const todayStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    if (lastWeek < todayStart) return;
    setCurrentWeekStart(lastWeek);
  };

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));
  }, [currentWeekStart]);

  const getAvailableSlots = (date: Date) => {
    const day = date.getDay();
    if (day === 0) return []; // Sunday closed

    let slots: string[] = [...TIME_SLOTS.MORNING]; // Mon-Sat Morning

    // Tue & Thu Afternoon
    if (day === 2 || day === 4) {
      slots = [...slots, ...TIME_SLOTS.AFTERNOON];
    }

    // Mon & Wed Evening
    if (day === 1 || day === 3) {
      slots = [...slots, ...TIME_SLOTS.EVENING];
    }

    return slots.sort();
  };

  const formatTimeLabel = (time: string) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 || 12;
    return `${displayH}:${minutes} ${ampm}`;
  };

  return (
    <div className="w-full rounded-2xl border-2 border-[#20263F]/10 bg-white p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="flyer-heading text-lg font-bold text-[#20263F]">
          {format(currentWeekStart, 'MMMM yyyy')}
        </h3>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={prevWeek}
            className="p-2 rounded-lg hover:bg-[#20263F]/5 text-[#20263F] disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={isSameDay(currentWeekStart, startOfWeek(new Date(), { weekStartsOn: 1 }))}
          >
            ←
          </button>
          <button 
            type="button"
            onClick={nextWeek}
            className="p-2 rounded-lg hover:bg-[#20263F]/5 text-[#20263F]"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {weekDays.map((day) => {
          const slots = getAvailableSlots(day);
          const isToday = isSameDay(day, new Date());
          const isPast = day < new Date() && !isToday;
          const isSelectedDay = selectedDate && isSameDay(day, selectedDate);

          return (
            <div key={day.toString()} className="flex flex-col gap-2">
              <div className={`text-center py-2 rounded-lg ${isSelectedDay ? 'bg-[#E5C66E] text-[#20263F]' : 'bg-[#F0F2F5]'}`}>
                <div className="text-[0.6rem] font-bold uppercase tracking-tighter opacity-70">
                  {format(day, 'EEE')}
                </div>
                <div className="text-sm font-black">
                  {format(day, 'd')}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                {slots.length === 0 ? (
                  <div className="text-[0.6rem] text-center font-bold text-[#20263F]/30 py-2">Closed</div>
                ) : (
                  slots.map((slot) => {
                    const isSelected = isSelectedDay && selectedTime === slot;
                    const isHalfHour = slot.endsWith(':30');

                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => onChange(day, slot)}
                        disabled={isPast}
                        className={`text-[0.65rem] font-bold py-1.5 rounded-md transition-all
                          ${isSelected 
                            ? 'bg-[#E5C66E] text-[#20263F] ring-2 ring-[#E5C66E] ring-offset-1' 
                            : isHalfHour 
                              ? 'bg-[#FFF9C4] text-[#20263F] hover:bg-[#FFF9C4]/80' 
                              : 'bg-white border border-[#20263F]/10 text-[#20263F] hover:bg-[#20263F]/5'}
                          ${isPast ? 'opacity-20 cursor-not-allowed' : ''}
                        `}
                      >
                        {formatTimeLabel(slot).replace(' ', '')}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

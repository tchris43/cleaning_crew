"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  addDays,
  addWeeks,
  format,
  isBefore,
  isSameDay,
  startOfDay,
  startOfWeek,
  subWeeks
} from "date-fns";
import {
  formatTimeLabel,
  getBookingWindow,
  getTimeBlocksForDay,
  isBookableDay,
  parseLocalDateString,
  TIME_BLOCK_LABELS,
  TIME_SLOTS
} from "../lib/slots";
import type { TimeBlock } from "../types/appointment";

export default function WeekPicker({
  selectedDate,
  selectedTime,
  onChange
}: {
  selectedDate: Date | null;
  selectedTime: string | null;
  onChange: (date: Date, time: string | null) => void;
}) {
  const today = startOfDay(new Date());

  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const now = startOfDay(new Date());
    const { earliestBookingDate } = getBookingWindow(now);
    const earliestDay = parseLocalDateString(earliestBookingDate);
    const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
    const earliestWeekStart = startOfWeek(earliestDay, { weekStartsOn: 1 });
    return earliestWeekStart > thisWeekStart ? earliestWeekStart : thisWeekStart;
  });

  const [activeDay, setActiveDay] = useState<Date | null>(selectedDate);

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i)),
    [currentWeekStart]
  );

  const selectableDays = useMemo(
    () => weekDays.filter((day) => isBookableDay(day, today)),
    [weekDays, today]
  );

  useEffect(() => {
    if (selectedDate) {
      setActiveDay(selectedDate);
      setCurrentWeekStart(startOfWeek(selectedDate, { weekStartsOn: 1 }));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (activeDay && selectableDays.some((day) => isSameDay(day, activeDay))) {
      return;
    }

    const nextDay = selectableDays[0] ?? null;
    if (nextDay) {
      setActiveDay(nextDay);
      onChange(nextDay, null);
    } else {
      setActiveDay(null);
    }
  }, [activeDay, selectableDays, onChange]);

  const nextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  const prevWeek = () => {
    const lastWeek = subWeeks(currentWeekStart, 1);
    const thisWeekStart = startOfWeek(today, { weekStartsOn: 1 });
    if (lastWeek < thisWeekStart) return;
    setCurrentWeekStart(lastWeek);
  };

  const activeBlocks = activeDay ? getTimeBlocksForDay(activeDay.getDay()) : [];

  function handleDaySelect(day: Date) {
    setActiveDay(day);
    if (selectedDate && isSameDay(selectedDate, day) && selectedTime) {
      return;
    }
    onChange(day, null);
  }

  function handleTimeSelect(slot: string) {
    if (!activeDay) return;
    onChange(activeDay, slot);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#20263F]">{format(currentWeekStart, "MMMM yyyy")}</h3>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={prevWeek}
            disabled={isSameDay(currentWeekStart, startOfWeek(today, { weekStartsOn: 1 }))}
            className="rounded-lg px-2.5 py-1.5 text-sm text-[#20263F] transition hover:bg-[#20263F]/5 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Previous week"
          >
            ←
          </button>
          <button
            type="button"
            onClick={nextWeek}
            className="rounded-lg px-2.5 py-1.5 text-sm text-[#20263F] transition hover:bg-[#20263F]/5"
            aria-label="Next week"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {weekDays.map((day) => {
          const blocks = getTimeBlocksForDay(day.getDay());
          const isClosed = blocks.length === 0;
          const isPast = isBefore(day, today);
          const isOutsideWindow = !isBookableDay(day, today);
          const isUnavailable = isClosed || isPast || isOutsideWindow;
          const isActive = activeDay ? isSameDay(day, activeDay) : false;
          const isToday = isSameDay(day, today);

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={isUnavailable}
              onClick={() => handleDaySelect(day)}
              className={`rounded-lg px-1 py-2 text-center transition sm:py-2.5
                ${isActive ? "bg-[#D9A62E] text-[#20263F] shadow-sm" : "bg-white border border-[#20263F]/10 text-[#20263F]"}
                ${isUnavailable ? "cursor-not-allowed opacity-35" : "hover:border-[#20263F]/25"}
                ${isToday && !isActive ? "ring-1 ring-[#20263F]/20" : ""}`}
            >
              <div className="text-[0.6rem] font-medium uppercase tracking-wide opacity-70 sm:text-xs">
                {format(day, "EEE")}
              </div>
              <div className="text-sm font-semibold sm:text-base">{format(day, "d")}</div>
            </button>
          );
        })}
      </div>

      {!activeDay && (
        <p className="text-sm text-[#20263F]/55">Select an available day to see open times.</p>
      )}

      {activeDay && activeBlocks.length === 0 && (
        <p className="text-sm text-[#20263F]/55">No appointments available on this day.</p>
      )}

      {activeDay && activeBlocks.length > 0 && (
        <div className="space-y-4 rounded-xl border border-[#20263F]/10 bg-white p-4">
          <p className="text-sm text-[#20263F]/70">
            <span className="font-semibold text-[#20263F]">{format(activeDay, "EEEE, MMMM d")}</span>
            {" · "}
            Pick a time
          </p>

          {activeBlocks.map((block: TimeBlock) => (
            <div key={block}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#20263F]/50">
                {TIME_BLOCK_LABELS[block]}
              </p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                {TIME_SLOTS[block].map((slot) => {
                  const isSelected =
                    selectedDate &&
                    selectedTime === slot &&
                    isSameDay(selectedDate, activeDay);

                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => handleTimeSelect(slot)}
                      aria-pressed={!!isSelected}
                      className={`rounded-lg px-2 py-2 text-xs font-medium transition sm:text-sm
                        ${isSelected
                          ? "border-2 border-[#D9A62E] bg-[#FFF9EC] text-[#20263F] shadow-sm ring-1 ring-[#D9A62E]/30"
                          : "border border-[#20263F]/12 bg-[#FAFBFC] text-[#20263F] hover:border-[#D9A62E] hover:bg-[#FFF9EC]"}`}
                    >
                      {formatTimeLabel(slot)}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

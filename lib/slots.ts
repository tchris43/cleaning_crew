import type { TimeBlock } from "../types/appointment";

export const BOOKING_CAPACITY = 3;

export const TIME_SLOTS: Record<TimeBlock, string[]> = {
  MORNING: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"],
  AFTERNOON: ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00"],
  EVENING: ["18:00", "18:30", "19:00", "19:30", "20:00"]
};

export const TIME_BLOCK_LABELS: Record<TimeBlock, string> = {
  MORNING: "Morning · 9 AM – 12 PM",
  AFTERNOON: "Afternoon · 12 PM – 4 PM",
  EVENING: "Evening · 6 PM – 9 PM"
};

export function getTimeBlocksForDay(dayOfWeek: number): TimeBlock[] {
  if (dayOfWeek === 0) return [];

  const blocks: TimeBlock[] = ["MORNING"];

  if (dayOfWeek === 2 || dayOfWeek === 4) {
    blocks.push("AFTERNOON");
  }

  if (dayOfWeek === 1 || dayOfWeek === 3) {
    blocks.push("EVENING");
  }

  return blocks;
}

export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatTimeLabel(slot: string): string {
  const [hours, minutes] = slot.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const normalizedHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${normalizedHour}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

export function getTimeBlockForAppointmentTime(appointmentTime: string): TimeBlock | null {
  for (const [timeBlock, slots] of Object.entries(TIME_SLOTS) as Array<[TimeBlock, string[]]>) {
    if (slots.includes(appointmentTime)) {
      return timeBlock;
    }
  }

  return null;
}

function toIsoDate(date: Date): string {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).toISOString().slice(0, 10);
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
}

export function getEarliestBookingDate(referenceDate = new Date()): string {
  return formatLocalDate(referenceDate);
}

export function getLatestBookingDate(referenceDate = new Date()): string {
  return toIsoDate(addDays(referenceDate, 60));
}

export function getBookingWindow(referenceDate = new Date()) {
  return {
    earliestBookingDate: getEarliestBookingDate(referenceDate),
    latestBookingDate: getLatestBookingDate(referenceDate)
  };
}

export function isWithinBookingWindow(appointmentDate: string, referenceDate = new Date()): boolean {
  const { earliestBookingDate, latestBookingDate } = getBookingWindow(referenceDate);
  return appointmentDate >= earliestBookingDate && appointmentDate <= latestBookingDate;
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isBookableDay(day: Date, referenceDate = new Date()): boolean {
  if (getTimeBlocksForDay(day.getDay()).length === 0) {
    return false;
  }

  if (startOfLocalDay(day) < startOfLocalDay(referenceDate)) {
    return false;
  }

  return isWithinBookingWindow(formatLocalDate(day), referenceDate);
}

export function isBookableTimeSlot(
  appointmentDate: string,
  appointmentTime: string,
  referenceDate = new Date()
): boolean {
  const day = parseLocalDateString(appointmentDate);
  if (!isBookableDay(day, referenceDate)) {
    return false;
  }

  if (formatLocalDate(day) !== formatLocalDate(referenceDate)) {
    return true;
  }

  const [hours, minutes] = appointmentTime.split(":").map(Number);
  const slotStart = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
    hours,
    minutes,
    0,
    0
  );

  return slotStart > referenceDate;
}

export function parseLocalDateString(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

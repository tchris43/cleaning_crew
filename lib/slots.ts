import type { TimeBlock } from "../types/appointment";

export const BOOKING_CAPACITY = 3;

export const TIME_SLOTS: Record<TimeBlock, string[]> = {
  MORNING: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"],
  AFTERNOON: ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00"],
  EVENING: ["18:00", "18:30", "19:00", "19:30", "20:00"]
};

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

export function getNextAvailableMonday(referenceDate = new Date()): string {
  const currentDay = referenceDate.getUTCDay();
  const daysUntilMonday = currentDay === 1 ? 7 : (8 - currentDay) % 7 || 7;
  return toIsoDate(addDays(referenceDate, daysUntilMonday));
}

export function getLatestBookingDate(referenceDate = new Date()): string {
  return toIsoDate(addDays(referenceDate, 60));
}

export function getBookingWindow(referenceDate = new Date()) {
  return {
    earliestBookingDate: getNextAvailableMonday(referenceDate),
    latestBookingDate: getLatestBookingDate(referenceDate)
  };
}

export function isWithinBookingWindow(appointmentDate: string, referenceDate = new Date()): boolean {
  const { earliestBookingDate, latestBookingDate } = getBookingWindow(referenceDate);
  return appointmentDate >= earliestBookingDate && appointmentDate <= latestBookingDate;
}

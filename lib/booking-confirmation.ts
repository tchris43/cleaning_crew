export const BOOKING_CONFIRMATION_KEY = "cleanCrewBookingConfirmation";

export type BookingConfirmation = {
  firstName: string;
  lastName: string;
  date: string;
  time: string;
  tier: string;
  vehicle: string;
  vehicleSize: string;
  email: string;
};

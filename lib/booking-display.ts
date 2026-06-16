import { format, parse } from "date-fns";

import { SERVICE_TIERS, type TierId, type VehicleSize } from "./services";

export function formatBookingDateLong(date: string): string {
  try {
    return format(parse(date, "yyyy-MM-dd", new Date()), "EEEE, MMMM d, yyyy");
  } catch {
    return date;
  }
}

export function formatVehicleSizeLabel(size: string): string {
  if (size === "MID-SIZED") return "Mid-sized";
  return size.charAt(0) + size.slice(1).toLowerCase();
}

export function getEstimatedTotal(tierId: TierId, vehicleSize: VehicleSize): string {
  return `$${SERVICE_TIERS[tierId].prices[vehicleSize]}`;
}

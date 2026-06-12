export type TierId = "BASIC_REFRESH" | "DEEP_CLEAN" | "PREMIUM_RESTORE";
export type VehicleSize = "SMALL" | "MID-SIZED" | "LARGE";

export interface ServiceTier {
  id: TierId;
  title: string;
  prices: Record<VehicleSize, number>;
}

export const SERVICE_TIERS: Record<TierId, ServiceTier> = {
  BASIC_REFRESH: {
    id: "BASIC_REFRESH",
    title: "Basic Interior Refresh",
    prices: {
      "SMALL": 79,
      "MID-SIZED": 99,
      "LARGE": 129
    }
  },
  DEEP_CLEAN: {
    id: "DEEP_CLEAN",
    title: "Deep Clean Interior",
    prices: {
      "SMALL": 169,
      "MID-SIZED": 199,
      "LARGE": 239
    }
  },
  PREMIUM_RESTORE: {
    id: "PREMIUM_RESTORE",
    title: "Premium Restoration",
    prices: {
      "SMALL": 249,
      "MID-SIZED": 299,
      "LARGE": 349
    }
  }
};

export const ADDONS = [
  { id: "pet_hair", label: "Excessive Pet Hair", priceRange: [35, 75], basePrice: 35 },
  { id: "staining", label: "Heavy Staining or Mud", priceRange: [50, 100], basePrice: 50 },
  { id: "biohazard", label: "Mold or Biohazards", priceRange: [100, 200], basePrice: 100 }
];

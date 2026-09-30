import type {
  Meal,
  GeneratedCoupon,
  GeneratedCoffeeCoupon,
  MealSummary,
  DietKind,
  CoffeeConfig,
} from "./types";
import { COUPONS_PER_PAGE } from "./types";

function padSerial(n: number, digits: number = 3): string {
  return String(n).padStart(digits, "0");
}

function buildSerial(
  prefix: string,
  diet: DietKind,
  index: number,
): string {
  const base = prefix.trim().toUpperCase() || "M";
  if (diet === "VEG") return `${base}-V-${padSerial(index)}`;
  if (diet === "NON_VEG") return `${base}-NV-${padSerial(index)}`;
  return `${base}-${padSerial(index)}`;
}

function makeCoupon(
  meal: Meal,
  diet: DietKind,
  index: number,
): GeneratedCoupon {
  return {
    id: `${meal.id}-${diet}-${index}`,
    mealId: meal.id,
    mealName: meal.name,
    diet,
    color: meal.color,
    time: meal.time,
    subtitle: meal.subtitle,
    serial: buildSerial(meal.serialPrefix, diet, index),
  };
}

/** Generate the full coupon list in meal order. Serials never repeat within the set. */
export function generateCoupons(meals: Meal[]): GeneratedCoupon[] {
  const coupons: GeneratedCoupon[] = [];

  for (const meal of meals) {
    if (meal.type === "GENERAL") {
      const qty = Math.max(0, Math.floor(meal.quantity));
      for (let i = 1; i <= qty; i++) {
        coupons.push(makeCoupon(meal, "GENERAL", i));
      }
    } else {
      const veg = Math.max(0, Math.floor(meal.vegQuantity));
      const nonVeg = Math.max(0, Math.floor(meal.nonVegQuantity));
      for (let i = 1; i <= veg; i++) {
        coupons.push(makeCoupon(meal, "VEG", i));
      }
      for (let i = 1; i <= nonVeg; i++) {
        coupons.push(makeCoupon(meal, "NON_VEG", i));
      }
    }
  }

  return coupons;
}

export function formatCoffeeSerial(
  prefix: string,
  serialNumber: number,
  digits: number = 3,
): string {
  const base = prefix.trim().toUpperCase() || "COF";
  return `${base}-${padSerial(serialNumber, digits)}`;
}

/** Generate sequential Coffee Coupons with unique non-repeating serials */
export function generateCoffeeCoupons(config: CoffeeConfig): GeneratedCoffeeCoupon[] {
  const coupons: GeneratedCoffeeCoupon[] = [];
  const qty = Math.max(0, Math.floor(config.quantity));
  const start = Math.max(0, Math.floor(config.startSerial));
  const prefix = config.serialPrefix.trim().toUpperCase() || "COF";
  const padDigits = Math.max(3, String(start + qty).length);

  for (let i = 0; i < qty; i++) {
    const serialNum = start + i;
    const serial = formatCoffeeSerial(prefix, serialNum, padDigits);
    coupons.push({
      id: `coffee-${serialNum}-${prefix}`,
      brandingType: config.brandingType || "NAME",
      eventTitle: config.eventTitle || "HACKSPIRE'26",
      customLogoUrl: config.customLogoUrl || "/hackspire-logo.svg",
      subtitle: config.subtitle || "VALID FOR 1 COFFEE",
      serial,
      color: config.color || "#78350F",
      notes: config.notes || "Single use only · Redeem at coffee counter",
      logoUrl: config.logoUrl || "/hackspire-logo.png",
    });
  }

  return coupons;
}

export function chunkIntoPages<T>(
  items: T[],
  perPage: number = COUPONS_PER_PAGE,
): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += perPage) {
    pages.push(items.slice(i, i + perPage));
  }
  return pages;
}

export function getMealSummaries(meals: Meal[]): MealSummary[] {
  return meals.map((meal) => {
    if (meal.type === "GENERAL") {
      const total = Math.max(0, Math.floor(meal.quantity || 0));
      return {
        meal,
        vegCount: 0,
        nonVegCount: 0,
        generalCount: total,
        total,
      };
    }
    const vegCount = Math.max(0, Math.floor(meal.vegQuantity || 0));
    const nonVegCount = Math.max(0, Math.floor(meal.nonVegQuantity || 0));
    return {
      meal,
      vegCount,
      nonVegCount,
      generalCount: 0,
      total: vegCount + nonVegCount,
    };
  });
}

export function getTotalCoupons(meals: Meal[]): number {
  return getMealSummaries(meals).reduce((sum, s) => sum + s.total, 0);
}

export function getPageCount(
  totalCoupons: number,
  perPage: number = COUPONS_PER_PAGE,
): number {
  if (totalCoupons <= 0) return 0;
  return Math.ceil(totalCoupons / perPage);
}

/** Pick readable text color for a background. */
export function getContrastingTextColor(hex: string): string {
  const cleaned = hex.replace("#", "");
  if (cleaned.length !== 6) return "#111827";
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  // Relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#111827" : "#FFFFFF";
}

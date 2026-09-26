import type {
  Meal,
  GeneratedCoupon,
  MealSummary,
  DietKind,
} from "./types";
import { COUPONS_PER_PAGE } from "./types";

function padSerial(n: number): string {
  return String(n).padStart(3, "0");
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

export function chunkIntoPages(
  coupons: GeneratedCoupon[],
  perPage: number = COUPONS_PER_PAGE,
): GeneratedCoupon[][] {
  const pages: GeneratedCoupon[][] = [];
  for (let i = 0; i < coupons.length; i += perPage) {
    pages.push(coupons.slice(i, i + perPage));
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

export function getPageCount(totalCoupons: number): number {
  if (totalCoupons <= 0) return 0;
  return Math.ceil(totalCoupons / COUPONS_PER_PAGE);
}

/** Pick readable text color for a meal background. */
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

export type AppMode = "MEALS" | "COFFEE";

export type MealType = "GENERAL" | "VEG_NONVEG";

export type DietKind = "GENERAL" | "VEG" | "NON_VEG";

export type CoffeeBrandingType = "NAME" | "LOGO" | "NONE";

export interface Meal {
  id: string;
  name: string;
  type: MealType;
  /** Used when type is GENERAL */
  quantity: number;
  /** Used when type is VEG_NONVEG */
  vegQuantity: number;
  /** Used when type is VEG_NONVEG */
  nonVegQuantity: number;
  color: string;
  time: string;
  subtitle: string;
  /** Base serial prefix, e.g. ES, D, MS, BF, L */
  serialPrefix: string;
}

export interface AppSettings {
  showSerialNumbers: boolean;
}

export interface CoffeeConfig {
  quantity: number;
  serialPrefix: string;
  startSerial: number;
  brandingType: CoffeeBrandingType;
  eventTitle: string;
  customLogoUrl?: string;
  subtitle: string;
  color: string;
  showSerialNumbers: boolean;
  notes: string;
  logoUrl?: string;
}

export interface AppState {
  mode: AppMode;
  meals: Meal[];
  settings: AppSettings;
  coffeeConfig: CoffeeConfig;
}

export interface GeneratedCoupon {
  id: string;
  mealId: string;
  mealName: string;
  diet: DietKind;
  color: string;
  time: string;
  subtitle: string;
  serial: string;
}

export interface GeneratedCoffeeCoupon {
  id: string;
  brandingType: CoffeeBrandingType;
  eventTitle: string;
  customLogoUrl?: string;
  subtitle: string;
  serial: string;
  color: string;
  notes: string;
  logoUrl: string;
}

export interface MealValidationError {
  mealId: string;
  field?: string;
  message: string;
}

export interface CoffeeValidationError {
  field?: "quantity" | "serialPrefix" | "startSerial" | "eventTitle";
  message: string;
}

export interface MealSummary {
  meal: Meal;
  vegCount: number;
  nonVegCount: number;
  generalCount: number;
  total: number;
}

export const COUPONS_PER_PAGE = 12;
export const PAGE_COLUMNS = 3;
export const PAGE_ROWS = 4;

export const COFFEE_COUPONS_PER_PAGE = 21;
export const COFFEE_PAGE_COLUMNS = 3;
export const COFFEE_PAGE_ROWS = 7;

export const STORAGE_KEY = "hackspire26-food-coupons";

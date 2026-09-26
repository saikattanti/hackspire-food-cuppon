export type MealType = "GENERAL" | "VEG_NONVEG";

export type DietKind = "GENERAL" | "VEG" | "NON_VEG";

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

export interface AppState {
  meals: Meal[];
  settings: AppSettings;
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

export interface MealValidationError {
  mealId: string;
  field?: string;
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

export const STORAGE_KEY = "hackspire26-food-coupons";

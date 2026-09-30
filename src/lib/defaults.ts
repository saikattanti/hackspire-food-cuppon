import type { Meal, AppSettings, AppState, CoffeeConfig } from "./types";

export function createId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Suggest a serial prefix from a meal name (editable by user). */
export function suggestSerialPrefix(name: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.replace(/[^a-zA-Z0-9]/g, ""));

  if (words.length === 0) return "M";

  if (words.length === 1) {
    const w = words[0].toUpperCase();
    if (w.length <= 2) return w;
    if (w.length >= 8) return w.slice(0, 2);
    return w[0];
  }

  return words
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
}

export const DEFAULT_SETTINGS: AppSettings = {
  showSerialNumbers: true,
};

export const DEFAULT_COFFEE_CONFIG: CoffeeConfig = {
  quantity: 120,
  serialPrefix: "COF",
  startSerial: 1,
  brandingType: "NAME",
  eventTitle: "HACKSPIRE'26",
  customLogoUrl: "/hackspire-logo.svg",
  subtitle: "VALID FOR 1 COFFEE",
  color: "#78350F",
  showSerialNumbers: true,
  notes: "Single use only · Redeem at coffee station",
  logoUrl: "/hackspire-logo.png",
};

export function getDefaultMeals(): Meal[] {
  return [
    {
      id: createId(),
      name: "Evening Snacks",
      type: "GENERAL",
      quantity: 370,
      vegQuantity: 0,
      nonVegQuantity: 0,
      color: "#F5C542",
      time: "5:00 PM",
      subtitle: "",
      serialPrefix: "ES",
    },
    {
      id: createId(),
      name: "Dinner",
      type: "VEG_NONVEG",
      quantity: 0,
      vegQuantity: 70,
      nonVegQuantity: 300,
      color: "#3B82F6",
      time: "8:30 PM – 10:00 PM",
      subtitle: "",
      serialPrefix: "D",
    },
    {
      id: createId(),
      name: "Midnight Snacks",
      type: "GENERAL",
      quantity: 370,
      vegQuantity: 0,
      nonVegQuantity: 0,
      color: "#8B5CF6",
      time: "12:00 AM – 1:00 AM",
      subtitle: "",
      serialPrefix: "MS",
    },
    {
      id: createId(),
      name: "Breakfast",
      type: "GENERAL",
      quantity: 370,
      vegQuantity: 0,
      nonVegQuantity: 0,
      color: "#22C55E",
      time: "8:00 AM – 9:00 AM",
      subtitle: "",
      serialPrefix: "BF",
    },
    {
      id: createId(),
      name: "Lunch",
      type: "VEG_NONVEG",
      quantity: 0,
      vegQuantity: 70,
      nonVegQuantity: 300,
      color: "#F97316",
      time: "1:00 PM – 2:00 PM",
      subtitle: "",
      serialPrefix: "L",
    },
  ];
}

export function getDefaultState(): AppState {
  return {
    mode: "COFFEE",
    meals: getDefaultMeals(),
    settings: { ...DEFAULT_SETTINGS },
    coffeeConfig: { ...DEFAULT_COFFEE_CONFIG },
  };
}

export function createEmptyMeal(): Meal {
  return {
    id: createId(),
    name: "New Meal",
    type: "GENERAL",
    quantity: 50,
    vegQuantity: 25,
    nonVegQuantity: 25,
    color: "#64748B",
    time: "",
    subtitle: "",
    serialPrefix: "NM",
  };
}

export const PRESET_COLORS = [
  { label: "Yellow", value: "#F5C542" },
  { label: "Blue", value: "#3B82F6" },
  { label: "Purple", value: "#8B5CF6" },
  { label: "Green", value: "#22C55E" },
  { label: "Orange", value: "#F97316" },
  { label: "Red", value: "#EF4444" },
  { label: "Teal", value: "#14B8A6" },
  { label: "Pink", value: "#EC4899" },
  { label: "Slate", value: "#64748B" },
] as const;

export const COFFEE_THEMES = [
  { label: "Warm Roast", value: "#78350F" },
  { label: "Dark Espresso", value: "#451A03" },
  { label: "Caramel Amber", value: "#B45309" },
  { label: "Slate Mocha", value: "#334155" },
  { label: "Cyber Black", value: "#0F172A" },
  { label: "Ink Saver White", value: "#FFFFFF" },
] as const;

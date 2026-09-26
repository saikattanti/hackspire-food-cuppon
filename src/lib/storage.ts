import type { AppState } from "./types";
import { STORAGE_KEY } from "./types";
import { getDefaultState } from "./defaults";

export function loadState(): AppState {
  if (typeof window === "undefined") return getDefaultState();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();

    const parsed = JSON.parse(raw) as Partial<AppState>;
    if (!parsed || !Array.isArray(parsed.meals)) return getDefaultState();

    return {
      meals: parsed.meals.map((m) => ({
        id: String(m.id ?? crypto.randomUUID()),
        name: String(m.name ?? ""),
        type: m.type === "VEG_NONVEG" ? "VEG_NONVEG" : "GENERAL",
        quantity: Number(m.quantity) || 0,
        vegQuantity: Number(m.vegQuantity) || 0,
        nonVegQuantity: Number(m.nonVegQuantity) || 0,
        color: String(m.color ?? "#64748B"),
        time: String(m.time ?? ""),
        subtitle: String(m.subtitle ?? ""),
        serialPrefix: String(m.serialPrefix ?? "M"),
      })),
      settings: {
        showSerialNumbers: parsed.settings?.showSerialNumbers !== false,
      },
    };
  } catch {
    return getDefaultState();
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota or private mode — ignore
  }
}

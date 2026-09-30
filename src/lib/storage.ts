import type { AppState } from "./types";
import { STORAGE_KEY } from "./types";
import { getDefaultState, DEFAULT_COFFEE_CONFIG } from "./defaults";

export function loadState(): AppState {
  if (typeof window === "undefined") return getDefaultState();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();

    const parsed = JSON.parse(raw) as Partial<AppState>;
    if (!parsed) return getDefaultState();

    const mode = parsed.mode === "MEALS" ? "MEALS" : "COFFEE";

    const meals = Array.isArray(parsed.meals)
      ? parsed.meals.map((m) => ({
          id: String(m.id ?? crypto.randomUUID()),
          name: String(m.name ?? ""),
          type: m.type === "VEG_NONVEG" ? ("VEG_NONVEG" as const) : ("GENERAL" as const),
          quantity: Number(m.quantity) || 0,
          vegQuantity: Number(m.vegQuantity) || 0,
          nonVegQuantity: Number(m.nonVegQuantity) || 0,
          color: String(m.color ?? "#64748B"),
          time: String(m.time ?? ""),
          subtitle: String(m.subtitle ?? ""),
          serialPrefix: String(m.serialPrefix ?? "M"),
        }))
      : getDefaultState().meals;

    const coffeeConfig = parsed.coffeeConfig
      ? {
          quantity:
            Number(parsed.coffeeConfig.quantity) > 0
              ? Number(parsed.coffeeConfig.quantity)
              : DEFAULT_COFFEE_CONFIG.quantity,
          serialPrefix: String(
            parsed.coffeeConfig.serialPrefix ?? DEFAULT_COFFEE_CONFIG.serialPrefix,
          ),
          startSerial: Number.isInteger(parsed.coffeeConfig.startSerial)
            ? Number(parsed.coffeeConfig.startSerial)
            : DEFAULT_COFFEE_CONFIG.startSerial,
          brandingType: (["NAME", "LOGO", "NONE"].includes(
            String(parsed.coffeeConfig.brandingType),
          )
            ? parsed.coffeeConfig.brandingType
            : DEFAULT_COFFEE_CONFIG.brandingType) as "NAME" | "LOGO" | "NONE",
          eventTitle: String(
            parsed.coffeeConfig.eventTitle ?? DEFAULT_COFFEE_CONFIG.eventTitle,
          ),
          customLogoUrl: String(
            parsed.coffeeConfig.customLogoUrl ??
              DEFAULT_COFFEE_CONFIG.customLogoUrl,
          ),
          subtitle: String(
            parsed.coffeeConfig.subtitle ?? DEFAULT_COFFEE_CONFIG.subtitle,
          ),
          color: String(parsed.coffeeConfig.color ?? DEFAULT_COFFEE_CONFIG.color),
          showSerialNumbers: parsed.coffeeConfig.showSerialNumbers !== false,
          notes: String(parsed.coffeeConfig.notes ?? DEFAULT_COFFEE_CONFIG.notes),
          logoUrl: String(
            parsed.coffeeConfig.logoUrl ?? DEFAULT_COFFEE_CONFIG.logoUrl,
          ),
        }
      : { ...DEFAULT_COFFEE_CONFIG };

    return {
      mode,
      meals,
      settings: {
        showSerialNumbers: parsed.settings?.showSerialNumbers !== false,
      },
      coffeeConfig,
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

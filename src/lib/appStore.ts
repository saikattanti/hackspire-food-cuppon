import type { AppState, Meal, AppSettings, CoffeeConfig, AppMode } from "./types";
import { getDefaultState } from "./defaults";
import { loadState, saveState } from "./storage";

type Listener = () => void;

const SERVER_SNAPSHOT: AppState = getDefaultState();
let state: AppState = SERVER_SNAPSHOT;
let didHydrate = false;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
}

/** Hydrate once when the client store is first subscribed (pure getSnapshot). */
function hydrateFromStorage() {
  if (typeof window === "undefined" || didHydrate) return;
  state = loadState();
  didHydrate = true;
}

export function subscribeAppStore(listener: Listener): () => void {
  hydrateFromStorage();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAppStoreSnapshot(): AppState {
  return state;
}

export function getAppStoreServerSnapshot(): AppState {
  return SERVER_SNAPSHOT;
}

export function setAppModeInStore(mode: AppMode): void {
  state = { ...state, mode };
  saveState(state);
  emit();
}

export function setMealsInStore(meals: Meal[]): void {
  state = { ...state, meals };
  saveState(state);
  emit();
}

export function setSettingsInStore(settings: AppSettings): void {
  state = { ...state, settings };
  saveState(state);
  emit();
}

export function setCoffeeConfigInStore(coffeeConfig: CoffeeConfig): void {
  state = { ...state, coffeeConfig };
  saveState(state);
  emit();
}

export function replaceAppStore(next: AppState): void {
  state = next;
  didHydrate = true;
  saveState(state);
  emit();
}

"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { AppMode, CoffeeConfig, GeneratedCoffeeCoupon, GeneratedCoupon, Meal } from "@/lib/types";
import { DEFAULT_COFFEE_CONFIG, getDefaultState } from "@/lib/defaults";
import {
  getAppStoreServerSnapshot,
  getAppStoreSnapshot,
  replaceAppStore,
  setAppModeInStore,
  setCoffeeConfigInStore,
  setMealsInStore,
  setSettingsInStore,
  subscribeAppStore,
} from "@/lib/appStore";
import { validateCoffeeConfig, validateMeals } from "@/lib/validation";
import {
  generateCoffeeCoupons,
  generateCoupons,
  getMealSummaries,
  getTotalCoupons,
} from "@/lib/coupons";
import MealEditor from "./MealEditor";
import SummaryPanel from "./SummaryPanel";
import PrintControls from "./PrintControls";
import CouponPreview from "./CouponPreview";
import CoffeeCouponEditor from "./CoffeeCouponEditor";
import CoffeeCouponPreview from "./CoffeeCouponPreview";

export default function CouponGeneratorApp() {
  const store = useSyncExternalStore(
    subscribeAppStore,
    getAppStoreSnapshot,
    getAppStoreServerSnapshot,
  );

  const mode = store.mode || "COFFEE";
  const meals = store.meals;
  const showMealSerials = store.settings.showSerialNumbers;
  const coffeeConfig = store.coffeeConfig || DEFAULT_COFFEE_CONFIG;

  // --- Meal State ---
  const [mealCoupons, setMealCoupons] = useState<GeneratedCoupon[]>([]);
  const [mealGenerated, setMealGenerated] = useState(false);
  const [mealPreviewStale, setMealPreviewStale] = useState(false);
  const [isGeneratingMeals, setIsGeneratingMeals] = useState(false);

  // --- Coffee State ---
  const [coffeeCoupons, setCoffeeCoupons] = useState<GeneratedCoffeeCoupon[]>([]);
  const [coffeeGenerated, setCoffeeGenerated] = useState(false);
  const [coffeePreviewStale, setCoffeePreviewStale] = useState(false);
  const [isGeneratingCoffee, setIsGeneratingCoffee] = useState(false);

  // --- Shared Print Orchestration ---
  const [mountPrintDom, setMountPrintDom] = useState(false);
  const [printReady, setPrintReady] = useState(false);
  const [isPreparingPrint, setIsPreparingPrint] = useState(false);

  const expectedPrintCount = mode === "COFFEE" ? coffeeCoupons.length : mealCoupons.length;

  // Wait until print DOM has all coupons mounted, then launch browser print dialog
  useEffect(() => {
    if (!printReady || !mountPrintDom) return;

    let cancelled = false;
    let frames = 0;
    const expected = expectedPrintCount;
    const maxFrames = Math.max(90, Math.ceil(expected / 8));

    const tick = () => {
      if (cancelled) return;
      const mounted = document.querySelectorAll(".print-root .coupon").length;
      if (mounted >= expected || frames >= maxFrames) {
        window.print();
        setPrintReady(false);
        setIsPreparingPrint(false);
        return;
      }
      frames += 1;
      window.requestAnimationFrame(tick);
    };

    window.requestAnimationFrame(tick);
    return () => {
      cancelled = true;
    };
  }, [printReady, mountPrintDom, expectedPrintCount]);

  // Validation & Summaries
  const mealErrors = useMemo(() => validateMeals(meals), [meals]);
  const mealSummaries = useMemo(() => getMealSummaries(meals), [meals]);
  const totalMealCoupons = useMemo(() => getTotalCoupons(meals), [meals]);
  const coffeeErrors = useMemo(() => validateCoffeeConfig(coffeeConfig), [coffeeConfig]);

  // Handle Mode Change
  const handleSelectMode = (nextMode: AppMode) => {
    setAppModeInStore(nextMode);
    setMountPrintDom(false);
    setIsPreparingPrint(false);
    setPrintReady(false);
  };

  // --- Meal Handlers ---
  const markMealsStale = useCallback(() => {
    if (mealGenerated) setMealPreviewStale(true);
    setMountPrintDom(false);
    setIsPreparingPrint(false);
    setPrintReady(false);
  }, [mealGenerated]);

  const handleMealsChange = (next: Meal[]) => {
    setMealsInStore(next);
    markMealsStale();
  };

  const handleGenerateMeals = () => {
    if (mealErrors.length > 0) return;
    setIsGeneratingMeals(true);
    setMountPrintDom(false);
    setPrintReady(false);
    setIsPreparingPrint(false);
    window.setTimeout(() => {
      const next = generateCoupons(meals);
      setMealCoupons(next);
      setMealGenerated(true);
      setMealPreviewStale(false);
      setIsGeneratingMeals(false);
    }, 30);
  };

  const handlePrintMeals = () => {
    if (!mealGenerated || mealCoupons.length === 0 || mealErrors.length > 0 || mealPreviewStale) {
      return;
    }
    if (!mountPrintDom) {
      setIsPreparingPrint(true);
      setMountPrintDom(true);
      setPrintReady(true);
      return;
    }
    window.print();
  };

  const handleClearAllMeals = () => {
    const ok = window.confirm(
      "Clear all meals? This cannot be undone (unless you reset demo data).",
    );
    if (!ok) return;
    setMealsInStore([]);
    setMealCoupons([]);
    setMealGenerated(false);
    setMealPreviewStale(false);
    setMountPrintDom(false);
    setPrintReady(false);
    setIsPreparingPrint(false);
  };

  const handleResetMealDefaults = () => {
    const ok = window.confirm(
      "Reset to default HackSpire'26 meal configuration?",
    );
    if (!ok) return;
    replaceAppStore({ ...getDefaultState(), mode: "MEALS" });
    setMealCoupons([]);
    setMealGenerated(false);
    setMealPreviewStale(false);
    setMountPrintDom(false);
    setPrintReady(false);
    setIsPreparingPrint(false);
  };

  // --- Coffee Handlers ---
  const markCoffeeStale = useCallback(() => {
    if (coffeeGenerated) setCoffeePreviewStale(true);
    setMountPrintDom(false);
    setIsPreparingPrint(false);
    setPrintReady(false);
  }, [coffeeGenerated]);

  const handleCoffeeConfigChange = (next: CoffeeConfig) => {
    setCoffeeConfigInStore(next);
    markCoffeeStale();
  };

  const handleGenerateCoffee = () => {
    if (coffeeErrors.length > 0) return;
    setIsGeneratingCoffee(true);
    setMountPrintDom(false);
    setPrintReady(false);
    setIsPreparingPrint(false);
    window.setTimeout(() => {
      const next = generateCoffeeCoupons(coffeeConfig);
      setCoffeeCoupons(next);
      setCoffeeGenerated(true);
      setCoffeePreviewStale(false);
      setIsGeneratingCoffee(false);
    }, 30);
  };

  const handlePrintCoffee = () => {
    if (
      !coffeeGenerated ||
      coffeeCoupons.length === 0 ||
      coffeeErrors.length > 0 ||
      coffeePreviewStale
    ) {
      return;
    }
    if (!mountPrintDom) {
      setIsPreparingPrint(true);
      setMountPrintDom(true);
      setPrintReady(true);
      return;
    }
    window.print();
  };

  const handleResetCoffeeDefaults = () => {
    const ok = window.confirm(
      "Reset Coffee Coupon configuration to default values?",
    );
    if (!ok) return;
    setCoffeeConfigInStore({ ...DEFAULT_COFFEE_CONFIG });
    setCoffeeCoupons([]);
    setCoffeeGenerated(false);
    setCoffeePreviewStale(false);
    setMountPrintDom(false);
    setPrintReady(false);
    setIsPreparingPrint(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Header */}
      <header className="no-print border-b border-slate-200 bg-white shadow-2xs">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold tracking-wider text-amber-800 uppercase">
                HackSpire&apos;26 Food Ops
              </span>
              <span className="text-xs font-medium text-slate-400">·</span>
              <span className="text-xs font-medium text-slate-500">
                A4 · 3×4 Grid · 12 Coupons/Page
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Coupon Generator
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Configure parameters → Generate preview → Print & cut. Zero backend, client-side only.
            </p>
          </div>

          {/* Coupon Type Mode Selector */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1.5 border border-slate-200 shadow-inner">
            <button
              type="button"
              onClick={() => handleSelectMode("COFFEE")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                mode === "COFFEE"
                  ? "bg-amber-700 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>☕</span>
              <span>Coffee Coupons</span>
              {mode === "COFFEE" ? (
                <span className="rounded-full bg-amber-500/30 px-1.5 py-0.2 text-[10px] uppercase">
                  Active
                </span>
              ) : null}
            </button>

            <button
              type="button"
              onClick={() => handleSelectMode("MEALS")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                mode === "MEALS"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>🍽️</span>
              <span>Meal Coupons</span>
              {mode === "MEALS" ? (
                <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] uppercase">
                  Active
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:px-6">
        {mode === "COFFEE" ? (
          /* ================= COFFEE COUPON MODE ================= */
          <>
            <div className="no-print space-y-4">
              <CoffeeCouponEditor
                config={coffeeConfig}
                errors={coffeeErrors}
                canPrint={coffeeGenerated && !coffeePreviewStale && coffeeCoupons.length > 0}
                isGenerating={isGeneratingCoffee}
                isPreparingPrint={isPreparingPrint}
                onChange={handleCoffeeConfigChange}
                onGenerate={handleGenerateCoffee}
                onPrint={handlePrintCoffee}
                onReset={handleResetCoffeeDefaults}
              />
            </div>

            <div className="space-y-3">
              <div className="no-print flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold tracking-wide text-slate-900 uppercase">
                    ☕ Coffee Coupon Preview
                  </h2>
                </div>
                {coffeePreviewStale ? (
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 border border-amber-200">
                    ⚠️ Config changed — regenerate preview
                  </span>
                ) : null}
                {isPreparingPrint ? (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800 border border-emerald-200">
                    Preparing print pages…
                  </span>
                ) : mountPrintDom ? (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800 border border-emerald-200">
                    ✓ Print pages ready
                  </span>
                ) : null}
              </div>

              <CoffeeCouponPreview
                coupons={coffeeCoupons}
                showSerial={coffeeConfig.showSerialNumbers}
                generated={coffeeGenerated}
                mountPrintDom={mountPrintDom}
              />
            </div>
          </>
        ) : (
          /* ================= MEAL COUPON MODE ================= */
          <>
            <div className="no-print space-y-4">
              <PrintControls
                showSerialNumbers={showMealSerials}
                onToggleSerial={(v) => {
                  setSettingsInStore({ showSerialNumbers: v });
                  markMealsStale();
                }}
                onGenerate={handleGenerateMeals}
                onPrint={handlePrintMeals}
                onClearAll={handleClearAllMeals}
                onResetDefaults={handleResetMealDefaults}
                canPrint={mealGenerated && !mealPreviewStale && mealCoupons.length > 0}
                isGenerating={isGeneratingMeals}
                isPreparingPrint={isPreparingPrint}
                errorCount={mealErrors.length}
              />

              <SummaryPanel summaries={mealSummaries} totalCoupons={totalMealCoupons} />

              <MealEditor
                meals={meals}
                errors={mealErrors}
                onChange={handleMealsChange}
              />
            </div>

            <div className="space-y-3">
              <div className="no-print flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-bold tracking-wide text-slate-900 uppercase">
                  🍽️ Meal Coupon Preview
                </h2>
                {mealPreviewStale ? (
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 border border-amber-200">
                    ⚠️ Config changed — regenerate preview
                  </span>
                ) : null}
                {isPreparingPrint ? (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800 border border-emerald-200">
                    Preparing print pages…
                  </span>
                ) : mountPrintDom ? (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800 border border-emerald-200">
                    ✓ Print pages ready
                  </span>
                ) : null}
              </div>

              <CouponPreview
                coupons={mealCoupons}
                showSerial={showMealSerials}
                generated={mealGenerated}
                mountPrintDom={mountPrintDom}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

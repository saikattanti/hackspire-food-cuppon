"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { GeneratedCoupon, Meal } from "@/lib/types";
import { getDefaultState } from "@/lib/defaults";
import {
  getAppStoreServerSnapshot,
  getAppStoreSnapshot,
  replaceAppStore,
  setMealsInStore,
  setSettingsInStore,
  subscribeAppStore,
} from "@/lib/appStore";
import { validateMeals } from "@/lib/validation";
import {
  generateCoupons,
  getMealSummaries,
  getTotalCoupons,
} from "@/lib/coupons";
import MealEditor from "./MealEditor";
import SummaryPanel from "./SummaryPanel";
import PrintControls from "./PrintControls";
import CouponPreview from "./CouponPreview";

export default function CouponGeneratorApp() {
  const store = useSyncExternalStore(
    subscribeAppStore,
    getAppStoreSnapshot,
    getAppStoreServerSnapshot,
  );
  const meals = store.meals;
  const showSerialNumbers = store.settings.showSerialNumbers;

  const [coupons, setCoupons] = useState<GeneratedCoupon[]>([]);
  const [generated, setGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewStale, setPreviewStale] = useState(false);
  const [mountPrintDom, setMountPrintDom] = useState(false);
  const [printReady, setPrintReady] = useState(false);
  const [isPreparingPrint, setIsPreparingPrint] = useState(false);

  // Wait until print DOM has all coupons, then open the browser print dialog
  useEffect(() => {
    if (!printReady || !mountPrintDom) return;

    let cancelled = false;
    let frames = 0;
    const expected = coupons.length;
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
  }, [printReady, mountPrintDom, coupons.length]);

  const errors = useMemo(() => validateMeals(meals), [meals]);
  const summaries = useMemo(() => getMealSummaries(meals), [meals]);
  const totalCoupons = useMemo(() => getTotalCoupons(meals), [meals]);

  const markStale = useCallback(() => {
    if (generated) setPreviewStale(true);
    setMountPrintDom(false);
    setIsPreparingPrint(false);
    setPrintReady(false);
  }, [generated]);

  const handleMealsChange = (next: Meal[]) => {
    setMealsInStore(next);
    markStale();
  };

  const handleGenerate = () => {
    if (errors.length > 0) return;
    setIsGenerating(true);
    setMountPrintDom(false);
    setPrintReady(false);
    setIsPreparingPrint(false);
    window.setTimeout(() => {
      const next = generateCoupons(meals);
      setCoupons(next);
      setGenerated(true);
      setPreviewStale(false);
      setIsGenerating(false);
    }, 30);
  };

  const handlePrint = () => {
    if (!generated || coupons.length === 0 || errors.length > 0 || previewStale) {
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

  const handleClearAll = () => {
    const ok = window.confirm(
      "Clear all meals? This cannot be undone (unless you reset demo data).",
    );
    if (!ok) return;
    setMealsInStore([]);
    setCoupons([]);
    setGenerated(false);
    setPreviewStale(false);
    setMountPrintDom(false);
    setPrintReady(false);
    setIsPreparingPrint(false);
  };

  const handleResetDefaults = () => {
    const ok = window.confirm(
      "Reset to default HackSpire'26 meal configuration?",
    );
    if (!ok) return;
    replaceAppStore(getDefaultState());
    setCoupons([]);
    setGenerated(false);
    setPreviewStale(false);
    setMountPrintDom(false);
    setPrintReady(false);
    setIsPreparingPrint(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="no-print border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-emerald-700 uppercase">
              Event Food Ops
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              HackSpire&apos;26 Food Coupon Generator
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Configure meals → generate printable A4 coupons → print, cut, and
              distribute. Client-side only — no login, no QR, no database.
            </p>
          </div>
          <div className="text-sm text-slate-500">
            A4 · 3×4 grid · color print ready
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:px-6">
        <div className="no-print space-y-4">
          <PrintControls
            showSerialNumbers={showSerialNumbers}
            onToggleSerial={(v) => {
              setSettingsInStore({ showSerialNumbers: v });
              markStale();
            }}
            onGenerate={handleGenerate}
            onPrint={handlePrint}
            onClearAll={handleClearAll}
            onResetDefaults={handleResetDefaults}
            canPrint={generated && !previewStale && coupons.length > 0}
            isGenerating={isGenerating}
            isPreparingPrint={isPreparingPrint}
            errorCount={errors.length}
          />

          <SummaryPanel summaries={summaries} totalCoupons={totalCoupons} />

          <MealEditor
            meals={meals}
            errors={errors}
            onChange={handleMealsChange}
          />
        </div>

        <div className="space-y-3">
          <div className="no-print flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-bold tracking-wide text-slate-900 uppercase">
              Live Preview
            </h2>
            {previewStale ? (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                Config changed — regenerate preview
              </span>
            ) : null}
            {isPreparingPrint ? (
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
                Preparing print pages…
              </span>
            ) : mountPrintDom ? (
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
                Print pages ready
              </span>
            ) : null}
          </div>
          <CouponPreview
            coupons={coupons}
            showSerial={showSerialNumbers}
            generated={generated}
            mountPrintDom={mountPrintDom}
          />
        </div>
      </main>
    </div>
  );
}

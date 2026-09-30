"use client";

import { useRef } from "react";
import type { CoffeeConfig, CoffeeValidationError, CoffeeBrandingType } from "@/lib/types";
import { COFFEE_COUPONS_PER_PAGE } from "@/lib/types";
import { COFFEE_THEMES, DEFAULT_COFFEE_CONFIG } from "@/lib/defaults";
import { formatCoffeeSerial, getPageCount } from "@/lib/coupons";

interface CoffeeCouponEditorProps {
  config: CoffeeConfig;
  errors: CoffeeValidationError[];
  canPrint: boolean;
  isGenerating: boolean;
  isPreparingPrint: boolean;
  onChange: (config: CoffeeConfig) => void;
  onGenerate: () => void;
  onPrint: () => void;
  onReset: () => void;
}

const QUANTITY_PRESETS = [105, 210, 315, 420, 630];

const LOGO_PRESETS = [
  { label: "HackSpire Badge", value: "/hackspire-logo.svg" },
  { label: "HackSpire Emblem", value: "/hackspire-logo.png" },
  { label: "FIEM ACM Crest", value: "/fiem-acm-logo.png" },
];

export default function CoffeeCouponEditor({
  config,
  errors,
  canPrint,
  isGenerating,
  isPreparingPrint,
  onChange,
  onGenerate,
  onPrint,
  onReset,
}: CoffeeCouponEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFieldError = (field: CoffeeValidationError["field"]) =>
    errors.find((e) => e.field === field)?.message;

  const update = <K extends keyof CoffeeConfig>(key: K, value: CoffeeConfig[K]) => {
    onChange({ ...config, [key]: value });
  };

  const setPositiveInt = (
    raw: string,
    key: "quantity" | "startSerial",
    fallback: number = 0,
  ) => {
    if (raw.trim() === "") {
      update(key, fallback as CoffeeConfig[typeof key]);
      return;
    }
    if (!/^\d+$/.test(raw.trim())) return;
    update(key, Number.parseInt(raw.trim(), 10) as CoffeeConfig[typeof key]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      if (dataUrl) {
        update("customLogoUrl", dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const pages = getPageCount(config.quantity, COFFEE_COUPONS_PER_PAGE);
  const startNum = Math.max(0, Math.floor(config.startSerial));
  const qty = Math.max(0, Math.floor(config.quantity));
  const padDigits = Math.max(3, String(startNum + qty).length);
  const startSerialStr = formatCoffeeSerial(config.serialPrefix, startNum, padDigits);
  const endSerialStr = formatCoffeeSerial(
    config.serialPrefix,
    qty > 0 ? startNum + qty - 1 : startNum,
    padDigits,
  );

  const brandingType = config.brandingType || "NAME";

  return (
    <div className="space-y-4">
      {/* Quick Action Bar */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-lg">
              ☕
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Coffee Coupon Actions
              </h2>
              <p className="text-xs text-slate-500">
                Configure batch → Generate preview → Print A4 sheets
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onReset}
            disabled={isPreparingPrint}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            ↺ Reset Defaults
          </button>
        </div>

        {errors.length > 0 ? (
          <div className="mt-3 rounded-lg bg-red-50 p-2.5 text-xs text-red-700 border border-red-200">
            ⚠️ Please fix {errors.length} validation error{errors.length === 1 ? "" : "s"} before generating.
          </div>
        ) : null}

        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating || isPreparingPrint || errors.length > 0}
            className="flex items-center justify-center gap-2 rounded-xl bg-amber-700 px-4 py-3 text-sm font-bold text-white shadow-xs hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
          >
            {isGenerating ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Generating…
              </>
            ) : (
              <>
                <span>✨</span> Generate Preview
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onPrint}
            disabled={!canPrint || isPreparingPrint}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-xs hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
          >
            {isPreparingPrint ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Preparing Print…
              </>
            ) : (
              <>
                <span>🖨️</span> Print Coffee Coupons
              </>
            )}
          </button>
        </div>
      </section>

      {/* Batch Summary Card */}
      <section className="rounded-2xl bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 p-5 text-white shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Live Coffee Batch Summary
          </span>
          <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
            3/Row · 21 Coupons / Page (3×7 Grid)
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-white/5 p-3 backdrop-blur-xs border border-white/10">
            <span className="block text-xs text-slate-400">Total Coupons</span>
            <span className="text-xl font-extrabold text-white">
              {config.quantity.toLocaleString()}
            </span>
          </div>

          <div className="rounded-xl bg-white/5 p-3 backdrop-blur-xs border border-white/10">
            <span className="block text-xs text-slate-400">Estimated Pages</span>
            <span className="text-xl font-extrabold text-amber-400">
              {pages} A4 {pages === 1 ? "page" : "pages"}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 rounded-xl bg-white/5 p-3 backdrop-blur-xs border border-white/10">
            <span className="block text-xs text-slate-400">Serial Range</span>
            <span className="font-mono text-xs font-bold text-slate-200 block truncate">
              {qty > 0 ? `${startSerialStr} → ${endSerialStr}` : "—"}
            </span>
          </div>
        </div>
      </section>

      {/* Main Configuration Card */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          Batch & Serial Parameters
        </h3>

        {/* Quantity Field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="coffee-qty" className="text-sm font-medium text-slate-700">
              Number of Coffee Coupons
            </label>
            <div className="flex gap-1">
              {QUANTITY_PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => update("quantity", p)}
                  className={`rounded-md px-2 py-0.5 text-xs font-semibold transition-colors ${
                    config.quantity === p
                      ? "bg-amber-800 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <input
            id="coffee-qty"
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            value={config.quantity}
            onChange={(e) => setPositiveInt(e.target.value, "quantity", 1)}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
            placeholder="e.g. 180"
          />
          {getFieldError("quantity") ? (
            <p className="mt-1 text-xs text-red-600">{getFieldError("quantity")}</p>
          ) : null}
        </div>

        {/* Serial Prefix & Start Number */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="coffee-prefix" className="block text-sm font-medium text-slate-700 mb-1">
              Serial Prefix
            </label>
            <input
              id="coffee-prefix"
              type="text"
              maxLength={8}
              value={config.serialPrefix}
              onChange={(e) => update("serialPrefix", e.target.value.toUpperCase())}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 font-mono text-sm uppercase outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
              placeholder="COF"
            />
            {getFieldError("serialPrefix") ? (
              <p className="mt-1 text-xs text-red-600">{getFieldError("serialPrefix")}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-400">e.g. COF-001, COF-002</p>
            )}
          </div>

          <div>
            <label htmlFor="coffee-start" className="block text-sm font-medium text-slate-700 mb-1">
              Starting Serial Number
            </label>
            <input
              id="coffee-start"
              type="number"
              min={0}
              step={1}
              inputMode="numeric"
              value={config.startSerial}
              onChange={(e) => setPositiveInt(e.target.value, "startSerial", 1)}
              onFocus={(e) => e.currentTarget.select()}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 font-mono text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
              placeholder="1"
            />
            {getFieldError("startSerial") ? (
              <p className="mt-1 text-xs text-red-600">{getFieldError("startSerial")}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-400">First coupon sequence index</p>
            )}
          </div>
        </div>

        {/* Serial Toggle */}
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 pt-1">
          <input
            type="checkbox"
            checked={config.showSerialNumbers}
            onChange={(e) => update("showSerialNumbers", e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-amber-700 focus:ring-amber-600"
          />
          <span className="font-medium">Print unique sequential serial numbers</span>
        </label>
      </section>

      {/* Coupon Branding & Style Card */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          Branding & Appearance
        </h3>

        {/* Header Branding Mode Selector */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Center Event Branding
          </label>
          <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => update("brandingType", "NAME")}
              className={`rounded-lg py-2 font-bold transition-all ${
                brandingType === "NAME"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🏷️ Event Name
            </button>

            <button
              type="button"
              onClick={() => update("brandingType", "LOGO")}
              className={`rounded-lg py-2 font-bold transition-all ${
                brandingType === "LOGO"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🖼️ Event Logo
            </button>

            <button
              type="button"
              onClick={() => update("brandingType", "NONE")}
              className={`rounded-lg py-2 font-bold transition-all ${
                brandingType === "NONE"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🚫 None (Minimal)
            </button>
          </div>
        </div>

        {/* Conditional Field: Event Name */}
        {brandingType === "NAME" ? (
          <div>
            <label htmlFor="coffee-event" className="block text-sm font-medium text-slate-700 mb-1">
              Event Title
            </label>
            <input
              id="coffee-event"
              type="text"
              value={config.eventTitle}
              onChange={(e) => update("eventTitle", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
              placeholder="HACKSPIRE'26"
            />
            {getFieldError("eventTitle") ? (
              <p className="mt-1 text-xs text-red-600">{getFieldError("eventTitle")}</p>
            ) : null}
          </div>
        ) : null}

        {/* Conditional Field: Event Logo */}
        {brandingType === "LOGO" ? (
          <div className="space-y-2 rounded-xl bg-slate-50 p-3 border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Choose or Upload Event Logo
              </label>
              {config.customLogoUrl ? (
                <button
                  type="button"
                  onClick={() => update("customLogoUrl", "/hackspire-logo.svg")}
                  className="text-[11px] font-semibold text-amber-700 hover:underline"
                >
                  Reset Logo
                </button>
              ) : null}
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5">
              {LOGO_PRESETS.map((lp) => (
                <button
                  key={lp.value}
                  type="button"
                  onClick={() => update("customLogoUrl", lp.value)}
                  className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-all ${
                    config.customLogoUrl === lp.value
                      ? "bg-amber-700 text-white border-amber-700 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {lp.label}
                </button>
              ))}
            </div>

            {/* Upload or Custom URL */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-100"
              >
                📁 Upload Image
              </button>

              <input
                type="text"
                value={config.customLogoUrl || ""}
                onChange={(e) => update("customLogoUrl", e.target.value)}
                placeholder="/logo.png or image URL"
                className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-amber-600"
              />
            </div>

            {/* Live Preview Thumbnail */}
            {config.customLogoUrl ? (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-500">Preview:</span>
                <div className="h-6 max-w-[80px] bg-white p-0.5 rounded border border-slate-200 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={config.customLogoUrl}
                    alt="Logo Preview"
                    className="h-full w-auto object-contain"
                  />
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Validity Text */}
        <div>
          <label htmlFor="coffee-sub" className="block text-sm font-medium text-slate-700 mb-1">
            Validity Text / Subtitle
          </label>
          <input
            id="coffee-sub"
            type="text"
            value={config.subtitle}
            onChange={(e) => update("subtitle", e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
            placeholder="VALID FOR 1 COFFEE"
          />
        </div>

        {/* Note / Terms */}
        <div>
          <label htmlFor="coffee-notes" className="block text-sm font-medium text-slate-700 mb-1">
            Verification Note
          </label>
          <input
            id="coffee-notes"
            type="text"
            value={config.notes}
            onChange={(e) => update("notes", e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
            placeholder="Single use only · Redeem at coffee counter"
          />
        </div>

        {/* Theme Color Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Coupon Theme Color
          </label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 mb-2">
            {COFFEE_THEMES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => update("color", t.value)}
                className={`flex flex-col items-center gap-1 rounded-xl p-2 border transition-all text-center ${
                  config.color.toUpperCase() === t.value.toUpperCase()
                    ? "border-amber-600 ring-2 ring-amber-600 bg-amber-50/50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <span
                  className="h-6 w-full rounded-md shadow-inner border border-black/10"
                  style={{ backgroundColor: t.value }}
                />
                <span className="text-[10px] font-semibold text-slate-700 line-clamp-1">
                  {t.label}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="color"
              value={config.color}
              onChange={(e) => update("color", e.target.value)}
              className="h-9 w-12 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
            />
            <span className="text-xs text-slate-500 font-mono">
              Custom Hex: {config.color}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

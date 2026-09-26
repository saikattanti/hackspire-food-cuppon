"use client";

interface PrintControlsProps {
  showSerialNumbers: boolean;
  onToggleSerial: (value: boolean) => void;
  onGenerate: () => void;
  onPrint: () => void;
  onClearAll: () => void;
  onResetDefaults: () => void;
  canPrint: boolean;
  isGenerating: boolean;
  isPreparingPrint: boolean;
  errorCount: number;
}

export default function PrintControls({
  showSerialNumbers,
  onToggleSerial,
  onGenerate,
  onPrint,
  onClearAll,
  onResetDefaults,
  canPrint,
  isGenerating,
  isPreparingPrint,
  errorCount,
}: PrintControlsProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-bold tracking-wide text-slate-900 uppercase">
        Quick Controls
      </h2>

      <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={showSerialNumbers}
          onChange={(e) => onToggleSerial(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
        />
        Show serial numbers on coupons
      </label>

      {errorCount > 0 ? (
        <p className="mt-2 text-sm text-red-600">
          {errorCount} validation error{errorCount === 1 ? "" : "s"} — fix
          before generating.
        </p>
      ) : null}

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating || isPreparingPrint || errorCount > 0}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isGenerating ? "Generating…" : "Generate Preview"}
        </button>
        <button
          type="button"
          onClick={onPrint}
          disabled={!canPrint || isPreparingPrint}
          className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPreparingPrint ? "Preparing print…" : "Print Coupons"}
        </button>
        <button
          type="button"
          onClick={onClearAll}
          disabled={isPreparingPrint}
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
        >
          Clear All
        </button>
        <button
          type="button"
          onClick={onResetDefaults}
          disabled={isPreparingPrint}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Reset Demo Data
        </button>
      </div>
    </section>
  );
}

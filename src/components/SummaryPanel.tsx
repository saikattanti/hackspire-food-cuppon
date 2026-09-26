import type { MealSummary } from "@/lib/types";
import { COUPONS_PER_PAGE } from "@/lib/types";
import { getPageCount } from "@/lib/coupons";

interface SummaryPanelProps {
  summaries: MealSummary[];
  totalCoupons: number;
}

export default function SummaryPanel({
  summaries,
  totalCoupons,
}: SummaryPanelProps) {
  const pages = getPageCount(totalCoupons);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-bold tracking-wide text-slate-900 uppercase">
        Food Coupon Summary
      </h2>

      <div className="mt-3 space-y-3">
        {summaries.length === 0 ? (
          <p className="text-sm text-slate-500">No meals configured.</p>
        ) : (
          summaries.map(({ meal, vegCount, nonVegCount, total }) => (
            <div
              key={meal.id}
              className="border-b border-slate-100 pb-2 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-sm border border-black/10"
                  style={{ backgroundColor: meal.color }}
                  aria-hidden
                />
                <span className="font-semibold text-slate-800">{meal.name}</span>
              </div>
              {meal.type === "GENERAL" ? (
                <p className="mt-0.5 pl-5 text-sm text-slate-600">
                  {total} coupons
                </p>
              ) : (
                <div className="mt-0.5 space-y-0.5 pl-5 text-sm text-slate-600">
                  <p>Veg: {vegCount}</p>
                  <p>Non-Veg: {nonVegCount}</p>
                  <p className="font-medium text-slate-800">Total: {total}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-4 rounded-lg bg-slate-900 px-3 py-3 text-white">
        <p className="text-lg font-bold">TOTAL COUPONS: {totalCoupons}</p>
        <p className="mt-1 text-sm text-slate-300">
          {COUPONS_PER_PAGE} coupons/page · {pages} A4 page
          {pages === 1 ? "" : "s"}
        </p>
      </div>
    </section>
  );
}

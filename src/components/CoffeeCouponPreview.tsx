"use client";

import { useMemo, useState } from "react";
import type { GeneratedCoffeeCoupon } from "@/lib/types";
import { COFFEE_COUPONS_PER_PAGE } from "@/lib/types";
import { chunkIntoPages } from "@/lib/coupons";
import CoffeeCouponPage from "./CoffeeCouponPage";

interface CoffeeCouponPreviewProps {
  coupons: GeneratedCoffeeCoupon[];
  showSerial: boolean;
  generated: boolean;
  /** When true, mount the full print DOM (all pages). */
  mountPrintDom: boolean;
}

const INITIAL_VISIBLE_PAGES = 3;
const LOAD_MORE_PAGES = 6;

export default function CoffeeCouponPreview({
  coupons,
  showSerial,
  generated,
  mountPrintDom,
}: CoffeeCouponPreviewProps) {
  const pages = useMemo(
    () => chunkIntoPages(coupons, COFFEE_COUPONS_PER_PAGE),
    [coupons],
  );
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_PAGES);

  // Reset visible window when a new coupon set is generated
  const couponSetId = coupons.length > 0 ? `${coupons[0].id}:${coupons.length}` : "empty";
  const [lastSetId, setLastSetId] = useState(couponSetId);
  if (couponSetId !== lastSetId) {
    setLastSetId(couponSetId);
    setVisibleCount(INITIAL_VISIBLE_PAGES);
  }

  const screenPages = pages.slice(0, visibleCount);
  const hasMore = visibleCount < pages.length;

  if (!generated) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/50 px-6 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-3xl text-amber-800 shadow-sm">
          ☕
        </div>
        <h3 className="mt-4 text-lg font-bold text-slate-800">
          Coffee Coupon Preview Ready to Generate
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
          Set your required batch quantity and serial prefix on the left, then click{" "}
          <strong className="text-amber-900">Generate Preview</strong> to build A4
          print sheets (3 coupons per row · 21 per page · 3×7 grid).
        </p>
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 px-6 py-12 text-center">
        <p className="font-semibold text-amber-900">No coffee coupons to show</p>
        <p className="mt-1 text-sm text-amber-800">
          Please check your coupon quantity and settings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="no-print flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            Showing {Math.min(visibleCount, pages.length)} of {pages.length} A4
            pages ({coupons.length.toLocaleString()} coffee coupons ·{" "}
            {COFFEE_COUPONS_PER_PAGE}/page · 3/row)
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {hasMore ? (
            <button
              type="button"
              onClick={() =>
                setVisibleCount((c) =>
                  Math.min(c + LOAD_MORE_PAGES, pages.length),
                )
              }
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
            >
              Load more pages (+6)
            </button>
          ) : null}
          {pages.length > INITIAL_VISIBLE_PAGES &&
          visibleCount < pages.length ? (
            <button
              type="button"
              onClick={() => setVisibleCount(pages.length)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
            >
              Show all ({pages.length}) pages
            </button>
          ) : null}
          {visibleCount > INITIAL_VISIBLE_PAGES ? (
            <button
              type="button"
              onClick={() => setVisibleCount(INITIAL_VISIBLE_PAGES)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
            >
              Collapse preview
            </button>
          ) : null}
        </div>
      </div>

      <div className="no-print space-y-6">
        {screenPages.map((pageCoupons, index) => (
          <CoffeeCouponPage
            key={`coffee-screen-${index}`}
            pageNumber={index + 1}
            coupons={pageCoupons}
            showSerial={showSerial}
          />
        ))}
      </div>

      {mountPrintDom ? (
        <div className="print-only print-root" aria-hidden="true">
          {pages.map((pageCoupons, index) => (
            <CoffeeCouponPage
              key={`coffee-print-${index}`}
              pageNumber={index + 1}
              coupons={pageCoupons}
              showSerial={showSerial}
              showLabel={false}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

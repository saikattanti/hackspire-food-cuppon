"use client";

import { useMemo, useState } from "react";
import type { GeneratedCoupon } from "@/lib/types";
import { COUPONS_PER_PAGE } from "@/lib/types";
import { chunkIntoPages } from "@/lib/coupons";
import CouponPage from "./CouponPage";

interface CouponPreviewProps {
  coupons: GeneratedCoupon[];
  showSerial: boolean;
  generated: boolean;
  /** When true, mount the full print DOM (all pages). */
  mountPrintDom: boolean;
}

const INITIAL_VISIBLE_PAGES = 3;
const LOAD_MORE_PAGES = 6;

export default function CouponPreview({
  coupons,
  showSerial,
  generated,
  mountPrintDom,
}: CouponPreviewProps) {
  const pages = useMemo(() => chunkIntoPages(coupons), [coupons]);
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
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
        <p className="text-lg font-semibold text-slate-800">
          Preview not generated yet
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Configure meals, then click <strong>Generate Preview</strong> to
          build A4 coupon pages for printing.
        </p>
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 px-6 py-12 text-center">
        <p className="font-semibold text-amber-900">No coupons to show</p>
        <p className="mt-1 text-sm text-amber-800">
          Fix validation errors and set quantities above zero.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="no-print flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
        <span>
          Showing {Math.min(visibleCount, pages.length)} of {pages.length} A4
          pages ({coupons.length.toLocaleString()} coupons · {COUPONS_PER_PAGE}
          /page)
        </span>
        <div className="flex flex-wrap gap-2">
          {hasMore ? (
            <button
              type="button"
              onClick={() =>
                setVisibleCount((c) =>
                  Math.min(c + LOAD_MORE_PAGES, pages.length),
                )
              }
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Load more pages
            </button>
          ) : null}
          {pages.length > INITIAL_VISIBLE_PAGES &&
          visibleCount < pages.length ? (
            <button
              type="button"
              onClick={() => setVisibleCount(pages.length)}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Show all pages
            </button>
          ) : null}
          {visibleCount > INITIAL_VISIBLE_PAGES ? (
            <button
              type="button"
              onClick={() => setVisibleCount(INITIAL_VISIBLE_PAGES)}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Collapse preview
            </button>
          ) : null}
        </div>
      </div>

      <div className="no-print space-y-6">
        {screenPages.map((pageCoupons, index) => (
          <CouponPage
            key={`screen-${index}`}
            pageNumber={index + 1}
            coupons={pageCoupons}
            showSerial={showSerial}
          />
        ))}
      </div>

      {mountPrintDom ? (
        <div className="print-only print-root" aria-hidden="true">
          {pages.map((pageCoupons, index) => (
            <CouponPage
              key={`print-${index}`}
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

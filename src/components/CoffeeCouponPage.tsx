import type { GeneratedCoffeeCoupon } from "@/lib/types";
import CoffeeCoupon from "./CoffeeCoupon";

interface CoffeeCouponPageProps {
  pageNumber: number;
  coupons: GeneratedCoffeeCoupon[];
  showSerial: boolean;
  /** Screen-only label above the page */
  showLabel?: boolean;
}

export default function CoffeeCouponPage({
  pageNumber,
  coupons,
  showSerial,
  showLabel = true,
}: CoffeeCouponPageProps) {
  return (
    <div className="coupon-page-wrap">
      {showLabel ? (
        <div className="coupon-page-label no-print">
          A4 Page {pageNumber} · Coffee Coupons (3×7 Rectangular Grid · 21/Page)
        </div>
      ) : null}
      <div className="coupon-page a4-page">
        <div className="coffee-grid">
          {coupons.map((coupon) => (
            <CoffeeCoupon
              key={coupon.id}
              coupon={coupon}
              showSerial={showSerial}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

import type { GeneratedCoupon } from "@/lib/types";
import Coupon from "./Coupon";

interface CouponPageProps {
  pageNumber: number;
  coupons: GeneratedCoupon[];
  showSerial: boolean;
  /** Screen-only label above the page */
  showLabel?: boolean;
}

export default function CouponPage({
  pageNumber,
  coupons,
  showSerial,
  showLabel = true,
}: CouponPageProps) {
  return (
    <div className="coupon-page-wrap">
      {showLabel ? (
        <div className="coupon-page-label no-print">A4 Page {pageNumber}</div>
      ) : null}
      <div className="coupon-page a4-page">
        <div className="coupon-grid">
          {coupons.map((coupon) => (
            <Coupon key={coupon.id} coupon={coupon} showSerial={showSerial} />
          ))}
        </div>
      </div>
    </div>
  );
}

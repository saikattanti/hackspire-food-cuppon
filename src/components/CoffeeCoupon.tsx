import type { GeneratedCoffeeCoupon } from "@/lib/types";
import { getContrastingTextColor } from "@/lib/coupons";

interface CoffeeCouponProps {
  coupon: GeneratedCoffeeCoupon;
  showSerial: boolean;
}

export default function CoffeeCoupon({ coupon, showSerial }: CoffeeCouponProps) {
  const textColor = getContrastingTextColor(coupon.color);
  const isDark = textColor === "#FFFFFF";

  return (
    <div
      className="coupon coffee-coupon"
      style={{
        backgroundColor: coupon.color,
        color: textColor,
        borderColor: isDark ? "rgba(255, 255, 255, 0.28)" : "rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* Top Header: Left = HackSpire Logo, Right = ACM Logo */}
      <div className="coffee-header">
        <div className="flex items-center justify-between w-full px-0.5">
          {/* Left: HackSpire Logo */}
          <div className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hackspire-logo.png"
              alt="HackSpire Logo"
              className="coffee-hackspire-logo"
              style={{
                filter: isDark ? "brightness(0) invert(1)" : "none",
              }}
            />
          </div>

          {/* Right: ACM Logo */}
          <div className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/fiem-acm-logo.png"
              alt="FIEM ACM Logo"
              className="coffee-acm-logo"
            />
          </div>
        </div>
      </div>

      {/* Main Title Section — Clean, Professional, Minimal */}
      <div className="coffee-body">
        {coupon.brandingType === "NAME" && coupon.eventTitle?.trim() ? (
          <span className="coffee-event-title">{coupon.eventTitle}</span>
        ) : coupon.brandingType === "LOGO" && coupon.customLogoUrl ? (
          <div className="coffee-center-logo-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coupon.customLogoUrl}
              alt="Event Logo"
              className="coffee-center-logo"
              style={{
                filter:
                  isDark && coupon.customLogoUrl.includes("logo")
                    ? "brightness(0) invert(1)"
                    : "none",
              }}
            />
          </div>
        ) : null}

        <h3 className="coffee-title">COFFEE COUPON</h3>

        <div
          className="coffee-subtitle-pill"
          style={{
            backgroundColor: isDark
              ? "rgba(255, 255, 255, 0.12)"
              : "rgba(0, 0, 0, 0.05)",
            borderColor: isDark
              ? "rgba(255, 255, 255, 0.25)"
              : "rgba(0, 0, 0, 0.15)",
          }}
        >
          {coupon.subtitle || "VALID FOR 1 COFFEE"}
        </div>
      </div>

      {/* Footer Section: Serial Number & Vendor Stamp Box */}
      <div className="coffee-footer">
        <div className="coffee-serial-col">
          {showSerial ? (
            <div className="coffee-serial-box">
              <span className="coffee-serial-label">SERIAL NO.</span>
              <span className="coffee-serial-val">{coupon.serial}</span>
            </div>
          ) : (
            <div className="coffee-official-text">OFFICIAL EVENT PASS</div>
          )}
          <div className="coffee-micro-note">{coupon.notes}</div>
        </div>

        {/* Vendor Stamp / Verification Box */}
        <div
          className="coffee-stamp-box"
          style={{
            borderColor: isDark
              ? "rgba(255, 255, 255, 0.35)"
              : "rgba(0, 0, 0, 0.22)",
            backgroundColor: isDark
              ? "rgba(255, 255, 255, 0.04)"
              : "rgba(0, 0, 0, 0.02)",
          }}
        >
          <span className="coffee-stamp-title">VENDOR STAMP</span>
        </div>
      </div>
    </div>
  );
}

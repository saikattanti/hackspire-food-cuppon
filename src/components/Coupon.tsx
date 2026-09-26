import type { GeneratedCoupon } from "@/lib/types";
import { getContrastingTextColor } from "@/lib/coupons";

interface CouponProps {
  coupon: GeneratedCoupon;
  showSerial: boolean;
}

function dietLabel(diet: GeneratedCoupon["diet"]): {
  text: string;
  icon: string;
} {
  if (diet === "VEG") return { text: "VEG", icon: "🥬" };
  if (diet === "NON_VEG") return { text: "NON-VEG", icon: "🍗" };
  return { text: "GENERAL", icon: "" };
}

export default function Coupon({ coupon, showSerial }: CouponProps) {
  const textColor = getContrastingTextColor(coupon.color);
  const diet = dietLabel(coupon.diet);

  return (
    <div
      className="coupon"
      style={{
        backgroundColor: coupon.color,
        color: textColor,
        borderColor: textColor === "#FFFFFF" ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.25)",
      }}
    >
      <div className="coupon-brand">HACKSPIRE&apos;26</div>
      <div className="coupon-meal">{coupon.mealName.toUpperCase()}</div>
      {coupon.subtitle.trim() ? (
        <div className="coupon-subtitle">{coupon.subtitle}</div>
      ) : null}
      <div className="coupon-diet">
        {diet.icon ? <span className="coupon-diet-icon">{diet.icon}</span> : null}
        <span className="coupon-diet-text">{diet.text}</span>
      </div>
      {coupon.time.trim() ? (
        <div className="coupon-time">{coupon.time}</div>
      ) : null}
      {showSerial ? (
        <div className="coupon-serial">{coupon.serial}</div>
      ) : null}
    </div>
  );
}

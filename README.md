# HackSpire'26 Food & Coffee Coupon Generator

Simple, client-side web app for generating printable **A4 food and coffee coupons** for HackSpire'26.

**Workflow:** select mode (☕ Coffee or 🍽️ Meals) → configure parameters → generate preview → print (or Save as PDF) → cut → distribute.

No login, no database, no external APIs, no backend.

---

## Modes

### 1. ☕ Coffee Coupons Mode
- Generate standalone coffee coupons with sequential, unique serial numbers (`COF-001`, `COF-002`, …).
- Features official **HackSpire'26 logo**, `☕ COFFEE COUPON` header, `VALID FOR 1 COFFEE` badge, verification/vendor stamp box, and event micro-terms.
- Configurable batch quantity, custom serial prefixes, starting serial number, and custom/preset theme colors (Warm Roast, Dark Espresso, Caramel Amber, Slate Mocha, Cyber Black, Ink Saver White).
- Independent storage and configuration from meal coupons.

### 2. 🍽️ Meal Coupons Mode
- Multiple meals with **General** or **Veg / Non-Veg** diet breakdowns.
- Color-coded coupons for quick visual identification at food counters.
- Unique serial numbers per meal/diet type (`ES-001`, `D-V-001`, `D-NV-001`, …).
- Live meal breakdown summary (totals, veg/non-veg counts, pages).

---

## Features

- **A4 Portrait Print Layout:** Exact 3×4 grid (**12 coupons per page**).
- **DOM & Print Synchronization:** Uses `requestAnimationFrame` polling to ensure all coupons are mounted in the DOM before opening the print dialog.
- **Client-Side Persistence:** Configuration safely saved in browser `localStorage`.
- **Zero Backend:** Runs entirely offline in the browser.

---

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3456](http://localhost:3456) (or the port shown in the terminal).

---

## Print Tips

1. Select **☕ Coffee Coupons** or **🍽️ Meal Coupons** mode.
2. Click **Generate Preview**.
3. Click **Print Coupons**.
4. In the browser print dialog:
   - Paper: **A4**
   - Orientation: **Portrait**
   - Margins: **Default** (the app sets print margins via CSS)
   - Enable **Background graphics** / color printing
5. Print, or choose **Save as PDF**.

---

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Browser `window.print()` + A4 print CSS

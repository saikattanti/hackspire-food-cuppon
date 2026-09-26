# HackSpire'26 Food Coupon Generator

Simple, client-side web app for generating printable **A4 food coupons** for HackSpire'26.

**Workflow:** configure meals → generate preview → print (or Save as PDF) → cut → distribute.

No login, no database, no QR codes, no backend.

## Features

- Multiple meals with **General** or **Veg / Non-Veg** types
- Color-coded coupons (meal color identifies the meal)
- Optional unique serial numbers (`ES-001`, `D-V-001`, `D-NV-001`, …)
- A4 portrait print layout: **3×4 = 12 coupons per page**
- Live summary (totals, pages)
- Configuration saved in `localStorage`

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3456](http://localhost:3456) (or the port shown in the terminal).

## Print tips

1. Click **Generate Preview**
2. Click **Print Coupons**
3. In the browser print dialog:
   - Paper: **A4**
   - Orientation: **Portrait**
   - Margins: **Default** (the app sets print margins via CSS)
   - Enable **Background graphics** / color printing
4. Print, or choose **Save as PDF**

## Default demo meals

Evening Snacks, Dinner, Midnight Snacks, Breakfast, and Lunch are pre-loaded. Use **Reset Demo Data** to restore them.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Browser `window.print()` + A4 print CSS

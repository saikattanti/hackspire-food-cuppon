"use client";

import type { Meal, MealValidationError } from "@/lib/types";
import { PRESET_COLORS, suggestSerialPrefix } from "@/lib/defaults";

interface MealCardProps {
  meal: Meal;
  index: number;
  total: number;
  errors: MealValidationError[];
  onChange: (meal: Meal) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function fieldErrors(
  errors: MealValidationError[],
  field: string,
): string | undefined {
  return errors.find((e) => e.field === field)?.message;
}

export default function MealCard({
  meal,
  index,
  total,
  errors,
  onChange,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: MealCardProps) {
  const update = <K extends keyof Meal>(key: K, value: Meal[K]) => {
    const next = { ...meal, [key]: value };
    if (key === "name" && typeof value === "string") {
      // Only auto-update prefix if it still matches the previous suggestion
      const prevSuggested = suggestSerialPrefix(meal.name);
      if (meal.serialPrefix === prevSuggested || !meal.serialPrefix) {
        next.serialPrefix = suggestSerialPrefix(value);
      }
    }
    onChange(next);
  };

  const setQuantity = (
    raw: string,
    key: "quantity" | "vegQuantity" | "nonVegQuantity",
  ) => {
    // Allow clearing while typing; reject decimals / negatives / non-numeric
    if (raw.trim() === "") {
      update(key, 0 as Meal[typeof key]);
      return;
    }
    if (!/^\d+$/.test(raw.trim())) return;
    update(key, Number.parseInt(raw.trim(), 10) as Meal[typeof key]);
  };

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="h-4 w-4 rounded-sm border border-black/10"
            style={{ backgroundColor: meal.color }}
          />
          <h3 className="font-semibold text-slate-900">
            Meal {index + 1}
            {meal.name.trim() ? (
              <span className="font-normal text-slate-500">
                {" "}
                · {meal.name}
              </span>
            ) : null}
          </h3>
        </div>
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="rounded border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            title="Move up"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="rounded border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            title="Move down"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={onDuplicate}
            className="rounded border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Duplicate
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">
            Meal Name
          </span>
          <input
            type="text"
            value={meal.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            placeholder="e.g. Dinner"
          />
          {fieldErrors(errors, "name") ? (
            <span className="mt-1 block text-xs text-red-600">
              {fieldErrors(errors, "name")}
            </span>
          ) : null}
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">
            Meal Type
          </span>
          <select
            value={meal.type}
            onChange={(e) =>
              update("type", e.target.value as Meal["type"])
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          >
            <option value="GENERAL">General</option>
            <option value="VEG_NONVEG">Veg / Non-Veg</option>
          </select>
        </label>

        {meal.type === "GENERAL" ? (
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">
              Quantity
            </span>
            <input
              type="number"
              min={0}
              step={1}
              inputMode="numeric"
              value={meal.quantity}
              onChange={(e) => setQuantity(e.target.value, "quantity")}
              onFocus={(e) => e.currentTarget.select()}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
            {fieldErrors(errors, "quantity") ? (
              <span className="mt-1 block text-xs text-red-600">
                {fieldErrors(errors, "quantity")}
              </span>
            ) : null}
          </label>
        ) : (
          <>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">
                Veg Quantity
              </span>
              <input
                type="number"
                min={0}
                step={1}
                inputMode="numeric"
                value={meal.vegQuantity}
                onChange={(e) => setQuantity(e.target.value, "vegQuantity")}
                onFocus={(e) => e.currentTarget.select()}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
              {fieldErrors(errors, "vegQuantity") ? (
                <span className="mt-1 block text-xs text-red-600">
                  {fieldErrors(errors, "vegQuantity")}
                </span>
              ) : null}
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">
                Non-Veg Quantity
              </span>
              <input
                type="number"
                min={0}
                step={1}
                inputMode="numeric"
                value={meal.nonVegQuantity}
                onChange={(e) =>
                  setQuantity(e.target.value, "nonVegQuantity")
                }
                onFocus={(e) => e.currentTarget.select()}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
              {fieldErrors(errors, "nonVegQuantity") ? (
                <span className="mt-1 block text-xs text-red-600">
                  {fieldErrors(errors, "nonVegQuantity")}
                </span>
              ) : null}
            </label>
          </>
        )}

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Color</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={meal.color}
              onChange={(e) => update("color", e.target.value)}
              className="h-10 w-12 cursor-pointer rounded border border-slate-300 bg-white p-1"
            />
            <select
              value={
                PRESET_COLORS.some((c) => c.value === meal.color)
                  ? meal.color
                  : ""
              }
              onChange={(e) => {
                if (e.target.value) update("color", e.target.value);
              }}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            >
              <option value="">Custom / presets…</option>
              {PRESET_COLORS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">
            Serial Prefix
          </span>
          <input
            type="text"
            value={meal.serialPrefix}
            onChange={(e) =>
              update("serialPrefix", e.target.value.toUpperCase())
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm outline-none focus:border-slate-500"
            placeholder="ES"
            maxLength={6}
          />
          {fieldErrors(errors, "serialPrefix") ? (
            <span className="mt-1 block text-xs text-red-600">
              {fieldErrors(errors, "serialPrefix")}
            </span>
          ) : (
            <span className="mt-1 block text-xs text-slate-400">
              e.g. ES-001 or D-V-001
            </span>
          )}
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">
            Time <span className="font-normal text-slate-400">(optional)</span>
          </span>
          <input
            type="text"
            value={meal.time}
            onChange={(e) => update("time", e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            placeholder="8:30 PM – 10:00 PM"
          />
        </label>

        <label className="block text-sm sm:col-span-2">
          <span className="mb-1 block font-medium text-slate-700">
            Subtitle{" "}
            <span className="font-normal text-slate-400">(optional)</span>
          </span>
          <input
            type="text"
            value={meal.subtitle}
            onChange={(e) => update("subtitle", e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            placeholder="Optional line under meal name"
          />
        </label>
      </div>

      {errors.filter((e) => !e.field).map((e, i) => (
        <p key={i} className="mt-2 text-xs text-red-600">
          {e.message}
        </p>
      ))}
    </article>
  );
}

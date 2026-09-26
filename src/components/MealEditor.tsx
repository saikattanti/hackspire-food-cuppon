"use client";

import type { Meal, MealValidationError } from "@/lib/types";
import { createEmptyMeal, createId } from "@/lib/defaults";
import MealCard from "./MealCard";

interface MealEditorProps {
  meals: Meal[];
  errors: MealValidationError[];
  onChange: (meals: Meal[]) => void;
}

export default function MealEditor({
  meals,
  errors,
  onChange,
}: MealEditorProps) {
  const errorsFor = (id: string) => errors.filter((e) => e.mealId === id);

  const updateMeal = (index: number, meal: Meal) => {
    const next = [...meals];
    next[index] = meal;
    onChange(next);
  };

  const duplicateMeal = (index: number) => {
    const source = meals[index];
    const copy: Meal = {
      ...source,
      id: createId(),
      name: `${source.name} Copy`,
    };
    const next = [...meals];
    next.splice(index + 1, 0, copy);
    onChange(next);
  };

  const deleteMeal = (index: number) => {
    onChange(meals.filter((_, i) => i !== index));
  };

  const moveMeal = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= meals.length) return;
    const next = [...meals];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    onChange(next);
  };

  const addMeal = () => {
    onChange([...meals, createEmptyMeal()]);
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold tracking-wide text-slate-900 uppercase">
          Meal Configuration
        </h2>
        <button
          type="button"
          onClick={addMeal}
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          + Add Meal
        </button>
      </div>

      {meals.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
          No meals yet. Click <strong>+ Add Meal</strong> or{" "}
          <strong>Reset Demo Data</strong>.
        </div>
      ) : (
        meals.map((meal, index) => (
          <MealCard
            key={meal.id}
            meal={meal}
            index={index}
            total={meals.length}
            errors={errorsFor(meal.id)}
            onChange={(m) => updateMeal(index, m)}
            onDuplicate={() => duplicateMeal(index)}
            onDelete={() => deleteMeal(index)}
            onMoveUp={() => moveMeal(index, -1)}
            onMoveDown={() => moveMeal(index, 1)}
          />
        ))
      )}
    </section>
  );
}

import type { Meal, MealValidationError } from "./types";

export function validateMeal(meal: Meal): MealValidationError[] {
  const errors: MealValidationError[] = [];

  if (!meal.name.trim()) {
    errors.push({
      mealId: meal.id,
      field: "name",
      message: "Meal name is required.",
    });
  }

  if (!meal.serialPrefix.trim()) {
    errors.push({
      mealId: meal.id,
      field: "serialPrefix",
      message: "Serial prefix is required.",
    });
  }

  if (meal.type === "GENERAL") {
    if (!Number.isInteger(meal.quantity)) {
      errors.push({
        mealId: meal.id,
        field: "quantity",
        message: "Quantity must be a whole number.",
      });
    } else if (meal.quantity < 0) {
      errors.push({
        mealId: meal.id,
        field: "quantity",
        message: "Quantity cannot be negative.",
      });
    } else if (meal.quantity === 0) {
      errors.push({
        mealId: meal.id,
        field: "quantity",
        message: "Quantity must be greater than zero.",
      });
    }
  } else {
    if (!Number.isInteger(meal.vegQuantity)) {
      errors.push({
        mealId: meal.id,
        field: "vegQuantity",
        message: "Veg quantity must be a whole number.",
      });
    } else if (meal.vegQuantity < 0) {
      errors.push({
        mealId: meal.id,
        field: "vegQuantity",
        message: "Veg quantity cannot be negative.",
      });
    }

    if (!Number.isInteger(meal.nonVegQuantity)) {
      errors.push({
        mealId: meal.id,
        field: "nonVegQuantity",
        message: "Non-Veg quantity must be a whole number.",
      });
    } else if (meal.nonVegQuantity < 0) {
      errors.push({
        mealId: meal.id,
        field: "nonVegQuantity",
        message: "Non-Veg quantity cannot be negative.",
      });
    }

    const vegOk = Number.isInteger(meal.vegQuantity) && meal.vegQuantity >= 0;
    const nonVegOk =
      Number.isInteger(meal.nonVegQuantity) && meal.nonVegQuantity >= 0;

    if (vegOk && nonVegOk && meal.vegQuantity + meal.nonVegQuantity === 0) {
      errors.push({
        mealId: meal.id,
        field: "vegQuantity",
        message: "Veg + Non-Veg must be greater than zero.",
      });
    }
  }

  return errors;
}

export function validateMeals(meals: Meal[]): MealValidationError[] {
  if (meals.length === 0) {
    return [
      {
        mealId: "",
        message: "Add at least one meal before generating coupons.",
      },
    ];
  }
  return meals.flatMap(validateMeal);
}

export function parsePositiveInt(raw: string): number | null {
  if (raw.trim() === "") return null;
  if (!/^\d+$/.test(raw.trim())) return null;
  return Number.parseInt(raw.trim(), 10);
}

import type { DishSlug } from "@/lib/schema/recipe";

/** docs/SPEC.md § 4.2 dish colour mapping. */
export const DISH_TONE: Record<DishSlug, "lotus" | "cardamom" | "saffron" | "almond" | "chilli"> = {
  "rogan-josh": "chilli",
  "mutton-yakhni": "almond",
  "dum-aaloo": "saffron",
  "nadru-yakhni": "lotus",
  "nadur-monje": "saffron",
  kehwa: "cardamom",
  "kong-phirin": "saffron",
};

export const PHOTO_SLOT: Record<DishSlug, string> = {
  "rogan-josh": "DISH-ROGAN",
  "mutton-yakhni": "DISH-MYAKHNI",
  "dum-aaloo": "DISH-DUMAALOO",
  "nadru-yakhni": "DISH-NADRUYAKHNI",
  "nadur-monje": "DISH-NADURMONJE",
  kehwa: "DISH-KEHWA",
  "kong-phirin": "DISH-KONGPHIRIN",
};

/** Meal order per docs/SPEC.md § 5.1 menu structure. */
export const MEAL_ORDER: DishSlug[] = [
  "kehwa",
  "nadur-monje",
  "rogan-josh",
  "mutton-yakhni",
  "dum-aaloo",
  "nadru-yakhni",
  "kong-phirin",
];

import type { DishSlug } from "@/lib/schema/recipe";

type DishMeta = {
  name: string;
  course: "starter" | "main" | "dessert";
  isVeg: boolean;
};

/**
 * Known, fixed facts from docs/SPEC.md § 2 — never guessed by the LLM.
 */
export const DISH_METADATA: Record<DishSlug, DishMeta> = {
  "nadur-monje": {
    name: "Nadur Monje (Lotus Stem Fritters)",
    course: "starter",
    isVeg: true,
  },
  kehwa: { name: "Kehwa", course: "starter", isVeg: true },
  "rogan-josh": { name: "Rogan Josh", course: "main", isVeg: false },
  "mutton-yakhni": { name: "Mutton Yakhni", course: "main", isVeg: false },
  "dum-aaloo": {
    name: "Kashmiri Dum Aaloo",
    course: "main",
    isVeg: true,
  },
  "nadru-yakhni": {
    name: "Nadru Yakhni (Lotus Stem Curry)",
    course: "main",
    isVeg: true,
  },
  "kong-phirin": { name: "Kong Phirin", course: "dessert", isVeg: true },
};

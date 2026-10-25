import { z } from "zod";

/** Every extracted field must carry the exact source sentence(s) it came from. */
export const SourceRef = z.object({
  sourceText: z.string(),
});

export const Ingredient = z
  .object({
    id: z.string(),
    name: z.string(),
    localName: z.string().optional(),
    quantity: z.string().nullable(),
    prep: z.string().optional(),
    group: z.string().optional(),
    alternatives: z.array(z.string()).default([]),
    purpose: z.string().optional(),
  })
  .merge(SourceRef);
export type Ingredient = z.infer<typeof Ingredient>;

export const InteractionType = z.enum([
  "heat_hold",
  "cool_wait",
  "drop_in",
  "crush_then_drop",
  "timed_add",
  "stir",
  "stir_high_heat",
  "heat_dial",
  "sprinkle_stir",
  "slow_pour_with_stir",
  "pour_water",
  "cover_simmer",
  "pressure_whistles",
  "gentle_stir",
  "rest",
  "plate",
  "deep_fry",
  "pierce",
  "batter_dip",
  "steep",
  "strain",
  "none",
]);
export type InteractionType = z.infer<typeof InteractionType>;

export const Step = z
  .object({
    id: z.string(),
    order: z.number(),
    phase: z.string(),
    action: z.string(),
    ingredientIds: z.array(z.string()),
    heat: z.enum([
      "off",
      "low",
      "medium-low",
      "medium",
      "high",
      "lowered",
      "unspecified",
    ]),
    duration: z.string().nullable(),
    sensoryCue: z.string().nullable(),
    warning: z.string().nullable(),
    interaction: InteractionType,
    branch: z.string().optional(),
  })
  .merge(SourceRef);
export type Step = z.infer<typeof Step>;

export const Variant = z
  .object({
    name: z.string(),
    replacesStepIds: z.array(z.string()),
    steps: z.array(Step),
  })
  .merge(SourceRef);
export type Variant = z.infer<typeof Variant>;

export const RecipeFlag = z.object({
  type: z.string(),
  message: z.string(),
});
export type RecipeFlag = z.infer<typeof RecipeFlag>;

export const Recipe = z.object({
  slug: z.string(),
  name: z.string(),
  course: z.enum(["starter", "main", "dessert"]),
  isVeg: z.boolean(),
  description: z.string(),
  ingredients: z.array(Ingredient),
  steps: z.array(Step),
  variants: z.array(Variant).default([]),
  servingNote: z.string().nullable(),
  flags: z.array(RecipeFlag).default([]),
  status: z.enum(["extracted", "in_review", "approved"]),
});
export type Recipe = z.infer<typeof Recipe>;

/**
 * What the LLM is asked to return for one recipe block. Validators and the
 * review screen add `status` and promote `flags` after the fact, so the
 * model only needs to produce the facts plus its own ambiguity flags.
 */
export const ExtractedRecipe = Recipe.omit({ status: true });
export type ExtractedRecipe = z.infer<typeof ExtractedRecipe>;

/**
 * What the LLM actually produces: slug/name/course/isVeg are known,
 * fixed facts (see pipeline/dishMeta.ts) and are merged in afterwards
 * rather than left for the model to guess.
 */
export const ExtractedRecipeBody = ExtractedRecipe.omit({
  slug: true,
  name: true,
  course: true,
  isVeg: true,
});
export type ExtractedRecipeBody = z.infer<typeof ExtractedRecipeBody>;

export const DISH_SLUGS = [
  "nadur-monje",
  "kehwa",
  "rogan-josh",
  "mutton-yakhni",
  "dum-aaloo",
  "nadru-yakhni",
  "kong-phirin",
] as const;
export type DishSlug = (typeof DISH_SLUGS)[number];

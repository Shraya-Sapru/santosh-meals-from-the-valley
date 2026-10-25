import { describe, it, expect } from "vitest";
import {
  checkForbiddenIngredients,
  checkDishSpecificRules,
  checkSourceMatch,
  checkOrphanIngredientRefs,
  checkStepOrder,
} from "./validators";
import type { ExtractedRecipe } from "@/lib/schema/recipe";

function baseRecipe(overrides: Partial<ExtractedRecipe> = {}): ExtractedRecipe {
  const defaults: ExtractedRecipe = {
    slug: "rogan-josh",
    name: "Rogan Josh",
    course: "main",
    isVeg: false,
    description: "A rich curry.",
    ingredients: [
      {
        id: "mutton",
        name: "Mutton",
        quantity: "1 Kg",
        alternatives: [],
        sourceText: "Mutton: 1 Kg",
      },
    ],
    steps: [
      {
        id: "step-1",
        order: 1,
        phase: "Cooking",
        action: "Sear the mutton.",
        ingredientIds: ["mutton"],
        heat: "high",
        duration: null,
        sensoryCue: null,
        warning: null,
        interaction: "stir_high_heat",
        sourceText: "Sear the mutton.",
      },
    ],
    variants: [],
    servingNote: null,
    flags: [],
  };
  return { ...defaults, ...overrides };
}

describe("checkForbiddenIngredients", () => {
  it("passes a clean recipe", () => {
    expect(checkForbiddenIngredients(baseRecipe())).toEqual([]);
  });

  it("flags onion in an ingredient name", () => {
    const recipe = baseRecipe({
      ingredients: [
        {
          id: "onion",
          name: "Onion",
          quantity: "1",
          alternatives: [],
          sourceText: "Onion: 1",
        },
      ],
    });
    const flags = checkForbiddenIngredients(recipe);
    expect(flags.some((f) => f.type === "forbidden-ingredient")).toBe(true);
  });

  it("flags garlic even when mentioned only in a step warning", () => {
    const recipe = baseRecipe({
      steps: [
        {
          id: "step-1",
          order: 1,
          phase: "Cooking",
          action: "Add spices.",
          ingredientIds: [],
          heat: "medium",
          duration: null,
          sensoryCue: null,
          warning: "Do not confuse with garlic paste.",
          interaction: "stir",
          sourceText: "Add spices.",
        },
      ],
    });
    const flags = checkForbiddenIngredients(recipe);
    expect(flags.some((f) => f.type === "forbidden-ingredient")).toBe(true);
  });

  it("does not false-positive on substrings (e.g. 'tomatoey')", () => {
    const recipe = baseRecipe({ description: "Not a tomatoey dish at all." });
    expect(checkForbiddenIngredients(recipe)).toEqual([]);
  });
});

describe("checkDishSpecificRules (Mutton Yakhni)", () => {
  it("passes when neither turmeric nor red chilli is present", () => {
    const recipe = baseRecipe({ slug: "mutton-yakhni" });
    expect(checkDishSpecificRules(recipe)).toEqual([]);
  });

  it("flags turmeric in Mutton Yakhni", () => {
    const recipe = baseRecipe({
      slug: "mutton-yakhni",
      ingredients: [
        {
          id: "turmeric",
          name: "Turmeric powder",
          quantity: "1 tsp",
          alternatives: [],
          sourceText: "Turmeric powder: 1 tsp",
        },
      ],
    });
    const flags = checkDishSpecificRules(recipe);
    expect(flags.some((f) => f.type === "dish-rule")).toBe(true);
  });

  it("flags red chilli in Mutton Yakhni", () => {
    const recipe = baseRecipe({
      slug: "mutton-yakhni",
      ingredients: [
        {
          id: "chilli",
          name: "Red chilli powder",
          quantity: "1 tsp",
          alternatives: [],
          sourceText: "Red chilli powder: 1 tsp",
        },
      ],
    });
    const flags = checkDishSpecificRules(recipe);
    expect(flags.some((f) => f.type === "dish-rule")).toBe(true);
  });

  it("does not apply the rule to other dishes", () => {
    const recipe = baseRecipe({
      slug: "rogan-josh",
      ingredients: [
        {
          id: "chilli",
          name: "Red chilli powder",
          quantity: "4 tsp",
          alternatives: [],
          sourceText: "Red chilli powder: 4 tsp",
        },
      ],
    });
    expect(checkDishSpecificRules(recipe)).toEqual([]);
  });
});

describe("checkSourceMatch", () => {
  const block = "Mutton: 1 Kg\n\nSear the mutton.\n\nServe hot.";

  it("passes when sourceText is an exact quote", () => {
    expect(checkSourceMatch(baseRecipe(), block)).toEqual([]);
  });

  it("flags a sourceText that isn't in the block", () => {
    const recipe = baseRecipe({
      ingredients: [
        {
          id: "mutton",
          name: "Mutton",
          quantity: "1 Kg",
          alternatives: [],
          sourceText: "Mutton: 2 Kg",
        },
      ],
    });
    const flags = checkSourceMatch(recipe, block);
    expect(flags.some((f) => f.type === "source-mismatch")).toBe(true);
  });

  it("checks each newline-joined fragment independently (prose-style sources)", () => {
    const recipe = baseRecipe({
      ingredients: [
        {
          id: "mutton",
          name: "Mutton",
          quantity: "1 Kg",
          alternatives: [],
          sourceText: "Mutton: 1 Kg\nSear the mutton.",
        },
      ],
    });
    // Both fragments exist in the block, just not contiguously.
    expect(checkSourceMatch(recipe, block)).toEqual([]);
  });
});

describe("checkOrphanIngredientRefs", () => {
  it("passes when all step ingredient ids are known", () => {
    expect(checkOrphanIngredientRefs(baseRecipe())).toEqual([]);
  });

  it("flags a step referencing an unknown ingredient id", () => {
    const recipe = baseRecipe({
      steps: [
        {
          id: "step-1",
          order: 1,
          phase: "Cooking",
          action: "Add yoghurt.",
          ingredientIds: ["yoghurt"],
          heat: "medium",
          duration: null,
          sensoryCue: null,
          warning: null,
          interaction: "stir",
          sourceText: "Add yoghurt.",
        },
      ],
    });
    const flags = checkOrphanIngredientRefs(recipe);
    expect(flags.some((f) => f.type === "orphan-ingredient-ref")).toBe(true);
  });
});

describe("checkStepOrder", () => {
  it("passes steps in increasing order", () => {
    expect(checkStepOrder(baseRecipe())).toEqual([]);
  });

  it("flags out-of-sequence mainline steps", () => {
    const recipe = baseRecipe({
      steps: [
        {
          id: "step-2",
          order: 2,
          phase: "Cooking",
          action: "Second.",
          ingredientIds: [],
          heat: "medium",
          duration: null,
          sensoryCue: null,
          warning: null,
          interaction: "stir",
          sourceText: "Second.",
        },
        {
          id: "step-1",
          order: 1,
          phase: "Cooking",
          action: "First.",
          ingredientIds: [],
          heat: "medium",
          duration: null,
          sensoryCue: null,
          warning: null,
          interaction: "stir",
          sourceText: "First.",
        },
      ],
    });
    const flags = checkStepOrder(recipe);
    expect(flags.some((f) => f.type === "step-order")).toBe(true);
  });

  it("ignores order within a parallel branch", () => {
    const recipe = baseRecipe({
      steps: [
        {
          id: "step-1",
          order: 1,
          phase: "Cooking",
          action: "Main step.",
          ingredientIds: [],
          heat: "medium",
          duration: null,
          sensoryCue: null,
          warning: null,
          interaction: "stir",
          sourceText: "Main step.",
        },
        {
          id: "branch-1",
          order: 1,
          phase: "Gravy",
          action: "Branch step.",
          ingredientIds: [],
          heat: "medium",
          duration: null,
          sensoryCue: null,
          warning: null,
          interaction: "stir",
          branch: "gravy",
          sourceText: "Branch step.",
        },
      ],
    });
    expect(checkStepOrder(recipe)).toEqual([]);
  });
});

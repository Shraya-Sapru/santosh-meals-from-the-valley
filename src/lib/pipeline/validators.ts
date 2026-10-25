import type { ExtractedRecipe, RecipeFlag } from "@/lib/schema/recipe";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/[^a-z0-9']+/g, " ")
    .trim();
}

const FORBIDDEN_INGREDIENTS = ["onion", "garlic", "tomato"];

/** Hard rule: these three ingredients must never appear anywhere in a recipe. */
export function checkForbiddenIngredients(recipe: ExtractedRecipe): RecipeFlag[] {
  const flags: RecipeFlag[] = [];
  const haystacks: Array<{ where: string; text: string }> = [
    { where: "description", text: recipe.description },
    ...recipe.ingredients.map((i) => ({
      where: `ingredient "${i.name}"`,
      text: [i.name, i.localName, i.prep, i.purpose, ...i.alternatives]
        .filter(Boolean)
        .join(" "),
    })),
    ...recipe.steps.map((s) => ({
      where: `step "${s.action}"`,
      text: [s.action, s.sensoryCue, s.warning].filter(Boolean).join(" "),
    })),
  ];

  for (const forbidden of FORBIDDEN_INGREDIENTS) {
    const pattern = new RegExp(`\\b${forbidden}\\b`, "i");
    for (const h of haystacks) {
      if (pattern.test(h.text)) {
        flags.push({
          type: "forbidden-ingredient",
          message: `Found forbidden ingredient "${forbidden}" in ${h.where}. Kashmiri Pandit cuisine never uses onion, garlic, or tomato.`,
        });
      }
    }
  }
  return flags;
}

/** Hard rule from the source: Mutton Yakhni has no turmeric or red chilli. */
export function checkDishSpecificRules(recipe: ExtractedRecipe): RecipeFlag[] {
  const flags: RecipeFlag[] = [];
  if (recipe.slug === "mutton-yakhni") {
    const text = recipe.ingredients
      .map((i) => [i.name, i.localName].filter(Boolean).join(" "))
      .join(" ");
    for (const banned of ["turmeric", "red chilli", "red chili"]) {
      if (new RegExp(banned, "i").test(text)) {
        flags.push({
          type: "dish-rule",
          message: `Mutton Yakhni must not contain ${banned} — the source states it uses neither turmeric nor red chilli powder.`,
        });
      }
    }
  }
  return flags;
}

/** Every sourceText must be an (approximately) exact quote from the block. */
export function checkSourceMatch(
  recipe: ExtractedRecipe,
  blockRawText: string
): RecipeFlag[] {
  const flags: RecipeFlag[] = [];
  const normalizedBlock = normalize(blockRawText);

  function check(label: string, sourceText: string) {
    if (!sourceText) return;
    // A model may join two genuinely separate source sentences with "\n"
    // when one ingredient/step's full detail is split across the document
    // (e.g. Kehwa's prose puts a quantity in the method, not the ingredient
    // line) — each line is checked independently rather than as one span.
    const segments = sourceText.split("\n").map((s) => s.trim()).filter(Boolean);
    for (const segment of segments) {
      if (!normalizedBlock.includes(normalize(segment))) {
        flags.push({
          type: "source-mismatch",
          message: `sourceText for ${label} was not found verbatim in the source block: "${segment}"`,
        });
      }
    }
  }

  recipe.ingredients.forEach((i) => check(`ingredient "${i.name}"`, i.sourceText));
  recipe.steps.forEach((s) => check(`step "${s.action}"`, s.sourceText));
  recipe.variants.forEach((v) => {
    check(`variant "${v.name}"`, v.sourceText);
    v.steps.forEach((s) => check(`variant "${v.name}" step "${s.action}"`, s.sourceText));
  });

  return flags;
}

/** A step mentions an ingredient id that isn't in the ingredient list. */
export function checkOrphanIngredientRefs(recipe: ExtractedRecipe): RecipeFlag[] {
  const flags: RecipeFlag[] = [];
  const knownIds = new Set(recipe.ingredients.map((i) => i.id));
  for (const step of recipe.steps) {
    for (const id of step.ingredientIds) {
      if (!knownIds.has(id)) {
        flags.push({
          type: "orphan-ingredient-ref",
          message: `Step "${step.action}" references ingredient id "${id}", which is not in the ingredient list.`,
        });
      }
    }
  }
  return flags;
}

/** Step order should be non-decreasing except for explicitly parallel branches. */
export function checkStepOrder(recipe: ExtractedRecipe): RecipeFlag[] {
  const flags: RecipeFlag[] = [];
  const mainline = recipe.steps.filter((s) => !s.branch);
  for (let i = 1; i < mainline.length; i++) {
    if (mainline[i].order < mainline[i - 1].order) {
      flags.push({
        type: "step-order",
        message: `Step "${mainline[i].action}" has order ${mainline[i].order}, out of sequence after "${mainline[i - 1].action}" (order ${mainline[i - 1].order}).`,
      });
    }
  }
  return flags;
}

/**
 * Coverage is intentionally approximate: every source line that looks like
 * an ingredient or instruction bullet ("- ...") should be echoed by at
 * least one extracted sourceText. A miss is a soft flag for human review,
 * not a hard failure — short connective lines between recipes sometimes
 * bleed into a block (see docs/SPEC.md § 6.2) and aren't real misses.
 */
export function checkCoverage(
  recipe: ExtractedRecipe,
  blockRawText: string
): RecipeFlag[] {
  const flags: RecipeFlag[] = [];
  const allSourceText = normalize(
    [
      ...recipe.ingredients.map((i) => i.sourceText),
      ...recipe.steps.map((s) => s.sourceText),
      ...recipe.variants.flatMap((v) => [v.sourceText, ...v.steps.map((s) => s.sourceText)]),
      recipe.description,
    ].join(" ")
  );

  const bulletLines = blockRawText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("-") && l.length > 5);

  for (const line of bulletLines) {
    const words = normalize(line).split(" ").filter((w) => w.length > 3);
    if (words.length === 0) continue;
    const hits = words.filter((w) => allSourceText.includes(w)).length;
    if (hits / words.length < 0.4) {
      flags.push({
        type: "coverage",
        message: `This source line may not be reflected in any extracted field: "${line}"`,
      });
    }
  }
  return flags;
}

/**
 * Flags that indicate an actual data-integrity defect and must block
 * approval. Everything else is a soft, informational flag the model
 * raised about an ambiguity in the SOURCE document itself — it can't be
 * "fixed" by editing (that would mean inventing a fact), so it's
 * acknowledged during review rather than blocking forever.
 */
export const HARD_FLAG_TYPES = new Set([
  "forbidden-ingredient",
  "dish-rule",
  "source-mismatch",
  "orphan-ingredient-ref",
  "step-order",
]);

export function isHardFlag(flag: RecipeFlag): boolean {
  return HARD_FLAG_TYPES.has(flag.type);
}

export function runAllValidators(
  recipe: ExtractedRecipe,
  blockRawText: string
): RecipeFlag[] {
  return [
    ...checkForbiddenIngredients(recipe),
    ...checkDishSpecificRules(recipe),
    ...checkSourceMatch(recipe, blockRawText),
    ...checkOrphanIngredientRefs(recipe),
    ...checkStepOrder(recipe),
    ...checkCoverage(recipe, blockRawText),
  ];
}

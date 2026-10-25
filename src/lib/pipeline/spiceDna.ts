import type { ExtractedRecipe } from "@/lib/schema/recipe";

export const SPICE_COLUMNS = [
  "heeng",
  "saunf",
  "sonth",
  "kashmiriChilli",
  "saffron",
] as const;
export type SpiceColumn = (typeof SPICE_COLUMNS)[number];

const SPICE_KEYWORDS: Record<SpiceColumn, RegExp> = {
  heeng: /heeng|asafoetida/i,
  saunf: /saunf|fennel/i,
  sonth: /sonth|soonth|dry\s+ginger|ginger\s+powder/i,
  kashmiriChilli: /kashmiri.*(chilli|chilly|chili)/i,
  saffron: /saffron/i,
};

export type SpiceDnaRow = { slug: string; name: string } & Record<
  SpiceColumn,
  boolean
>;

/** Computed from approved ingredient data — never hard-coded (see docs/SPEC.md § 6.9). */
export function computeSpiceDnaRow(recipe: ExtractedRecipe): SpiceDnaRow {
  const haystack = recipe.ingredients
    .map((i) => [i.name, i.localName].filter(Boolean).join(" "))
    .join(" | ");

  const row = { slug: recipe.slug, name: recipe.name } as SpiceDnaRow;
  for (const col of SPICE_COLUMNS) {
    row[col] = SPICE_KEYWORDS[col].test(haystack);
  }
  return row;
}

export function computeSpiceDna(recipes: ExtractedRecipe[]): SpiceDnaRow[] {
  return recipes.map(computeSpiceDnaRow);
}

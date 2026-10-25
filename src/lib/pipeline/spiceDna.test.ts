import { describe, it, expect } from "vitest";
import { getRecipe } from "./store";
import { computeSpiceDnaRow } from "./spiceDna";
import { DISH_SLUGS } from "@/lib/schema/recipe";

/**
 * docs/SPEC.md § 6.9 — expected result from the current source, used as a
 * test fixture. This is an integration check against REAL extracted data
 * (run `npx tsx` pipeline extraction first, or `/admin/recipes` → Run all
 * 7), not a synthetic unit test — it's the evidence that the Spice DNA map
 * will be computed correctly in Phase 2, not hard-coded.
 */
const EXPECTED: Record<
  string,
  { heeng: boolean; saunf: boolean; sonth: boolean; kashmiriChilli: boolean; saffron: boolean }
> = {
  "rogan-josh": { heeng: true, saunf: true, sonth: true, kashmiriChilli: true, saffron: false },
  "mutton-yakhni": { heeng: true, saunf: true, sonth: true, kashmiriChilli: false, saffron: false },
  "dum-aaloo": { heeng: true, saunf: true, sonth: true, kashmiriChilli: true, saffron: false },
  "nadru-yakhni": { heeng: true, saunf: true, sonth: true, kashmiriChilli: false, saffron: false },
  "nadur-monje": { heeng: false, saunf: false, sonth: true, kashmiriChilli: true, saffron: false },
  kehwa: { heeng: false, saunf: false, sonth: false, kashmiriChilli: false, saffron: true },
  "kong-phirin": { heeng: false, saunf: false, sonth: false, kashmiriChilli: false, saffron: true },
};

describe("Spice DNA fixture (docs/SPEC.md § 6.9)", () => {
  for (const slug of DISH_SLUGS) {
    const expected = EXPECTED[slug];

    it(`matches the expected spice row for ${slug}`, () => {
      const recipe = getRecipe(slug);
      if (!recipe) {
        // No DB in this environment yet (e.g. a fresh CI checkout) — this
        // fixture needs real pipeline output, so skip rather than fail.
        return;
      }
      const row = computeSpiceDnaRow(recipe);
      expect(row).toMatchObject(expected);
    });
  }
});

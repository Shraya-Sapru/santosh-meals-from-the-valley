import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { getLLMClient, getLLMModel } from "@/lib/llm";
import { DISH_SLUGS, type DishSlug } from "@/lib/schema/recipe";

const SOURCE_PATH = path.resolve(process.cwd(), "source", "recipes.md");

export function readSourceText(): string {
  return fs.readFileSync(SOURCE_PATH, "utf-8");
}

const LineRange = z.object({
  slug: z.enum(DISH_SLUGS),
  startLine: z.number().int().positive(),
  endLine: z.number().int().positive(),
});

const SegmentationResponse = z.object({
  blocks: z.array(LineRange),
});

export type RecipeBlock = {
  slug: DishSlug;
  rawText: string;
  startLine: number;
  endLine: number;
};

export type SegmentationResult = {
  blocks: RecipeBlock[];
  tokens: { input: number; cachedInput: number; output: number };
};

/**
 * Finds line ranges for the 7 recipe blocks via the LLM (the source doc's
 * bold-markdown headings are too irregular for reliable regex splitting —
 * see docs/SPEC.md § 6.2), then slices the ORIGINAL lines by number. The
 * model never has to reproduce text verbatim, so every block is guaranteed
 * to be an exact substring of the source.
 */
export async function segmentSource(
  sourceText: string
): Promise<SegmentationResult> {
  const lines = sourceText.split("\n");
  const numbered = lines.map((line, i) => `${i + 1}: ${line}`).join("\n");

  const client = getLLMClient();
  const model = getLLMModel();

  const response = await client.responses.create({
    model,
    input: [
      {
        role: "system",
        content:
          "You segment a recipe document into its recipe blocks by LINE NUMBER only. " +
          "Never rewrite, summarise, or reproduce the text itself — only identify where each " +
          "recipe starts and ends. Respond with JSON only, matching this shape exactly: " +
          '{"blocks": [{"slug": string, "startLine": number, "endLine": number}]}. ' +
          "The 7 allowed slugs, in no particular order, are: " +
          DISH_SLUGS.join(", ") +
          ". Each block must start at that dish's heading line and end at the line just " +
          "before the next dish's heading (or the last content line before any trailing " +
          "credit line, for the final dish). Cover all 7 slugs exactly once, with no gaps " +
          "or overlaps, in the order they appear in the document.",
      },
      {
        role: "user",
        content: `Numbered source document:\n\n${numbered}`,
      },
    ],
  });

  const usage = response.usage;
  const tokens = {
    input: usage?.input_tokens ?? 0,
    cachedInput: usage?.input_tokens_details?.cached_tokens ?? 0,
    output: usage?.output_tokens ?? 0,
  };

  const text = response.output_text;
  const json = JSON.parse(text);
  const parsed = SegmentationResponse.parse(json);

  const seenSlugs = new Set<string>();
  for (const b of parsed.blocks) {
    if (seenSlugs.has(b.slug)) {
      throw new Error(`Segmentation returned duplicate slug: ${b.slug}`);
    }
    seenSlugs.add(b.slug);
    if (b.startLine > b.endLine || b.endLine > lines.length) {
      throw new Error(
        `Segmentation returned an invalid line range for ${b.slug}: ${b.startLine}-${b.endLine}`
      );
    }
  }
  const missing = DISH_SLUGS.filter((s) => !seenSlugs.has(s));
  if (missing.length > 0) {
    throw new Error(`Segmentation is missing slugs: ${missing.join(", ")}`);
  }

  const blocks: RecipeBlock[] = parsed.blocks.map((b) => ({
    slug: b.slug,
    startLine: b.startLine,
    endLine: b.endLine,
    rawText: lines.slice(b.startLine - 1, b.endLine).join("\n"),
  }));

  return { blocks, tokens };
}

import { getLLMClient, getLLMModel } from "@/lib/llm";
import {
  ExtractedRecipeBody,
  type DishSlug,
  type ExtractedRecipe,
} from "@/lib/schema/recipe";
import { DISH_METADATA } from "./dishMeta";

const SYSTEM_PROMPT = `You extract ONE recipe from a block of source text into structured JSON.

Non-negotiable rules:
- Use ONLY the provided text. Never add, remove, reorder, or "improve" facts, and never fill gaps with general cooking knowledge.
- Copy every quantity exactly as written (e.g. "4 tsp", "1½ to 2 tsp", "a pinch"). If a quantity is not stated, use null.
- For step fields "duration", "sensoryCue", and "warning": use null (never an empty string "") when the source doesn't state one.
- Every ingredient and every step MUST include "sourceText": the exact sentence(s) it came from, copied verbatim from the source (same spelling, same punctuation, including any typos in the source).
- Never invent an ingredient or step that is not in the text.
- If something is ambiguous, missing, or ingredient-alternatives are given, do not guess — record it as an entry in "flags" with a short "type" and a human-readable "message", and still extract what IS stated.
- "group" is the ingredient's listed sub-group if the source uses one (e.g. "Whole spices", "Ground spices"), otherwise omit it.
- "interaction" must be one of: heat_hold, cool_wait, drop_in, crush_then_drop, timed_add, stir, stir_high_heat, heat_dial, sprinkle_stir, slow_pour_with_stir, pour_water, cover_simmer, pressure_whistles, gentle_stir, rest, plate, deep_fry, pierce, batter_dip, steep, strain, none. Pick the closest match to what the step actually does.
- "heat" must be one of: off, low, medium-low, medium, high, lowered, unspecified.
- If the source describes an alternative method (e.g. a pressure-cooker note) as a variant of the main method, put it in "variants", each step there still needs its own "sourceText".
- Respond with JSON ONLY, no prose, matching the given shape exactly.`;

function buildUserPrompt(slug: DishSlug, rawText: string): string {
  return `Recipe block for "${slug}":\n\n${rawText}\n\nExtract it now as JSON.`;
}

export type ExtractionResult = {
  recipe: ExtractedRecipe;
  tokens: { input: number; cachedInput: number; output: number };
  attempts: number;
};

async function callOnce(
  slug: DishSlug,
  rawText: string,
  retryContext?: { previousOutput: string; error: string }
) {
  const client = getLLMClient();
  const model = getLLMModel();

  const messages: Array<{ role: "system" | "user"; content: string }> = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: buildUserPrompt(slug, rawText) },
  ];
  if (retryContext) {
    messages.push({
      role: "user",
      content:
        `Your previous JSON failed validation.\n\nPrevious output:\n${retryContext.previousOutput}\n\n` +
        `Validation error:\n${retryContext.error}\n\nReturn corrected JSON only.`,
    });
  }

  const response = await client.responses.create({ model, input: messages });
  const usage = response.usage;
  return {
    text: response.output_text,
    tokens: {
      input: usage?.input_tokens ?? 0,
      cachedInput: usage?.input_tokens_details?.cached_tokens ?? 0,
      output: usage?.output_tokens ?? 0,
    },
  };
}

export async function extractRecipe(
  slug: DishSlug,
  rawText: string
): Promise<ExtractionResult> {
  const totalTokens = { input: 0, cachedInput: 0, output: 0 };

  const first = await callOnce(slug, rawText);
  totalTokens.input += first.tokens.input;
  totalTokens.cachedInput += first.tokens.cachedInput;
  totalTokens.output += first.tokens.output;

  let body: ExtractedRecipeBody;
  let attempts = 1;
  try {
    body = ExtractedRecipeBody.parse(JSON.parse(first.text));
  } catch (err) {
    const second = await callOnce(slug, rawText, {
      previousOutput: first.text,
      error: String(err),
    });
    totalTokens.input += second.tokens.input;
    totalTokens.cachedInput += second.tokens.cachedInput;
    totalTokens.output += second.tokens.output;
    attempts = 2;
    body = ExtractedRecipeBody.parse(JSON.parse(second.text));
  }

  const meta = DISH_METADATA[slug];
  const recipe: ExtractedRecipe = { slug, ...meta, ...body };

  return { recipe, tokens: totalTokens, attempts };
}

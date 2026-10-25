import { getLLMModel } from "@/lib/llm";
import type { DishSlug } from "@/lib/schema/recipe";
import { readSourceText, segmentSource } from "./ingest";
import {
  saveSourceDocument,
  saveRecipeBlocks,
  getLatestRecipeBlock,
  saveExtractedRecipe,
  startPipelineRun,
  finishPipelineRun,
} from "./store";
import { extractRecipe } from "./extract";
import { runAllValidators } from "./validators";

/** Segments source/recipes.md and stores the 7 blocks, if not already done. */
export async function ensureRecipeBlocks(): Promise<void> {
  if (getLatestRecipeBlock("rogan-josh")) return;

  const sourceText = readSourceText();
  const { blocks } = await segmentSource(sourceText);
  const documentId = saveSourceDocument("Kashmiri_Food.docx", sourceText);
  saveRecipeBlocks(documentId, blocks);
}

export type PipelineRunSummary = {
  slug: DishSlug;
  flagCount: number;
  tokens: { input: number; cachedInput: number; output: number };
  attempts: number;
};

export async function runPipelineForSlug(
  slug: DishSlug
): Promise<PipelineRunSummary> {
  await ensureRecipeBlocks();

  const block = getLatestRecipeBlock(slug);
  if (!block) {
    throw new Error(
      `No recipe block found for "${slug}" — segmentation may not have run yet.`
    );
  }

  const runId = startPipelineRun(slug, getLLMModel());
  const { recipe, tokens } = await extractRecipe(slug, block.rawText);

  const validatorFlags = runAllValidators(recipe, block.rawText);
  recipe.flags = [...recipe.flags, ...validatorFlags];

  saveExtractedRecipe(recipe);
  finishPipelineRun(runId, tokens, recipe.flags);

  return { slug, flagCount: recipe.flags.length, tokens, attempts: 1 };
}

import { getDb } from "@/lib/db";
import type { ExtractedRecipe, RecipeFlag } from "@/lib/schema/recipe";
import type { RecipeBlock } from "./ingest";

export function saveSourceDocument(filename: string, rawText: string): number {
  const db = getDb();
  const result = db
    .prepare(`INSERT INTO source_documents (filename, raw_text) VALUES (?, ?)`)
    .run(filename, rawText);
  return Number(result.lastInsertRowid);
}

export function saveRecipeBlocks(documentId: number, blocks: RecipeBlock[]): void {
  const db = getDb();
  const insert = db.prepare(
    `INSERT INTO recipe_blocks (document_id, slug, raw_text) VALUES (?, ?, ?)`
  );
  const insertMany = db.transaction((rows: RecipeBlock[]) => {
    for (const row of rows) {
      insert.run(documentId, row.slug, row.rawText);
    }
  });
  insertMany(blocks);
}

export function getLatestRecipeBlock(slug: string): { rawText: string } | undefined {
  const db = getDb();
  return db
    .prepare(
      `SELECT raw_text as rawText FROM recipe_blocks WHERE slug = ? ORDER BY id DESC LIMIT 1`
    )
    .get(slug) as { rawText: string } | undefined;
}

export function saveExtractedRecipe(recipe: ExtractedRecipe): void {
  const db = getDb();
  db.prepare(
    `INSERT INTO recipes (slug, data, status, version)
     VALUES (@slug, @data, 'extracted', 1)
     ON CONFLICT(slug) DO UPDATE SET
       data = excluded.data,
       status = 'extracted',
       version = version + 1,
       approved_at = NULL`
  ).run({ slug: recipe.slug, data: JSON.stringify(recipe) });
}

export function getRecipe(slug: string): ExtractedRecipe & { status: string; version: number } | undefined {
  const db = getDb();
  const row = db
    .prepare(`SELECT data, status, version FROM recipes WHERE slug = ?`)
    .get(slug) as { data: string; status: string; version: number } | undefined;
  if (!row) return undefined;
  return { ...JSON.parse(row.data), status: row.status, version: row.version };
}

export function upsertPhoto(slotId: string, url: string, alt: string): void {
  const db = getDb();
  db.prepare(
    `INSERT INTO photos (slot_id, url, alt, status) VALUES (?, ?, ?, 'approved')
     ON CONFLICT(slot_id) DO UPDATE SET url = excluded.url, alt = excluded.alt, status = 'approved'`
  ).run(slotId, url, alt);
}

export function getPhotoUrl(slotId: string): string | undefined {
  const db = getDb();
  const row = db
    .prepare(`SELECT url FROM photos WHERE slot_id = ? AND status = 'approved'`)
    .get(slotId) as { url: string } | undefined;
  return row?.url;
}

export function getLatestRunTokens(
  slug: string
): { input: number; cachedInput: number; output: number } | undefined {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT input_tokens as input, cached_input_tokens as cachedInput, output_tokens as output
       FROM pipeline_runs WHERE recipe_slug = ? AND finished_at IS NOT NULL
       ORDER BY id DESC LIMIT 1`
    )
    .get(slug) as
    | { input: number; cachedInput: number; output: number }
    | undefined;
  return row;
}

export function approveRecipe(slug: string): void {
  const db = getDb();
  db.prepare(
    `UPDATE recipes SET status = 'approved', approved_at = datetime('now') WHERE slug = ?`
  ).run(slug);
}

export function markInReview(slug: string): void {
  const db = getDb();
  db.prepare(
    `UPDATE recipes SET status = 'in_review' WHERE slug = ? AND status = 'extracted'`
  ).run(slug);
}

export function listRecipes(): Array<{ slug: string; status: string; version: number }> {
  const db = getDb();
  return db
    .prepare(`SELECT slug, status, version FROM recipes ORDER BY slug`)
    .all() as Array<{ slug: string; status: string; version: number }>;
}

export function startPipelineRun(slug: string, model: string): number {
  const db = getDb();
  const result = db
    .prepare(`INSERT INTO pipeline_runs (recipe_slug, model) VALUES (?, ?)`)
    .run(slug, model);
  return Number(result.lastInsertRowid);
}

export function finishPipelineRun(
  runId: number,
  tokens: { input: number; cachedInput: number; output: number },
  validatorResults: RecipeFlag[]
): void {
  const db = getDb();
  db.prepare(
    `UPDATE pipeline_runs
     SET input_tokens = ?, cached_input_tokens = ?, output_tokens = ?,
         finished_at = datetime('now'), validator_results = ?
     WHERE id = ?`
  ).run(
    tokens.input,
    tokens.cachedInput,
    tokens.output,
    JSON.stringify(validatorResults),
    runId
  );
}

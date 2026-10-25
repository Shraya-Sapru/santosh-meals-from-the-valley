import path from "node:path";
import dotenv from "dotenv";

let loaded = false;

/**
 * Course rule: the grading staff's .env sits one folder above the cloned
 * repo and contains only PORTKEY_API_KEY and OPENAI_API_KEY. Check this
 * repo's own .env first, then fall back to the folder above it.
 */
export function loadEnv(): void {
  if (loaded) return;
  loaded = true;
  dotenv.config({ path: path.resolve(process.cwd(), ".env"), quiet: true });
  dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), quiet: true });
  dotenv.config({ path: path.resolve(process.cwd(), "..", ".env"), quiet: true });
}

import OpenAI from "openai";
import { loadEnv } from "./env";

loadEnv();

/** Course key path model — the only model allowed with PORTKEY_API_KEY. */
export const COURSE_MODEL = "gpt-6-luna";

let cachedClient: OpenAI | null = null;

export function getLLMClient(): OpenAI {
  if (cachedClient) return cachedClient;

  const openaiKey = process.env.OPENAI_API_KEY;
  const portkeyKey = process.env.PORTKEY_API_KEY;

  if (openaiKey) {
    cachedClient = new OpenAI({ apiKey: openaiKey });
  } else if (portkeyKey) {
    cachedClient = new OpenAI({
      apiKey: portkeyKey,
      baseURL: "https://api.portkey.ai/v1",
      defaultHeaders: { "x-portkey-provider": "openai" },
    });
  } else {
    throw new Error(
      "No LLM key found. Set PORTKEY_API_KEY (course key, model gpt-6-luna) or " +
        "OPENAI_API_KEY, either in this repo's .env or in the .env one folder above it."
    );
  }
  return cachedClient;
}

export function getLLMModel(): string {
  if (process.env.OPENAI_API_KEY) {
    const model = process.env.OPENAI_MODEL;
    if (!model) {
      throw new Error(
        "OPENAI_MODEL is required when using your own OPENAI_API_KEY " +
          "(the course key path uses gpt-6-luna automatically)."
      );
    }
    return model;
  }
  return COURSE_MODEL;
}

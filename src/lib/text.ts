/**
 * The source document has markdown emphasis baked into some sentences
 * (e.g. "**Note**: ..."). Strip it for display — the recipe fact stays
 * byte-identical, only the markup characters are removed.
 */
export function stripMarkdown(text: string): string {
  return text.replace(/\*\*/g, "").replace(/\*/g, "");
}

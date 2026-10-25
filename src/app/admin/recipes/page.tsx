import Link from "next/link";
import { Button } from "@/components/Button";
import { getRecipe, getLatestRunTokens } from "@/lib/pipeline/store";
import { DISH_SLUGS } from "@/lib/schema/recipe";
import { isHardFlag } from "@/lib/pipeline/validators";
import { runExtractionAction, runAllExtractionsAction } from "./actions";

const statusLabel: Record<string, string> = {
  extracted: "Extracted — needs review",
  in_review: "In review",
  approved: "Approved",
};

export default function RecipesPage() {
  const rows = DISH_SLUGS.map((slug) => ({ slug, recipe: getRecipe(slug) }));

  return (
    <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Recipe pipeline</h1>
          <p className="mt-1 text-ink-soft">
            Ingest → extract → validate → review → approve.
          </p>
        </div>
        <form action={runAllExtractionsAction}>
          <Button type="submit" variant="secondary">
            Run all 7
          </Button>
        </form>
      </div>

      <table className="w-full border-separate border-spacing-y-2 text-left text-[15px]">
        <thead>
          <tr className="text-ink-soft">
            <th className="px-3 font-normal">Dish</th>
            <th className="px-3 font-normal">Status</th>
            <th className="px-3 font-normal">Flags</th>
            <th className="px-3 font-normal">Tokens used</th>
            <th className="px-3 font-normal"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ slug, recipe }) => {
            const hardFlags = recipe?.flags.filter(isHardFlag).length ?? 0;
            const softFlags = (recipe?.flags.length ?? 0) - hardFlags;
            return (
              <tr key={slug} className="rounded-panel bg-almond/40">
                <td className="rounded-l-panel px-3 py-3 font-display text-lg">
                  {recipe?.name ?? slug}
                </td>
                <td className="px-3 py-3">
                  {recipe ? (
                    <span className="inline-flex items-center gap-2 text-ink">
                      {recipe.status === "approved" && (
                        <span className="h-2 w-2 rounded-full bg-cardamom" />
                      )}
                      {statusLabel[recipe.status] ?? recipe.status}
                    </span>
                  ) : (
                    <span className="text-ink-soft">Not run yet</span>
                  )}
                </td>
                <td className="px-3 py-3">
                  {hardFlags > 0 && (
                    <span className="mr-2 rounded-full bg-chilli px-2 py-0.5 text-xs text-rice">
                      {hardFlags} blocking
                    </span>
                  )}
                  {softFlags > 0 && (
                    <span className="rounded-full bg-saffron px-2 py-0.5 text-xs text-ink">
                      {softFlags} to review
                    </span>
                  )}
                  {recipe && recipe.flags.length === 0 && (
                    <span className="text-ink-soft">None</span>
                  )}
                </td>
                <td className="px-3 py-3 text-ink-soft">
                  {(() => {
                    const tokens = getLatestRunTokens(slug);
                    if (!tokens) return "—";
                    return `${tokens.input.toLocaleString()} in / ${tokens.output.toLocaleString()} out`;
                  })()}
                </td>
                <td className="rounded-r-panel px-3 py-3">
                  <div className="flex items-center gap-3">
                    <form action={runExtractionAction}>
                      <input type="hidden" name="slug" value={slug} />
                      <Button type="submit" variant="quiet">
                        {recipe ? "Re-run" : "Run extraction"}
                      </Button>
                    </form>
                    {recipe && (
                      <Link
                        href={`/admin/review/${slug}`}
                        className="text-chilli underline"
                      >
                        Review
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}

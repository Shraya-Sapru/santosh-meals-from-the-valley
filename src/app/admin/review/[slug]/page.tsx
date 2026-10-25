import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button";
import { getRecipe, getLatestRecipeBlock } from "@/lib/pipeline/store";
import { DISH_SLUGS, type DishSlug } from "@/lib/schema/recipe";
import { isHardFlag } from "@/lib/pipeline/validators";
import { approveRecipeAction } from "../../recipes/actions";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!DISH_SLUGS.includes(slug as DishSlug)) notFound();

  const recipe = getRecipe(slug);
  const block = getLatestRecipeBlock(slug);

  if (!recipe || !block) {
    return (
      <main className="mx-auto w-full max-w-[1120px] px-6 py-12">
        <p className="text-ink-soft">
          No extraction yet for &quot;{slug}&quot;.{" "}
          <Link href="/admin/recipes" className="text-chilli underline">
            Go run it
          </Link>
          .
        </p>
      </main>
    );
  }

  const hardFlags = recipe.flags.filter(isHardFlag);
  const softFlags = recipe.flags.filter((f) => !isHardFlag(f));
  const canApprove = hardFlags.length === 0;

  return (
    <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-6 px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/recipes" className="text-sm text-ink-soft underline">
            ← All recipes
          </Link>
          <h1 className="font-display text-3xl text-ink">{recipe.name}</h1>
          <p className="text-ink-soft">
            {recipe.course} · {recipe.isVeg ? "veg" : "non-veg"} · status:{" "}
            {recipe.status} · version {recipe.version}
          </p>
        </div>
        <form action={approveRecipeAction}>
          <input type="hidden" name="slug" value={slug} />
          <Button type="submit" disabled={!canApprove}>
            {recipe.status === "approved" ? "Re-approve" : "Approve"}
          </Button>
        </form>
      </div>

      {recipe.flags.length > 0 && (
        <div className="flex flex-col gap-2">
          {hardFlags.map((f, i) => (
            <div
              key={`hard-${i}`}
              className="rounded-panel bg-chilli px-4 py-3 text-[15px] text-rice"
            >
              <span className="font-semibold">Blocking — {f.type}:</span>{" "}
              {f.message}
            </div>
          ))}
          {softFlags.map((f, i) => (
            <div
              key={`soft-${i}`}
              className="rounded-panel bg-saffron px-4 py-3 text-[15px] text-ink"
            >
              <span className="font-semibold">{f.type}:</span> {f.message}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-panel bg-almond/40 p-5">
          <h2 className="font-display text-xl text-ink">Source</h2>
          <pre className="mt-3 max-h-[70vh] overflow-auto whitespace-pre-wrap text-sm text-ink-soft">
            {block.rawText}
          </pre>
        </section>

        <section className="flex flex-col gap-6">
          <div className="rounded-panel bg-lotus/40 p-5">
            <h2 className="font-display text-xl text-ink">
              Ingredients ({recipe.ingredients.length})
            </h2>
            <ul className="mt-3 flex flex-col gap-2 text-[15px]">
              {recipe.ingredients.map((ing) => (
                <li key={ing.id} className="rounded-input bg-rice p-3">
                  <p className="text-ink">
                    <span className="font-semibold">{ing.name}</span>
                    {ing.quantity && ` — ${ing.quantity}`}
                    {ing.group && (
                      <span className="ml-2 text-xs text-ink-soft">
                        [{ing.group}]
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-ink-soft">
                    &quot;{ing.sourceText}&quot;
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-panel bg-cardamom/40 p-5">
            <h2 className="font-display text-xl text-ink">
              Steps ({recipe.steps.length})
            </h2>
            <ol className="mt-3 flex flex-col gap-2 text-[15px]">
              {recipe.steps.map((step) => (
                <li key={step.id} className="rounded-input bg-rice p-3">
                  <p className="text-ink">
                    <span className="font-semibold">{step.order}.</span>{" "}
                    {step.action}
                  </p>
                  <p className="mt-1 text-xs text-ink-soft">
                    {step.interaction} · heat: {step.heat}
                    {step.duration && ` · ${step.duration}`}
                  </p>
                  {step.warning && (
                    <p className="mt-1 text-xs text-chilli">⚠ {step.warning}</p>
                  )}
                </li>
              ))}
            </ol>
          </div>

          {recipe.variants.length > 0 && (
            <div className="rounded-panel bg-saffron/40 p-5">
              <h2 className="font-display text-xl text-ink">Variants</h2>
              {recipe.variants.map((v) => (
                <div key={v.name} className="mt-2">
                  <p className="font-semibold text-ink">{v.name}</p>
                  <ol className="mt-1 flex flex-col gap-1 text-[15px] text-ink-soft">
                    {v.steps.map((s) => (
                      <li key={s.id}>
                        {s.order}. {s.action}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

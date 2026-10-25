import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button";
import { PhotoSlot } from "@/components/PhotoSlot";
import { IngredientIcon } from "@/components/IngredientIcon";
import { StepBook } from "@/components/StepBook";
import { getRecipe, getPhotoUrl } from "@/lib/pipeline/store";
import { DISH_SLUGS, type DishSlug } from "@/lib/schema/recipe";
import { DISH_TONE, PHOTO_SLOT } from "@/lib/dishTheme";
import { stripMarkdown } from "@/lib/text";

export default async function DishPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!DISH_SLUGS.includes(slug as DishSlug)) notFound();

  const recipe = getRecipe(slug);
  if (!recipe || recipe.status !== "approved") notFound();

  const tone = DISH_TONE[slug as DishSlug];
  const photoUrl = getPhotoUrl(PHOTO_SLOT[slug as DishSlug]);

  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-[1120px] px-6 py-12">
        <Link href="/kitchen" className="text-sm text-ink-soft underline">
          ← The Kitchen
        </Link>
        <div className="mt-6 grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div>
            <h1 className="font-display text-4xl text-ink sm:text-5xl">
              {recipe.name}
            </h1>
            <p className="mt-2 text-sm text-ink-soft">
              {recipe.course} · {recipe.isVeg ? "veg" : "non-veg"}
            </p>
            <p className="mt-4 max-w-md text-[17px] leading-relaxed text-ink-soft">
              {stripMarkdown(recipe.description)}
            </p>
          </div>
          <PhotoSlot
            id={PHOTO_SLOT[slug as DishSlug]}
            label={recipe.name}
            tone={tone}
            src={photoUrl}
            aspect="square"
            fit="contain"
            caption={slug === "kong-phirin" ? "Reference photo" : undefined}
          />
        </div>
      </section>

      <section className="border-y border-almond bg-almond/30 py-14">
        <div className="mx-auto w-full max-w-[1000px] px-6">
          <h2 className="text-center font-display text-3xl text-ink">
            What goes in
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {recipe.ingredients.map((ing) => (
              <div
                key={ing.id}
                className="flex w-full items-center gap-3 rounded-panel bg-rice p-3 sm:w-[calc(50%-0.375rem)] lg:w-[calc(33.333%-0.5rem)]"
              >
                <IngredientIcon
                  name={ing.name}
                  localName={ing.localName}
                  className="h-10 w-10 shrink-0"
                />
                <div>
                  {ing.group && (
                    <p className="text-[11px] text-ink-soft">{ing.group}</p>
                  )}
                  <p className="text-[15px] text-ink">
                    {ing.name}
                    {ing.localName && (
                      <span className="text-ink-soft"> ({ing.localName})</span>
                    )}
                  </p>
                  {ing.quantity && (
                    <p className="text-xs text-ink-soft">{ing.quantity}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto w-full max-w-[1120px] px-6">
          <h2 className="text-center font-display text-3xl text-ink">
            How it&apos;s made
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-ink-soft">
            Flip through each step, the way the recipe tells it.
          </p>
          <div className="mt-10">
            <StepBook steps={recipe.steps} />
          </div>

          {recipe.variants.length > 0 && (
            <div className="mx-auto mt-10 max-w-xl rounded-panel bg-saffron/30 p-5 text-center">
              <p className="text-sm font-semibold text-ink">
                {recipe.variants[0].name}
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                {stripMarkdown(recipe.variants[0].sourceText)}
              </p>
            </div>
          )}
        </div>
      </section>

      {recipe.servingNote && (
        <section className="border-t border-almond bg-almond/30 py-14">
          <div className="mx-auto flex max-w-[680px] flex-col items-center gap-4 px-6 text-center">
            <h2 className="font-display text-2xl text-ink">Serve it</h2>
            <p className="text-[17px] text-ink-soft">
              {stripMarkdown(recipe.servingNote)}
            </p>
            <Button href="/this-weekend" variant="secondary">
              On the menu this weekend?
            </Button>
          </div>
        </section>
      )}
    </main>
  );
}

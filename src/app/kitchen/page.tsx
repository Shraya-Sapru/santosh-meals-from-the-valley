import { DishCard } from "@/components/DishCard";
import { getRecipe, getPhotoUrl } from "@/lib/pipeline/store";
import { MEAL_ORDER, PHOTO_SLOT } from "@/lib/dishTheme";
import type { DishSlug } from "@/lib/schema/recipe";

export const metadata = {
  title: "The Kitchen — Santosh",
};

type Dish = NonNullable<ReturnType<typeof getRecipe>>;

function SectionBanner({ title, note }: { title: string; note?: string }) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      <span className="h-px flex-1 bg-almond" />
      {note && <span className="text-sm text-ink-soft">{note}</span>}
    </div>
  );
}

function DishGrid({ dishes }: { dishes: Dish[] }) {
  return (
    <div
      className={`mx-auto grid max-w-2xl grid-cols-1 gap-5 ${
        dishes.length > 1 ? "sm:grid-cols-2" : "sm:max-w-sm"
      }`}
    >
      {dishes.map((dish) => (
        <DishCard
          key={dish.slug}
          slug={dish.slug as DishSlug}
          name={dish.name}
          description={dish.description}
          course={dish.course}
          photoUrl={getPhotoUrl(PHOTO_SLOT[dish.slug as DishSlug])}
        />
      ))}
    </div>
  );
}

export default function KitchenPage() {
  const dishes = MEAL_ORDER.map((slug) => getRecipe(slug)).filter(
    (r): r is Dish => r !== undefined && r.status === "approved"
  );

  const starters = dishes.filter((d) => d.course === "starter");
  const mains = dishes.filter((d) => d.course === "main");
  const mainsVeg = mains.filter((d) => d.isVeg);
  const mainsNonVeg = mains.filter((d) => !d.isVeg);
  const desserts = dishes.filter((d) => d.course === "dessert");

  return (
    <main className="mx-auto w-full max-w-[1120px] px-6 py-16">
      <div className="text-center">
        <p className="font-display text-sm text-chilli">The Kitchen</p>
        <h1 className="mt-2 font-display text-4xl text-ink">
          Seven dishes, one family table
        </h1>
        <p className="mx-auto mt-3 max-w-md text-ink-soft">
          Passed down through generations, carrying ancient knowledge of
          what&apos;s traditionally cooked in Kashmiri Pandit homes.
        </p>
      </div>

      <section className="mt-16">
        <SectionBanner title="Starters" />
        <div className="mt-6">
          <DishGrid dishes={starters} />
        </div>
      </section>

      <section className="mt-16">
        <SectionBanner title="Mains, with rice" />
        <div className="mt-6 flex flex-col gap-8">
          <div>
            <p className="mb-3 text-sm font-semibold text-ink-soft">
              Vegetarian
            </p>
            <DishGrid dishes={mainsVeg} />
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-ink-soft">
              Non-vegetarian
            </p>
            <DishGrid dishes={mainsNonVeg} />
          </div>
        </div>
      </section>

      <section className="mt-16">
        <SectionBanner title="Dessert" note="Kong Phirin" />
        <div className="mt-6">
          <DishGrid dishes={desserts} />
        </div>
      </section>
    </main>
  );
}

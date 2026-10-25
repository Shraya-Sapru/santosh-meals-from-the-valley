import Link from "next/link";
import { Button } from "@/components/Button";
import { PhotoSlot } from "@/components/PhotoSlot";
import { SeatCounter } from "@/components/SeatCounter";
import { listPublicEvents, seatsRemaining, type EventRecord } from "@/lib/booking";
import { getRecipe, getPhotoUrl } from "@/lib/pipeline/store";
import { DISH_TONE, MEAL_ORDER, PHOTO_SLOT } from "@/lib/dishTheme";
import type { DishSlug } from "@/lib/schema/recipe";

export const metadata = {
  title: "This Weekend — Santosh",
};

const CHIP_TONE_CLASSES: Record<(typeof DISH_TONE)[DishSlug], string> = {
  lotus: "bg-lotus text-ink",
  cardamom: "bg-cardamom text-ink",
  saffron: "bg-saffron text-ink",
  almond: "bg-almond text-ink",
  chilli: "bg-chilli text-rice",
};

function orderedMenu(menu: string[]): DishSlug[] {
  return MEAL_ORDER.filter((slug) => menu.includes(slug));
}

function EventCard({ event }: { event: EventRecord }) {
  const remaining = seatsRemaining(event);
  const isFull = remaining <= 0;
  const dishes = orderedMenu(event.menu)
    .map((slug) => getRecipe(slug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));
  const photoDishes = dishes.slice(0, 5);

  return (
    <div className="overflow-hidden rounded-panel bg-almond/30">
      <div className="grid grid-cols-3 gap-1.5 p-1.5 sm:grid-cols-5 sm:gap-2 sm:p-2">
        {photoDishes.map((dish) => (
          <PhotoSlot
            key={dish.slug}
            id={PHOTO_SLOT[dish.slug as DishSlug]}
            label={dish.name}
            tone={DISH_TONE[dish.slug as DishSlug]}
            src={getPhotoUrl(PHOTO_SLOT[dish.slug as DishSlug])}
            aspect="square"
          />
        ))}
      </div>

      <div className="flex flex-col gap-5 p-6 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-2xl text-ink">
            {new Date(event.date).toLocaleDateString("en-IN", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h2>
          <p className="text-sm text-ink-soft">
            {event.startTime} · ₹{event.priceInr.toLocaleString("en-IN")} per
            seat
          </p>
        </div>

        <ul className="flex flex-wrap gap-2 text-sm">
          {dishes.map((dish) => (
            <li key={dish.slug}>
              <Link
                href={`/kitchen/${dish.slug}`}
                className={`rounded-full px-3 py-1 transition-opacity hover:opacity-80 ${
                  CHIP_TONE_CLASSES[DISH_TONE[dish.slug as DishSlug]]
                }`}
              >
                {dish.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <SeatCounter seatCap={event.seatCap} remaining={remaining} />
          <Button href={`/book/${event.id}`}>
            {isFull ? "Join the waitlist" : "Reserve a seat"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ThisWeekendPage() {
  const events = listPublicEvents();

  return (
    <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-10 px-6 py-16">
      <div>
        <p className="font-display text-sm text-chilli">This weekend</p>
        <h1 className="mt-2 font-display text-4xl text-ink">
          Join us at the table
        </h1>
        <p className="mt-3 max-w-[560px] text-[17px] text-ink-soft">
          A few seats, a fixed Kashmiri Pandit menu, cooked at home. Pick an
          evening below to reserve your seat.
        </p>
      </div>

      {events.length === 0 ? (
        <p className="rounded-panel bg-almond/30 p-8 text-center text-ink-soft">
          No evening is open for booking just yet — check back soon.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-6 rounded-panel bg-lotus/40 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h2 className="font-display text-xl text-ink">What to expect</h2>
          <p className="mt-2 max-w-[520px] text-[15px] text-ink-soft">
            Everyone is seated together and the meal is served family-style
            — come hungry, this is a full, slow-cooked table. The exact
            address is shared once your seat is confirmed.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-1 text-sm">
          <p className="text-ink">
            <span className="font-semibold">Where</span>{" "}
            <span className="text-ink-soft">Yelahanka, Bangalore</span>
          </p>
          <p className="text-ink">
            <span className="font-semibold">Email</span>{" "}
            <span className="text-ink-soft">meals@santosh.com</span>
          </p>
        </div>
      </div>
    </main>
  );
}

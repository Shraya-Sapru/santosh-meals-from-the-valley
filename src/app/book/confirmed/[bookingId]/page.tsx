import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button";
import { getBooking, getEvent } from "@/lib/booking";
import { getRecipe } from "@/lib/pipeline/store";
import { MEAL_ORDER } from "@/lib/dishTheme";

export const metadata = {
  title: "Seat reserved — Santosh",
};

export default async function BookingConfirmedPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId: bookingIdParam } = await params;
  const bookingId = Number(bookingIdParam);
  const booking = Number.isFinite(bookingId) ? getBooking(bookingId) : undefined;
  if (!booking || booking.status !== "confirmed") notFound();

  const event = getEvent(booking.eventId);
  if (!event) notFound();

  const menu = MEAL_ORDER.filter((slug) => event.menu.includes(slug))
    .map((slug) => getRecipe(slug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-col gap-8 px-6 py-16">
      <div className="rounded-panel bg-cardamom/40 p-6 text-center sm:p-10">
        <p className="font-display text-sm text-chilli">Seat reserved</p>
        <h1 className="mt-2 font-display text-3xl text-ink">
          See you {booking.seats > 1 ? "all" : ""} at the table
        </h1>
        <p className="mt-2 text-[17px] text-ink-soft">
          {new Date(event.date).toLocaleDateString("en-IN", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}{" "}
          · {event.startTime}
        </p>
      </div>

      <div className="rounded-panel bg-almond/30 p-6 sm:p-8">
        <h2 className="font-display text-xl text-ink">Booking summary</h2>
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <dt className="text-ink-soft">Name</dt>
          <dd className="text-ink">{booking.name}</dd>
          <dt className="text-ink-soft">Seats</dt>
          <dd className="text-ink">{booking.seats}</dd>
          {booking.vegOnly && (
            <>
              <dt className="text-ink-soft">Dietary</dt>
              <dd className="text-ink">Vegetarian only</dd>
            </>
          )}
          {booking.dietaryNotes && (
            <>
              <dt className="text-ink-soft">Notes</dt>
              <dd className="text-ink">{booking.dietaryNotes}</dd>
            </>
          )}
          <dt className="text-ink-soft">Paid</dt>
          <dd className="text-ink">
            ₹{(event.priceInr * booking.seats).toLocaleString("en-IN")} (test
            mode)
          </dd>
          <dt className="text-ink-soft">Reference</dt>
          <dd className="text-ink">{booking.paymentRef}</dd>
        </dl>
      </div>

      <div className="rounded-panel bg-saffron/30 p-6 sm:p-8">
        <h2 className="font-display text-xl text-ink">On the menu</h2>
        <ul className="mt-3 flex flex-col gap-1 text-sm">
          {menu.map((dish) => (
            <li key={dish.slug}>
              <Link
                href={`/kitchen/${dish.slug}`}
                className="text-chilli underline underline-offset-2"
              >
                {dish.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-panel bg-lotus/40 p-6 sm:p-8">
        <h2 className="font-display text-xl text-ink">What to expect</h2>
        <p className="mt-2 text-[15px] text-ink-soft">
          Arrive a few minutes before {event.startTime} — we seat everyone
          together and the meal is served family-style. Come hungry; this is
          a full, slow-cooked table.
        </p>
        <p className="mt-4 text-sm text-ink-soft">
          <span className="font-semibold text-ink">Address</span> · 412, 7th
          Cross, Yelahanka, Bangalore 560064. The exact gate and parking
          instructions are shared by phone the day before.
        </p>
      </div>

      <Button href="/kitchen" variant="secondary" className="self-start">
        Read the dish stories before you come
      </Button>
    </main>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button";
import {
  MAX_SEATS_PER_BOOKING,
  getBooking,
  getEvent,
  seatsRemaining,
} from "@/lib/booking";
import { getRecipe } from "@/lib/pipeline/store";
import { MEAL_ORDER } from "@/lib/dishTheme";
import { createBookingAction, confirmPaymentAction, joinWaitlistAction } from "./actions";

export const metadata = {
  title: "Reserve a seat — Santosh",
};

const ERROR_COPY: Record<string, string> = {
  full: "That evening filled up while you were booking. Join the waitlist instead, or pick another date.",
  invalid: "Please fill in your name and email, and choose at least one seat.",
  expired: "That hold expired after 10 minutes. Please book again.",
};

function formatEventDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default async function BookEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ bookingId?: string; error?: string; waitlisted?: string }>;
}) {
  const { eventId: eventIdParam } = await params;
  const { bookingId: bookingIdParam, error, waitlisted } = await searchParams;
  const eventId = Number(eventIdParam);
  const event = Number.isFinite(eventId) ? getEvent(eventId) : undefined;
  if (!event) notFound();

  const menu = MEAL_ORDER.filter((slug) => event.menu.includes(slug))
    .map((slug) => getRecipe(slug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  const remaining = seatsRemaining(event);
  const isFull = remaining <= 0;

  const bookingId = bookingIdParam ? Number(bookingIdParam) : undefined;
  const pendingBooking =
    bookingId && Number.isFinite(bookingId) ? getBooking(bookingId) : undefined;

  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-col gap-8 px-6 py-16">
      <div>
        <p className="font-display text-sm text-chilli">Reserve a seat</p>
        <h1 className="mt-2 font-display text-3xl text-ink">
          {formatEventDate(event.date)}
        </h1>
        <p className="mt-1 text-[17px] text-ink-soft">
          {event.startTime} · ₹{event.priceInr.toLocaleString("en-IN")} per
          seat
        </p>
        <ul className="mt-3 flex flex-wrap gap-2 text-sm text-ink-soft">
          {menu.map((dish) => (
            <li key={dish.slug} className="rounded-full bg-almond/40 px-3 py-1">
              {dish.name}
            </li>
          ))}
        </ul>
      </div>

      {error && ERROR_COPY[error] && (
        <p className="rounded-panel bg-lotus/50 p-4 text-sm text-ink">
          {ERROR_COPY[error]}
        </p>
      )}

      {waitlisted ? (
        <div className="rounded-panel bg-cardamom/40 p-6">
          <h2 className="font-display text-xl text-ink">
            You&apos;re on the waitlist
          </h2>
          <p className="mt-2 text-sm text-ink-soft">
            We&apos;ll reach out by email if a seat opens up for this
            evening.
          </p>
          <Button href="/this-weekend" variant="secondary" className="mt-4">
            Back to this weekend
          </Button>
        </div>
      ) : pendingBooking && pendingBooking.eventId === event.id ? (
        pendingBooking.status === "pending_payment" ? (
          <div className="flex flex-col gap-5 rounded-panel bg-almond/30 p-6 sm:p-8">
            <h2 className="font-display text-xl text-ink">
              Review and pay
            </h2>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-ink-soft">Name</dt>
              <dd className="text-ink">{pendingBooking.name}</dd>
              <dt className="text-ink-soft">Email</dt>
              <dd className="text-ink">{pendingBooking.email}</dd>
              <dt className="text-ink-soft">Seats</dt>
              <dd className="text-ink">{pendingBooking.seats}</dd>
              {pendingBooking.vegOnly && (
                <>
                  <dt className="text-ink-soft">Dietary</dt>
                  <dd className="text-ink">Vegetarian only</dd>
                </>
              )}
              <dt className="text-ink-soft">Total</dt>
              <dd className="text-ink">
                ₹{(event.priceInr * pendingBooking.seats).toLocaleString("en-IN")}
              </dd>
            </dl>
            <p className="text-xs text-ink-soft">
              Your seats are held for 10 minutes. This is a test-mode
              payment — no real charge is made.
            </p>
            <form
              action={confirmPaymentAction.bind(null, event.id, pendingBooking.id)}
            >
              <Button type="submit" className="w-full sm:w-auto">
                Pay and confirm (test mode)
              </Button>
            </form>
          </div>
        ) : (
          <p className="rounded-panel bg-lotus/50 p-4 text-sm text-ink">
            That hold is no longer active.{" "}
            <Link href={`/book/${event.id}`} className="underline">
              Start again
            </Link>
            .
          </p>
        )
      ) : isFull ? (
        <form
          action={joinWaitlistAction.bind(null, event.id)}
          className="flex flex-col gap-4 rounded-panel bg-almond/30 p-6 sm:p-8"
        >
          <h2 className="font-display text-xl text-ink">Join the waitlist</h2>
          <p className="text-sm text-ink-soft">
            This evening is fully booked. Leave your details and we&apos;ll
            reach out if a seat opens up.
          </p>
          <label className="flex flex-col gap-1 text-sm text-ink">
            Name
            <input
              name="name"
              required
              className="rounded-input border border-almond bg-rice px-3 py-2 text-ink"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink">
            Email
            <input
              name="email"
              type="email"
              required
              className="rounded-input border border-almond bg-rice px-3 py-2 text-ink"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink">
            Seats wanted
            <select
              name="seats"
              defaultValue={2}
              className="rounded-input border border-almond bg-rice px-3 py-2 text-ink"
            >
              {Array.from({ length: MAX_SEATS_PER_BOOKING }, (_, i) => i + 1).map(
                (n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                )
              )}
            </select>
          </label>
          <Button type="submit" className="w-full sm:w-auto">
            Join the waitlist
          </Button>
        </form>
      ) : (
        <form
          action={createBookingAction.bind(null, event.id)}
          className="flex flex-col gap-4 rounded-panel bg-almond/30 p-6 sm:p-8"
        >
          <p className="text-sm text-ink-soft">
            {remaining} of {event.seatCap} seats left
          </p>
          <label className="flex flex-col gap-1 text-sm text-ink">
            Name
            <input
              name="name"
              required
              className="rounded-input border border-almond bg-rice px-3 py-2 text-ink"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink">
            Email
            <input
              name="email"
              type="email"
              required
              className="rounded-input border border-almond bg-rice px-3 py-2 text-ink"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink">
            Phone (optional)
            <input
              name="phone"
              type="tel"
              className="rounded-input border border-almond bg-rice px-3 py-2 text-ink"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink">
            Seats
            <select
              name="seats"
              defaultValue={Math.min(2, remaining)}
              className="rounded-input border border-almond bg-rice px-3 py-2 text-ink"
            >
              {Array.from(
                { length: Math.min(MAX_SEATS_PER_BOOKING, remaining) },
                (_, i) => i + 1
              ).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="vegOnly" className="h-4 w-4" />
            Vegetarian only for our table (we&apos;ll skip the non-veg main)
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink">
            Dietary notes or allergies (optional)
            <textarea
              name="dietaryNotes"
              rows={2}
              className="rounded-input border border-almond bg-rice px-3 py-2 text-ink"
            />
          </label>
          <Button type="submit" className="w-full sm:w-auto">
            Continue
          </Button>
        </form>
      )}
    </main>
  );
}

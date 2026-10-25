import { listAllEvents, bookedSeats, listWaitlist } from "@/lib/booking";
import { listRecipes, getRecipe } from "@/lib/pipeline/store";
import { MEAL_ORDER } from "@/lib/dishTheme";
import { createEventAction } from "./actions";

export const metadata = {
  title: "Events — Santosh admin",
};

export default function AdminEventsPage() {
  const events = listAllEvents();
  const approvedSlugs = new Set(
    listRecipes()
      .filter((r) => r.status === "approved")
      .map((r) => r.slug)
  );
  const approvedDishes = MEAL_ORDER.filter((slug) => approvedSlugs.has(slug))
    .map((slug) => getRecipe(slug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  return (
    <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-10 px-6 py-12">
      <h1 className="font-display text-3xl text-ink">Events</h1>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl text-ink">Upcoming and past</h2>
        {events.length === 0 ? (
          <p className="text-sm text-ink-soft">No events yet.</p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-almond text-left text-ink-soft">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Time</th>
                <th className="py-2 pr-4">Seats</th>
                <th className="py-2 pr-4">Price</th>
                <th className="py-2 pr-4">Menu</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Waitlist</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => {
                const booked = bookedSeats(event.id);
                const waitlist = listWaitlist(event.id);
                const dishNames = event.menu
                  .map((slug) => getRecipe(slug)?.name ?? slug)
                  .join(", ");
                return (
                  <tr key={event.id} className="border-b border-almond/60">
                    <td className="py-2 pr-4 text-ink">{event.date}</td>
                    <td className="py-2 pr-4 text-ink">{event.startTime}</td>
                    <td className="py-2 pr-4 text-ink">
                      {booked} / {event.seatCap}
                    </td>
                    <td className="py-2 pr-4 text-ink">
                      ₹{event.priceInr.toLocaleString("en-IN")}
                    </td>
                    <td className="py-2 pr-4 text-ink-soft">{dishNames}</td>
                    <td className="py-2 pr-4 text-ink">{event.status}</td>
                    <td className="py-2 pr-4 text-ink-soft">
                      {waitlist.length > 0 ? `${waitlist.length} waiting` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      <section className="flex flex-col gap-4 rounded-panel bg-almond/30 p-6 sm:p-8">
        <h2 className="font-display text-xl text-ink">Create an event</h2>
        {approvedDishes.length === 0 ? (
          <p className="text-sm text-ink-soft">
            No approved dishes yet — approve recipes in the pipeline first.
          </p>
        ) : (
          <form action={createEventAction} className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4">
              <label className="flex flex-col gap-1 text-sm text-ink">
                Date
                <input
                  type="date"
                  name="date"
                  required
                  className="rounded-input border border-almond bg-rice px-3 py-2 text-ink"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-ink">
                Start time
                <input
                  type="time"
                  name="startTime"
                  defaultValue="19:30"
                  required
                  className="rounded-input border border-almond bg-rice px-3 py-2 text-ink"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-ink">
                Seat cap
                <input
                  type="number"
                  name="seatCap"
                  defaultValue={8}
                  min={1}
                  required
                  className="rounded-input border border-almond bg-rice px-3 py-2 text-ink"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-ink">
                Price per seat (₹)
                <input
                  type="number"
                  name="priceInr"
                  defaultValue={1800}
                  min={0}
                  required
                  className="rounded-input border border-almond bg-rice px-3 py-2 text-ink"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-ink">
                Status
                <select
                  name="status"
                  defaultValue="open"
                  className="rounded-input border border-almond bg-rice px-3 py-2 text-ink"
                >
                  <option value="draft">Draft (hidden)</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </label>
            </div>

            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm text-ink">Menu</legend>
              <div className="flex flex-wrap gap-3">
                {approvedDishes.map((dish) => (
                  <label
                    key={dish.slug}
                    className="flex items-center gap-2 rounded-full bg-rice px-3 py-1.5 text-sm text-ink"
                  >
                    <input
                      type="checkbox"
                      name="menu"
                      value={dish.slug}
                      defaultChecked={
                        dish.course !== "main" || dish.slug === "rogan-josh"
                      }
                    />
                    {dish.name}
                  </label>
                ))}
              </div>
            </fieldset>

            <button
              type="submit"
              className="self-start rounded-full bg-chilli px-5 py-2.5 text-[15px] font-semibold text-rice"
            >
              Create event
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

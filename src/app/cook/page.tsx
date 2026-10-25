import { notFound } from "next/navigation";
import { CookGame } from "@/components/cook/CookGame";
import { getRecipe, getPhotoUrl } from "@/lib/pipeline/store";
import { PHOTO_SLOT } from "@/lib/dishTheme";
import { listPublicEvents, seatsRemaining } from "@/lib/booking";

export const metadata = {
  title: "Cook with Maej — Santosh",
};

export default function CookPage() {
  const recipe = getRecipe("rogan-josh");
  if (!recipe || recipe.status !== "approved") notFound();

  const event = listPublicEvents()[0];
  const nextEvent = event
    ? {
        eventId: event.id,
        date: event.date,
        startTime: event.startTime,
        seatsLeft: seatsRemaining(event),
        seatCap: event.seatCap,
        onMenu: event.menu.includes("rogan-josh"),
      }
    : null;

  return (
    <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-10 px-6 py-16">
      <div className="text-center">
        <p className="font-display text-sm text-chilli">Cook with Maej</p>
        <h1 className="mt-2 font-display text-4xl text-ink">
          Make {recipe.name} yourself
        </h1>
      </div>

      <div className="rounded-panel bg-almond/20 p-6 sm:p-12">
        <CookGame
          recipe={recipe}
          photoUrl={getPhotoUrl(PHOTO_SLOT["rogan-josh"])}
          nextEvent={nextEvent}
        />
      </div>
    </main>
  );
}

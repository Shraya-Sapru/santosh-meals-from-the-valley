"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/Button";
import { MaejTip } from "@/components/MaejTip";
import { HoldToFill } from "./HoldToFill";
import { TapToAdd } from "./TapToAdd";
import { PotVisual } from "./PotVisual";
import { Confetti } from "./Confetti";
import { SoundToggle } from "./SoundToggle";
import { mechanicFor, computeVerdict } from "@/lib/cookSim";
import { blendHex } from "@/lib/color";
import { playCelebration } from "@/lib/sound";
import { stripMarkdown } from "@/lib/text";
import type { ExtractedRecipe, Step } from "@/lib/schema/recipe";

type NextEvent = {
  eventId: number;
  date: string;
  startTime: string;
  seatsLeft: number;
  seatCap: number;
  onMenu: boolean;
} | null;

type Phase = "intro" | "method" | "playing" | "verdict";

const SAFFRON = "#F7E1AE";
const CHILLI = "#9E3B47";

function buildSequence(recipe: ExtractedRecipe, method: "handi" | "pressure"): Step[] {
  const variant = recipe.variants[0];
  if (method !== "pressure" || !variant) return recipe.steps;
  const replaceIds = new Set(variant.replacesStepIds);
  const out: Step[] = [];
  for (const s of recipe.steps) {
    if (replaceIds.has(s.id)) {
      out.push(...variant.steps);
    } else {
      out.push(s);
    }
  }
  return out;
}

export function CookGame({
  recipe,
  photoUrl,
  nextEvent,
}: {
  recipe: ExtractedRecipe;
  photoUrl?: string;
  nextEvent: NextEvent;
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [method, setMethod] = useState<"handi" | "pressure">("handi");
  const [index, setIndex] = useState(0);
  const [nudge, setNudge] = useState<string | null>(null);
  const [cleanHolds, setCleanHolds] = useState(0);
  const [holdSteps, setHoldSteps] = useState(0);

  const sequence = useMemo(() => buildSequence(recipe, method), [recipe, method]);
  const step = sequence[index];
  const ingredientsById = useMemo(
    () => new Map(recipe.ingredients.map((i) => [i.id, i])),
    [recipe.ingredients]
  );

  const gravyColor = blendHex(SAFFRON, CHILLI, sequence.length ? index / sequence.length : 0);

  useEffect(() => {
    if (phase === "verdict") playCelebration();
  }, [phase]);

  function advance() {
    setNudge(null);
    if (index + 1 >= sequence.length) {
      setPhase("verdict");
    } else {
      setIndex(index + 1);
    }
  }

  function handleHoldComplete(releasedEarly: boolean) {
    setHoldSteps((n) => n + 1);
    if (releasedEarly) {
      setNudge(
        step.warning
          ? stripMarkdown(step.warning)
          : "A little rushed — Maej would slow down here."
      );
    } else {
      setCleanHolds((n) => n + 1);
    }
    advance();
  }

  if (phase === "intro") {
    return (
      <div className="relative flex flex-col items-center gap-6 text-center">
        <div className="absolute right-0 top-0">
          <SoundToggle />
        </div>
        <p className="max-w-md text-[17px] leading-relaxed text-ink-soft">
          Step into Maej&apos;s kitchen and cook {recipe.name} yourself —
          the same order, the same cues, as the real recipe. Sear, temper,
          and simmer your way through {recipe.steps.length} real steps.
        </p>
        <Button type="button" onClick={() => setPhase("method")}>
          Start cooking
        </Button>
      </div>
    );
  }

  if (phase === "method") {
    const variant = recipe.variants[0];
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="text-[17px] text-ink-soft">
          How will you cook it tonight?
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setMethod("handi");
              setPhase("playing");
            }}
            className="rounded-panel bg-almond/40 p-6 text-left shadow-soft transition-transform hover:-translate-y-1 sm:w-56"
          >
            <p className="font-display text-xl text-ink">Handi</p>
            <p className="mt-1 text-sm text-ink-soft">
              The traditional pan, covered and simmered slowly.
            </p>
          </button>
          {variant && (
            <button
              type="button"
              onClick={() => {
                setMethod("pressure");
                setPhase("playing");
              }}
              className="rounded-panel bg-saffron/40 p-6 text-left shadow-soft transition-transform hover:-translate-y-1 sm:w-56"
            >
              <p className="font-display text-xl text-ink">{variant.name}</p>
              <p className="mt-1 text-sm text-ink-soft">
                Faster, with the whistles doing the work.
              </p>
            </button>
          )}
        </div>
      </div>
    );
  }

  if (phase === "verdict") {
    const scorePct = holdSteps > 0 ? Math.round((cleanHolds / holdSteps) * 100) : 100;
    const verdict = computeVerdict(scorePct);
    return (
      <div className="relative flex flex-col items-center gap-6 text-center">
        <div className="absolute right-0 top-0">
          <SoundToggle />
        </div>
        <Confetti />
        <PotVisual gravyColor={CHILLI} className="h-28 w-40 animate-verdict-in" />
        <h3 className="animate-verdict-in font-display text-2xl text-ink">{verdict.title}</h3>
        <p className="max-w-md text-[17px] text-ink-soft">{verdict.message}</p>

        {photoUrl && (
          <div className="relative h-48 w-48 overflow-hidden rounded-photo">
            <Image src={photoUrl} alt={recipe.name} fill className="object-cover" />
          </div>
        )}

        <div className="flex flex-col items-center gap-3 rounded-panel bg-saffron/30 p-6">
          {nextEvent ? (
            <>
              <p className="text-sm text-ink-soft">
                {nextEvent.onMenu
                  ? "Rogan Josh is on the menu this weekend"
                  : "Rogan Josh returns another weekend"}
              </p>
              <p className="font-display text-xl text-ink">
                {new Date(nextEvent.date).toLocaleDateString("en-IN", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}{" "}
                · {nextEvent.startTime}
              </p>
              <p className="text-sm text-ink-soft">
                {nextEvent.seatsLeft} seats left
              </p>
            </>
          ) : (
            <p className="text-sm text-ink-soft">No evening on the menu yet.</p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button href={nextEvent ? `/book/${nextEvent.eventId}` : "/this-weekend"}>
              Reserve a seat
            </Button>
            <Button href={`/kitchen/${recipe.slug}`} variant="secondary">
              Read the dish story
            </Button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setPhase("method");
            setIndex(0);
            setCleanHolds(0);
            setHoldSteps(0);
            setNudge(null);
          }}
          className="text-sm text-ink-soft underline"
        >
          Cook it again
        </button>
      </div>
    );
  }

  // playing
  const mechanic = mechanicFor(step);
  const ingredients = step.ingredientIds
    .map((id) => ingredientsById.get(id))
    .filter((i): i is NonNullable<typeof i> => Boolean(i));

  return (
    <div className="relative flex flex-col items-center gap-6">
      <div className="absolute right-0 top-0">
        <SoundToggle />
      </div>
      <PotVisual
        gravyColor={gravyColor}
        simmering={mechanic === "hold"}
        className="h-24 w-36"
      />

      <div className="text-center">
        <p className="text-xs text-ink-soft">
          Step {index + 1} of {sequence.length} · {step.phase}
        </p>
        <p className="mt-2 max-w-md font-display text-xl text-ink sm:text-2xl">
          {stripMarkdown(step.action)}
        </p>
      </div>

      <div className="flex min-h-[160px] items-center justify-center">
        {mechanic === "hold" && (
          <HoldToFill
            key={step.id}
            label={step.sensoryCue ? `Hold — ${stripMarkdown(step.sensoryCue)}` : "Hold"}
            onComplete={handleHoldComplete}
          />
        )}
        {mechanic === "add" && (
          <TapToAdd key={step.id} ingredients={ingredients} onComplete={advance} />
        )}
        {mechanic === "plate" && (
          <button
            type="button"
            onClick={advance}
            className="rounded-full bg-chilli px-8 py-4 text-base font-semibold text-rice"
          >
            Plate it
          </button>
        )}
      </div>

      {nudge && <MaejTip tone="saffron">{nudge}</MaejTip>}
    </div>
  );
}

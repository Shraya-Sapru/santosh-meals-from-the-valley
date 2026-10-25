import type { InteractionType, Step } from "@/lib/schema/recipe";

export type Mechanic = "hold" | "add" | "plate";

/**
 * Every interaction type the extraction pipeline can produce maps to one
 * of three generic, data-driven mechanics — never a bespoke mini-game per
 * step. This is a deliberate scope choice (see docs/SPEC.md § 7) so the
 * simulation stays entirely driven by the approved step data: change a
 * step's text or interaction and the game changes with it, with no
 * hard-coded recipe content in this file.
 */
const MECHANIC_BY_INTERACTION: Record<InteractionType, Mechanic> = {
  heat_hold: "hold",
  cool_wait: "hold",
  cover_simmer: "hold",
  rest: "hold",
  pressure_whistles: "hold",
  slow_pour_with_stir: "hold",
  pour_water: "hold",
  drop_in: "add",
  crush_then_drop: "add",
  stir: "add",
  stir_high_heat: "add",
  sprinkle_stir: "add",
  gentle_stir: "add",
  timed_add: "add",
  heat_dial: "add",
  batter_dip: "add",
  deep_fry: "hold",
  pierce: "add",
  steep: "hold",
  strain: "add",
  plate: "plate",
  none: "add",
};

export function mechanicFor(step: Step): Mechanic {
  return MECHANIC_BY_INTERACTION[step.interaction];
}

export type Verdict = {
  title: string;
  message: string;
};

export function computeVerdict(scorePct: number): Verdict {
  if (scorePct >= 85) {
    return {
      title: "Maej says: just like home.",
      message:
        "Steady hands, good patience — this Rogan Josh would pass muster at the Santosh table.",
    };
  }
  if (scorePct >= 55) {
    return {
      title: "Maej says: a fair first try.",
      message:
        "A few rushed moments, but the bones of a good Rogan Josh are there. Play it again to get the timing right.",
    };
  }
  return {
    title: "Maej says: back to the pan.",
    message:
      "Kashmiri cooking rewards patience — slow down on the next try, especially with the yoghurt.",
  };
}

"use client";

import { useCallback, useEffect, useState } from "react";
import type { Step } from "@/lib/schema/recipe";
import { MaejTip } from "./MaejTip";
import { stripMarkdown } from "@/lib/text";

type StepBookProps = {
  steps: Step[];
};

function StepPage({
  step,
  pageNumber,
  total,
}: {
  step: Step;
  pageNumber: number;
  total: number;
}) {
  return (
    <div className="flex h-full w-full overflow-hidden rounded-panel shadow-soft">
      {/* spine / binding edge */}
      <div className="relative hidden w-4 shrink-0 bg-chilli sm:block">
        <div className="absolute inset-y-0 left-1 w-px bg-rice/20" />
        <div className="absolute inset-y-0 left-2.5 w-px bg-rice/20" />
      </div>

      <div className="relative flex min-w-0 flex-1 flex-col justify-between overflow-y-auto bg-rice p-6 sm:p-10">
        {/* gutter shadow, as if the page meets the binding */}
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-10 bg-gradient-to-r from-ink/10 to-transparent sm:block" />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 -top-6 font-display text-[140px] leading-none text-ink/5 sm:text-[180px]"
        >
          {pageNumber}
        </span>
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-chilli px-3 py-1 text-xs font-semibold text-rice">
              {step.phase}
            </span>
            <span className="text-xs text-ink-soft">
              Step {pageNumber} of {total}
            </span>
          </div>
          <p className="mt-5 font-display text-2xl leading-snug text-ink sm:text-3xl">
            {stripMarkdown(step.action)}
          </p>
          {step.sensoryCue && (
            <p className="mt-3 text-sm italic text-ink-soft">
              Look for: {stripMarkdown(step.sensoryCue)}
            </p>
          )}
        </div>
        <div className="relative mt-6 flex flex-col gap-3">
          {step.warning && (
            <MaejTip tone="saffron">{stripMarkdown(step.warning)}</MaejTip>
          )}
          <div className="flex flex-wrap gap-2 text-xs text-ink-soft">
            {step.heat !== "unspecified" && (
              <span className="rounded-full bg-almond/50 px-3 py-1">
                Heat: {step.heat}
              </span>
            )}
            {step.duration && (
              <span className="rounded-full bg-almond/50 px-3 py-1">
                {step.duration}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function StepBook({ steps }: StepBookProps) {
  const [index, setIndex] = useState(0);
  const [flip, setFlip] = useState<"next" | "prev" | null>(null);
  const [flipStep, setFlipStep] = useState<Step | null>(null);
  const total = steps.length;

  const goTo = useCallback(
    (target: number) => {
      if (flip || target === index || target < 0 || target >= total) return;
      setFlipStep(steps[index]);
      setFlip(target > index ? "next" : "prev");
      window.setTimeout(() => {
        setIndex(target);
        setFlip(null);
        setFlipStep(null);
      }, 600);
    },
    [flip, index, steps, total]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goTo(index + 1);
      if (e.key === "ArrowLeft") goTo(index - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, index]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full max-w-xl items-center gap-3">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          aria-label="Previous step"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink transition-opacity hover:bg-almond/40 disabled:opacity-20"
        >
          ←
        </button>

        <div
          className="relative h-[660px] w-full sm:h-[540px]"
          style={{ perspective: "1200px" }}
        >
          {/* a hint of pages stacked beneath, peeking out on the open edge */}
          <div className="absolute inset-y-1 left-2 right-0 -z-10 translate-x-2 rounded-panel bg-almond/70" />
          <div className="absolute inset-y-0.5 left-1 right-0 -z-10 translate-x-1 rounded-panel bg-almond/90" />

          <div className="absolute inset-0">
            <StepPage step={steps[index]} pageNumber={index + 1} total={total} />
          </div>
          {flip && flipStep && (
            <div
              className="flip-page absolute inset-0"
              style={{
                transformOrigin:
                  flip === "next" ? "left center" : "right center",
                animation: `${
                  flip === "next" ? "page-flip-next" : "page-flip-prev"
                } 0.6s ease-in-out forwards`,
              }}
            >
              <StepPage step={flipStep} pageNumber={index + 1} total={total} />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={index === total - 1}
          aria-label="Next step"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink transition-opacity hover:bg-almond/40 disabled:opacity-20"
        >
          →
        </button>
      </div>

      <div className="flex max-w-xl flex-wrap items-center justify-center gap-2">
        {steps.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to step ${i + 1}`}
            aria-current={i === index}
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
              i === index
                ? "bg-chilli text-rice"
                : "bg-almond/50 text-ink-soft hover:bg-almond"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

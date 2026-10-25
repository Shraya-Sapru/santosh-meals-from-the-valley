"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { playSizzle, playTap } from "@/lib/sound";

type HoldToFillProps = {
  label: string;
  durationMs?: number;
  onComplete: (releasedEarly: boolean) => void;
};

/**
 * Press and hold the button; a ring fills over `durationMs`. Releasing
 * early resets the ring and reports it, so the caller can nudge with the
 * step's own warning/sensory cue rather than any hard-coded copy here.
 */
export function HoldToFill({ label, durationMs = 4000, onComplete }: HoldToFillProps) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const startRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const sizzleRef = useRef<number | null>(null);

  const stop = useCallback((completedEarly: boolean) => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    if (sizzleRef.current) window.clearInterval(sizzleRef.current);
    sizzleRef.current = null;
    startRef.current = null;
    if (!completedEarly) {
      setProgress(0);
    }
  }, []);

  const tickRef = useRef<() => void>(() => {});
  useEffect(() => {
    tickRef.current = () => {
      if (startRef.current === null) return;
      const elapsed = performance.now() - startRef.current;
      const pct = Math.min(100, (elapsed / durationMs) * 100);
      setProgress(pct);
      if (pct >= 100) {
        setDone(true);
        stop(true);
        playTap();
        onComplete(false);
        return;
      }
      frameRef.current = requestAnimationFrame(() => tickRef.current());
    };
  }, [durationMs, onComplete, stop]);

  const start = useCallback(() => {
    if (done) return;
    startRef.current = performance.now();
    frameRef.current = requestAnimationFrame(() => tickRef.current());
    playSizzle();
    sizzleRef.current = window.setInterval(playSizzle, 240);
  }, [done]);

  const release = useCallback(() => {
    if (done) return;
    if (progress > 0 && progress < 100) {
      onComplete(true);
    }
    stop(false);
  }, [done, onComplete, progress, stop]);

  useEffect(() => () => stop(false), [stop]);

  const size = 120;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - progress / 100);
  const secondsLeft = Math.max(1, Math.ceil((durationMs * (1 - progress / 100)) / 1000));

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        aria-label={label}
        onPointerDown={start}
        onPointerUp={release}
        onPointerLeave={release}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") start();
        }}
        onKeyUp={(e) => {
          if (e.key === " " || e.key === "Enter") release();
        }}
        className={`relative flex h-[120px] w-[120px] select-none items-center justify-center rounded-full bg-rice shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chilli ${
          done ? "animate-ingredient-pop" : ""
        }`}
        style={{ touchAction: "none" }}
      >
        <svg width={size} height={size} className="absolute inset-0 -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--color-almond)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--color-chilli)"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: progress === 0 ? "stroke-dashoffset 0.2s ease" : "none" }}
          />
        </svg>
        <span
          className={`relative font-semibold text-ink ${
            progress > 0 && !done ? "font-display text-3xl" : "text-sm"
          }`}
        >
          {done ? "Done" : progress > 0 ? secondsLeft : "Hold"}
        </span>
      </button>
      <p className="max-w-[220px] text-center text-sm text-ink-soft">{label}</p>
    </div>
  );
}

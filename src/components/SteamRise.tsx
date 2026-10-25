type SteamRiseProps = {
  /** CSS colour the wisps fade in from — pick one that reads against the background behind it. */
  color?: string;
  className?: string;
};

const WISPS = [
  { left: "42%", delay: "0s" },
  { left: "50%", delay: "1.6s" },
  { left: "58%", delay: "3.1s" },
];

/**
 * A quiet, looping steam/aroma motif for otherwise-empty background space —
 * never the main focal motion on the page. Respects prefers-reduced-motion
 * globally (see globals.css).
 */
export function SteamRise({ color = "var(--color-rice)", className = "" }: SteamRiseProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-16 overflow-visible ${className}`}
    >
      {WISPS.map((w, i) => (
        <span
          key={i}
          className="steam-wisp"
          style={{ left: w.left, animationDelay: w.delay, background: `linear-gradient(to top, ${color}, transparent)` }}
        />
      ))}
    </div>
  );
}

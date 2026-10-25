type PotVisualProps = {
  /** A CSS colour for the gravy — the caller decides how it evolves with the recipe's real steps. */
  gravyColor: string;
  /** Shows rising steam wisps for heating/simmering-type steps. */
  simmering?: boolean;
  className?: string;
};

const STEAM_WISPS = [
  { left: "38%", delay: "0s" },
  { left: "50%", delay: "0.9s" },
  { left: "62%", delay: "1.8s" },
];

/** A simple karahi, so there's something to watch change as the steps progress. */
export function PotVisual({ gravyColor, simmering = false, className = "" }: PotVisualProps) {
  return (
    <div className={`relative ${className}`}>
      {simmering && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-10 h-10 overflow-visible"
        >
          {STEAM_WISPS.map((w, i) => (
            <span
              key={i}
              className="steam-wisp"
              style={{
                left: w.left,
                animationDelay: w.delay,
                height: "32px",
                width: "7px",
                background: "linear-gradient(to top, var(--color-ink-soft), transparent)",
                opacity: 0.5,
              }}
            />
          ))}
        </div>
      )}
      <svg viewBox="0 0 200 140" className="h-full w-full" role="img" aria-label="The cooking pot">
        <ellipse cx="100" cy="60" rx="86" ry="44" fill={gravyColor} style={{ transition: "fill 0.6s ease" }} />
        <ellipse cx="100" cy="58" rx="86" ry="40" fill="none" stroke="var(--color-ink)" strokeWidth="2" opacity="0.08" />
        <path
          d="M14 60 C14 100 186 100 186 60 L180 100 a90 20 0 0 1-160 0 Z"
          fill="var(--color-ink)"
        />
        <ellipse cx="100" cy="60" rx="86" ry="44" fill="none" stroke="var(--color-ink)" strokeWidth="6" />
        <rect x="2" y="54" width="18" height="8" rx="4" fill="var(--color-ink)" />
        <rect x="180" y="54" width="18" height="8" rx="4" fill="var(--color-ink)" />
      </svg>
    </div>
  );
}

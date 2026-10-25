const COLORS = [
  "var(--color-chilli)",
  "var(--color-saffron)",
  "var(--color-lotus)",
  "var(--color-cardamom)",
];

const PIECES = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  delay: `${(i % 6) * 0.08}s`,
  color: COLORS[i % COLORS.length],
  rotate: (i * 53) % 360,
}));

/** A one-shot confetti burst for the verdict screen. Purely decorative. */
export function Confetti() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-40 overflow-hidden"
    >
      {PIECES.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: p.left,
            animationDelay: p.delay,
            background: p.color,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

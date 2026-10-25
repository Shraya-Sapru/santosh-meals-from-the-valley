type SantoshIconProps = {
  className?: string;
};

/**
 * Brand mark: a woman wearing dejhoor (the thread-and-pendant earring
 * Kashmiri Pandit women wear), with a content, fulfilled expression —
 * the feeling "Santosh" names. First pass, stylised rather than literal;
 * happy to refine the dejhoor shape or styling on feedback.
 */
export function SantoshIcon({ className = "" }: SantoshIconProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="Santosh — a woman wearing dejhoor, smiling"
    >
      <circle cx="100" cy="100" r="92" fill="var(--color-lotus)" />

      {/* head group scaled up to fill more of the badge */}
      <g transform="translate(100 100) scale(1.15) translate(-100 -100)">
      {/* hair — fuller volume, soft wave at the ends */}
      <path
        d="M100 38
           C 68 38, 48 65, 46 100
           C 45 128, 49 152, 57 172
           C 62 168, 60 158, 63 148
           C 65 142, 63 134, 63 118
           C 63 74, 78 50, 100 50
           C 122 50, 137 74, 137 118
           C 137 134, 135 142, 137 148
           C 140 158, 138 168, 143 172
           C 151 152, 155 128, 154 100
           C 152 65, 132 38, 100 38 Z"
        fill="var(--color-ink)"
      />
      {/* a touch of shine, so the hair doesn't read as a flat silhouette */}
      <path
        d="M70 56 Q 85 44, 100 46"
        stroke="var(--color-almond)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.35"
      />

      {/* face — soft oval */}
      <ellipse cx="100" cy="114" rx="41" ry="53" fill="var(--color-almond)" />

      {/* dejhoor — left */}
      <path
        d="M70 104 C 63 112, 61 122, 63 132"
        stroke="var(--color-chilli)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="63" cy="138" r="6" fill="var(--color-saffron)" stroke="var(--color-chilli)" strokeWidth="1.5" />

      {/* dejhoor — right */}
      <path
        d="M130 104 C 137 112, 139 122, 137 132"
        stroke="var(--color-chilli)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="137" cy="138" r="6" fill="var(--color-saffron)" stroke="var(--color-chilli)" strokeWidth="1.5" />

      {/* cheeks */}
      <circle cx="79" cy="128" r="9" fill="var(--color-chilli)" opacity="0.12" />
      <circle cx="121" cy="128" r="9" fill="var(--color-chilli)" opacity="0.12" />

      {/* eyes — closed, content */}
      <path
        d="M80 104 Q 88 98, 95 104"
        stroke="var(--color-ink)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M105 104 Q 112 98, 120 104"
        stroke="var(--color-ink)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* smile — a touch warmer */}
      <path
        d="M83 133 Q 100 150, 117 133"
        stroke="var(--color-ink)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      </g>
    </svg>
  );
}

type Shape =
  | "meat"
  | "oil"
  | "heeng"
  | "cardamom"
  | "cinnamon"
  | "clove"
  | "leaf"
  | "chilli"
  | "seeds"
  | "ginger"
  | "powder"
  | "yogurt"
  | "lotusStem"
  | "water"
  | "milk"
  | "saffron"
  | "teaLeaf"
  | "nut"
  | "potato"
  | "sprig";

type Rule = { test: RegExp; shape: Shape; tone: string };

const INK = "var(--color-ink)";
const CHILLI = "var(--color-chilli)";

/**
 * Ordered keyword rules — first match wins. Matched against the
 * ingredient's name + localName (lowercased). Falls back to a generic
 * sprig icon for anything unmatched, so every ingredient still gets a
 * small illustrated mark (docs/SPEC.md's illustration palette only).
 */
const RULES: Rule[] = [
  { test: /mutton|lamb|goat/, shape: "meat", tone: CHILLI },
  { test: /mustard oil|ghee|\boil\b/, shape: "oil", tone: "var(--color-saffron)" },
  { test: /asafoetida|heeng|hing/, shape: "heeng", tone: "var(--color-almond)" },
  { test: /cardamom/, shape: "cardamom", tone: "var(--color-cardamom)" },
  { test: /cinnamon/, shape: "cinnamon", tone: "var(--color-almond)" },
  { test: /clove/, shape: "clove", tone: INK },
  { test: /bay leaf|tej patta|mint/, shape: "leaf", tone: "var(--color-cardamom)" },
  { test: /kashmiri.*(chilli|chily|chili)/, shape: "chilli", tone: CHILLI },
  { test: /fennel|saunf|cumin|caraway|jeera|ajwain|carrom/, shape: "seeds", tone: "var(--color-saffron)" },
  { test: /ginger|sonth|soonth/, shape: "ginger", tone: "var(--color-saffron)" },
  { test: /rice flour|semolina|sugar|\bsalt\b|garam masala/, shape: "powder", tone: "var(--color-chilli)" },
  { test: /yoghurt|yogurt|curd/, shape: "yogurt", tone: "var(--color-rice)" },
  { test: /lotus stem|nadru/, shape: "lotusStem", tone: "var(--color-almond)" },
  { test: /\bwater\b/, shape: "water", tone: "var(--color-cardamom)" },
  { test: /\bmilk\b/, shape: "milk", tone: "var(--color-rice)" },
  { test: /saffron/, shape: "saffron", tone: CHILLI },
  { test: /tea leaves|green tea/, shape: "teaLeaf", tone: "var(--color-cardamom)" },
  { test: /almond|pistachio|nut/, shape: "nut", tone: "var(--color-almond)" },
  { test: /potato/, shape: "potato", tone: "var(--color-saffron)" },
];

function resolve(name: string, localName?: string): Rule {
  const haystack = `${name} ${localName ?? ""}`.toLowerCase();
  for (const rule of RULES) {
    if (rule.test.test(haystack)) return rule;
  }
  return { test: /.*/, shape: "sprig", tone: "var(--color-cardamom)" };
}

function Shape({ shape, tone }: { shape: Shape; tone: string }) {
  switch (shape) {
    case "meat":
      return (
        <path
          d="M8 20 Q6 10 16 8 Q26 6 24 16 Q22 26 12 24 Q7 23 8 20 Z M22 8 L27 3"
          fill={tone}
          stroke={INK}
          strokeWidth="1.2"
        />
      );
    case "oil":
      return (
        <path
          d="M16 6 C20 12 24 17 24 21 a8 8 0 1 1-16 0c0-4 4-9 8-15Z"
          fill={tone}
          stroke={INK}
          strokeWidth="1.2"
        />
      );
    case "heeng":
      return <rect x="9" y="12" width="14" height="10" rx="2" fill={tone} stroke={INK} strokeWidth="1.2" />;
    case "cardamom":
      return <ellipse cx="16" cy="16" rx="8" ry="6" fill={tone} stroke={INK} strokeWidth="1.2" />;
    case "cinnamon":
      return (
        <g fill="none" stroke={INK} strokeWidth="1.3">
          <rect x="6" y="10" width="20" height="12" rx="6" fill={tone} />
          <path d="M11 10 C14 14 14 18 11 22 M21 10c3 4 3 8 0 12" />
        </g>
      );
    case "clove":
      return (
        <path
          d="M16 6 v10 M16 16 q-5 2-5 8 q5 3 10 0 q0-6-5-8Z"
          fill={tone}
          stroke={INK}
          strokeWidth="1.3"
        />
      );
    case "leaf":
      return (
        <path
          d="M16 6 C24 10 24 22 16 26 C8 22 8 10 16 6 Z M16 6 V26"
          fill={tone}
          stroke={INK}
          strokeWidth="1.2"
        />
      );
    case "chilli":
      return (
        <path
          d="M10 8 q6-3 4 3 q10 2 8 12 q-2 8-12 6 q-8-2-6-10 q1-6 6-11Z"
          fill={tone}
          stroke={INK}
          strokeWidth="1.2"
        />
      );
    case "seeds":
      return (
        <g fill={tone} stroke={INK} strokeWidth="0.8">
          <ellipse cx="11" cy="14" rx="3" ry="1.6" transform="rotate(-20 11 14)" />
          <ellipse cx="18" cy="12" rx="3" ry="1.6" transform="rotate(10 18 12)" />
          <ellipse cx="14" cy="19" rx="3" ry="1.6" transform="rotate(-10 14 19)" />
          <ellipse cx="21" cy="19" rx="3" ry="1.6" transform="rotate(25 21 19)" />
        </g>
      );
    case "ginger":
      return (
        <path
          d="M8 18 Q6 10 14 9 Q22 8 24 14 Q26 20 19 22 Q11 24 8 18Z"
          fill={tone}
          stroke={INK}
          strokeWidth="1.2"
        />
      );
    case "powder":
      return (
        <g>
          <path d="M8 22 Q16 14 24 22 Z" fill={tone} stroke={INK} strokeWidth="1.2" />
          <circle cx="13" cy="19" r="0.9" fill={INK} />
          <circle cx="17" cy="17" r="0.9" fill={INK} />
          <circle cx="20" cy="20" r="0.9" fill={INK} />
        </g>
      );
    case "yogurt":
      return (
        <path
          d="M10 10 h12 l-2 14 a4 4 0 0 1-8 0 Z"
          fill={tone}
          stroke={INK}
          strokeWidth="1.2"
        />
      );
    case "lotusStem":
      return (
        <g stroke={INK} strokeWidth="1.1">
          <circle cx="16" cy="16" r="10" fill={tone} />
          <circle cx="12" cy="13" r="1.6" fill="var(--color-rice)" />
          <circle cx="19" cy="12" r="1.6" fill="var(--color-rice)" />
          <circle cx="21" cy="18" r="1.6" fill="var(--color-rice)" />
          <circle cx="14" cy="19" r="1.6" fill="var(--color-rice)" />
          <circle cx="17" cy="20" r="1.6" fill="var(--color-rice)" />
        </g>
      );
    case "water":
      return (
        <path
          d="M16 6 C21 13 25 18 25 22 a9 9 0 1 1-18 0c0-4 4-9 9-16Z"
          fill={tone}
          stroke={INK}
          strokeWidth="1.2"
        />
      );
    case "milk":
      return (
        <path d="M13 6 h6 l1 4 2 4 v10 a2 2 0 0 1-2 2 h-8 a2 2 0 0 1-2-2 V14 l2-4Z" fill={tone} stroke={INK} strokeWidth="1.2" />
      );
    case "saffron":
      return (
        <g stroke={tone} strokeWidth="2" strokeLinecap="round" fill="none">
          <path d="M11 10 q2 8 1 14" />
          <path d="M16 8 q1 9 0 16" />
          <path d="M21 10 q-2 8-1 14" />
        </g>
      );
    case "teaLeaf":
      return (
        <path
          d="M16 7 C9 9 8 17 13 23 C19 24 25 18 23 11 C21 8 18 7 16 7Z M16 7 C17 13 18 18 13 23"
          fill={tone}
          stroke={INK}
          strokeWidth="1.1"
        />
      );
    case "nut":
      return <ellipse cx="16" cy="16" rx="7" ry="9" fill={tone} stroke={INK} strokeWidth="1.2" />;
    case "potato":
      return <ellipse cx="16" cy="17" rx="10" ry="7" fill={tone} stroke={INK} strokeWidth="1.2" />;
    case "sprig":
    default:
      return (
        <path
          d="M16 24 V10 M16 10 q-6 0-6 6 M16 14 q6 0 6-6"
          fill="none"
          stroke={INK}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      );
  }
}

export function IngredientIcon({
  name,
  localName,
  className = "h-10 w-10",
}: {
  name: string;
  localName?: string;
  className?: string;
}) {
  const { shape, tone } = resolve(name, localName);
  return (
    <svg viewBox="0 0 32 32" className={className} role="img" aria-label={name}>
      <circle cx="16" cy="16" r="15" fill="var(--color-lotus)" opacity="0.5" />
      <Shape shape={shape} tone={tone} />
    </svg>
  );
}

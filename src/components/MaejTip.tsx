import type { ReactNode } from "react";

type MaejTipProps = {
  children: ReactNode;
  tone?: "saffron" | "lotus";
};

/** A source warning or sensory cue, in Maej's voice. Never used for body copy. */
export function MaejTip({ children, tone = "saffron" }: MaejTipProps) {
  const bg = tone === "saffron" ? "bg-saffron" : "bg-lotus";
  return (
    <div
      className={`flex items-start gap-3 rounded-panel ${bg} px-4 py-3 shadow-soft`}
    >
      <span aria-hidden="true" className="mt-0.5 text-lg">
        🥄
      </span>
      <p className="font-handwritten text-lg leading-snug text-ink">
        {children}
      </p>
    </div>
  );
}

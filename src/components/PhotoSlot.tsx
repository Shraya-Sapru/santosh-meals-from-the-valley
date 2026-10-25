import Image from "next/image";

type DishTone = "lotus" | "cardamom" | "saffron" | "almond" | "chilli";

const toneClasses: Record<DishTone, string> = {
  lotus: "bg-lotus",
  cardamom: "bg-cardamom",
  saffron: "bg-saffron",
  almond: "bg-almond",
  chilli: "bg-chilli text-rice",
};

type PhotoSlotProps = {
  id: string;
  label: string;
  tone?: DishTone;
  src?: string | null;
  alt?: string;
  aspect?: "square" | "landscape" | "wide";
  className?: string;
  /** Force the "photo coming soon" note on in production admin screens. */
  showNote?: boolean;
  /** "cover" fills the frame (may crop); "contain" always shows the whole photo, letterboxed on the tone colour. */
  fit?: "cover" | "contain";
  /** Small overlay label — used to mark the rare non-owner-supplied reference photo (see CLAUDE.md rule 4). */
  caption?: string;
};

const aspectClasses: Record<NonNullable<PhotoSlotProps["aspect"]>, string> = {
  square: "aspect-square",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/9]",
};

/**
 * Placeholder for a user-supplied photo. Never render stock or AI-generated
 * "photos" here — only real photos uploaded by the owner (see docs/SPEC.md
 * § Photo requests) or this pastel placeholder.
 */
export function PhotoSlot({
  id,
  label,
  tone = "lotus",
  src,
  alt,
  aspect = "landscape",
  className = "",
  showNote = false,
  fit = "cover",
  caption,
}: PhotoSlotProps) {
  if (src) {
    return (
      <div
        className={`relative overflow-hidden rounded-photo ${
          fit === "contain" ? toneClasses[tone] : ""
        } ${aspectClasses[aspect]} ${className}`}
      >
        <Image
          src={src}
          alt={alt ?? label}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className={fit === "contain" ? "object-contain" : "object-cover"}
        />
        {caption && (
          <span className="absolute bottom-2 left-2 rounded-full bg-ink/70 px-2.5 py-1 text-[11px] text-rice">
            {caption}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      data-photo-slot={id}
      className={`flex flex-col items-center justify-center gap-2 rounded-photo text-center ${toneClasses[tone]} ${aspectClasses[aspect]} ${className}`}
    >
      <span className="font-display text-2xl">{label}</span>
      {(process.env.NODE_ENV === "development" || showNote) && (
        <span className="text-xs text-ink-soft">
          Photo coming soon · slot {id}
        </span>
      )}
    </div>
  );
}

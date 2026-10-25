import Link from "next/link";
import { PhotoSlot } from "./PhotoSlot";
import type { DishSlug } from "@/lib/schema/recipe";
import { DISH_TONE, PHOTO_SLOT } from "@/lib/dishTheme";
import { stripMarkdown } from "@/lib/text";

type DishCardProps = {
  slug: DishSlug;
  name: string;
  description: string;
  course: "starter" | "main" | "dessert";
  photoUrl?: string;
};

export function DishCard({ slug, name, description, course, photoUrl }: DishCardProps) {
  return (
    <Link
      href={`/kitchen/${slug}`}
      className="group flex flex-col gap-2 rounded-panel bg-almond/30 p-3 transition-transform hover:-translate-y-1"
    >
      <PhotoSlot
        id={PHOTO_SLOT[slug]}
        label={name}
        tone={DISH_TONE[slug]}
        src={photoUrl}
        aspect="square"
      />
      <div>
        <p className="text-xs text-ink-soft">{course}</p>
        <h3 className="font-display text-xl text-ink group-hover:text-chilli">
          {name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink-soft">
          {stripMarkdown(description)}
        </p>
      </div>
    </Link>
  );
}

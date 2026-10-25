"use client";

import { useEffect, useState } from "react";
import { IngredientIcon } from "@/components/IngredientIcon";
import { playTap } from "@/lib/sound";
import type { Ingredient } from "@/lib/schema/recipe";

type TapToAddProps = {
  ingredients: Ingredient[];
  onComplete: () => void;
};

/** Tap each ingredient chip to drop it in; completes once every one is tapped. */
export function TapToAdd({ ingredients, onComplete }: TapToAddProps) {
  const [added, setAdded] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (ingredients.length > 0 && added.size === ingredients.length) {
      const timer = window.setTimeout(onComplete, 350);
      return () => window.clearTimeout(timer);
    }
  }, [added, ingredients.length, onComplete]);

  if (ingredients.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => {
            playTap();
            onComplete();
          }}
          className="rounded-full bg-chilli px-6 py-3 text-sm font-semibold text-rice"
        >
          Stir it in
        </button>
      </div>
    );
  }

  function tap(id: string) {
    playTap();
    setAdded((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {ingredients.map((ing) => {
        const isAdded = added.has(ing.id);
        return (
          <button
            key={ing.id}
            type="button"
            onClick={() => tap(ing.id)}
            disabled={isAdded}
            className={`flex flex-col items-center gap-2 rounded-panel p-3 transition-all ${
              isAdded
                ? "scale-90 bg-cardamom/40 opacity-50 animate-ingredient-pop"
                : "bg-rice shadow-soft hover:-translate-y-0.5"
            }`}
          >
            <IngredientIcon name={ing.name} localName={ing.localName} className="h-12 w-12" />
            <span className="max-w-[100px] text-center text-xs text-ink-soft">
              {isAdded ? "Added" : ing.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

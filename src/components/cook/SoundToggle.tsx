"use client";

import { useSyncExternalStore } from "react";
import { isSoundEnabled, setSoundEnabled, subscribeSoundEnabled } from "@/lib/sound";

function getServerSnapshot() {
  return false;
}

export function SoundToggle() {
  const enabled = useSyncExternalStore(
    subscribeSoundEnabled,
    isSoundEnabled,
    getServerSnapshot
  );

  return (
    <button
      type="button"
      onClick={() => setSoundEnabled(!enabled)}
      aria-pressed={enabled}
      className="inline-flex items-center gap-1.5 rounded-full border border-almond bg-rice px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:text-ink"
    >
      <span aria-hidden="true">{enabled ? "🔊" : "🔈"}</span>
      {enabled ? "Sound on" : "Sound off"}
    </button>
  );
}

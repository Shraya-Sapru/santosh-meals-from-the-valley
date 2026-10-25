"use client";

/**
 * Small synthesised sound-effect kit for Cook with Maej (SPEC § 7.4: optional
 * royalty-free effects, muted by default). Generated with the Web Audio API
 * rather than shipped audio files, so there's nothing to license or download.
 */

const STORAGE_KEY = "santosh-cook-sound";

const listeners = new Set<() => void>();

export function subscribeSoundEnabled(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

let audioCtx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  type WindowWithWebkitAudio = Window & { webkitAudioContext?: typeof AudioContext };
  const Ctor = window.AudioContext || (window as WindowWithWebkitAudio).webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx) audioCtx = new Ctor();
  if (audioCtx.state === "suspended") void audioCtx.resume();
  return audioCtx;
}

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "on";
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
  if (enabled) getContext();
  listeners.forEach((listener) => listener());
}

function tone(
  freq: number,
  duration: number,
  { type = "sine" as OscillatorType, gain = 0.15, delay = 0 } = {}
) {
  const ctx = getContext();
  if (!ctx || !isSoundEnabled()) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const start = ctx.currentTime + delay;
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(gain, start + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function noiseBurst(duration: number, { freq = 2800, gain = 0.1 } = {}) {
  const ctx = getContext();
  if (!ctx || !isSoundEnabled()) return;
  const size = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < size; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / size);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = freq;
  const g = ctx.createGain();
  g.gain.value = gain;
  noise.connect(filter);
  filter.connect(g);
  g.connect(ctx.destination);
  noise.start();
}

/** A light tap/pop — ingredient dropped into the pot. */
export function playTap(): void {
  tone(720, 0.09, { type: "triangle", gain: 0.16 });
}

/** One sizzle tick — looped by the caller while a hold is in progress. */
export function playSizzle(): void {
  noiseBurst(0.12, { freq: 3400, gain: 0.08 });
}

/** A cupboard-door "thunk" for release/retry feedback. */
export function playThud(): void {
  tone(160, 0.14, { type: "sine", gain: 0.18 });
}

/** Warm ascending chime for the verdict screen. */
export function playCelebration(): void {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => tone(freq, 0.4, { type: "triangle", gain: 0.16, delay: i * 0.11 }));
}

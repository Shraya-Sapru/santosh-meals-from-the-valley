# Santosh — Meals from the Valley

Project memory for Claude Code. Read this file at the start of every session, then read `docs/SPEC.md` (full product and design spec) before writing code.

## What we are building

Santosh is a Kashmiri Pandit home supper club in Bangalore, run on weekends with a small number of seats. The web app has three layers that share one data model:

1. **The Table** — weekend menu, reservations with a seat cap, payments (test mode), admin dashboard.
2. **The Recipe-to-Story Engine** — an AI pipeline that turns the owner's mother's recipe document into structured, source-linked recipe data, illustrated step-by-step food stories, a Spice DNA map, and a Red vs White comparison.
3. **Cook with Maej** — an interactive browser simulation of Mutton Rogan Josh, driven by the approved structured data.

The experience loop is: discover the food → cook it virtually → book a seat to taste it.

This is a final project for an AI class (Tier 3 target). The AI pipeline and the simulation are the core; the booking layer should be solid but simple.

## Non-negotiable rules

1. **The recipes are the source of truth.** `source/recipes.md` (verbatim from `source/Kashmiri_Food.docx`) defines every dish, ingredient, quantity, step order, timing, and cue. Never add, remove, reorder, or "improve" recipe facts. If something needed is missing, ask the user. Do not fill gaps with general knowledge.
2. **Kashmiri Pandit cuisine only.** No onion, garlic, or tomato anywhere: not in recipes, copy, illustrations, or generated images. The only exception is the explicitly labelled decoy items in the Cook with Maej pantry step. No content about other Kashmiri culinary traditions.
3. **Food only.** Content stays on dishes, ingredients, techniques, and the meal. No broader cultural, historical, or political content beyond what the source document states.
4. **Photos come from the user.** Never use stock photos, and never use AI-generated images presented as photos of real dishes. Use the `<PhotoSlot id="...">` placeholder component and ask the user for the specific photo listed in `docs/SPEC.md` § Photo requests. Ask once per build phase, as a single consolidated list.
5. **No video or audio of the owner's mother.** Never ask for videos, voice recordings, or narration. Motion comes from illustrations, CSS, canvas, and Lottie. Sound is optional royalty-free kitchen effects (sizzle, crackle, simmer), muted by default.
6. **Open questions block their features.** Items in `docs/SPEC.md` § Open questions must be answered by the user before implementing the feature they affect. Ask; don't assume a default silently.
7. **AI output is never published unreviewed.** Every extracted step keeps its `sourceText`. Every generated story sentence keeps a source reference. Content goes live only after approval in the admin review screen.
8. **Booking "payment" is a mock in test mode only.** No real payment gateway. Secrets live in `.env`/`.env.local` and are never committed. Keep `.env.example` up to date.
9. **Stay inside the design system.** Use only the tokens in `docs/SPEC.md` § Design system. Do not introduce new colours, fonts, shadows, or radii without asking.
10. **Course key rules override generic AI-project conventions for this submission.** Use `PORTKEY_API_KEY` with model `gpt-6-luna` (OpenAI-compatible call through Portkey) as the default LLM path, or the user's own `OPENAI_API_KEY` if they opt in. Never introduce a third key name (no `ANTHROPIC_API_KEY`, no Supabase/Razorpay/email-provider keys) — the grading staff's `.env` contains only `PORTKEY_API_KEY` and `OPENAI_API_KEY`, checked first in this repo's own folder, then in the folder above it.

## Stack (revised — no external paid services, so a fresh clone runs in minutes with one key)

- Next.js (App Router) + TypeScript (strict) + Tailwind CSS v4, with design tokens defined as CSS variables
- Embedded SQLite (`better-sqlite3`) instead of Supabase — real transactional seat-cap locking, zero external service, file lives in `data/santosh.db` (gitignored, seeded by a script)
- Zod for every schema (extraction output, API inputs, forms)
- LLM calls go through `src/lib/llm.ts`, an OpenAI-SDK client pointed at Portkey (`base_url: https://api.portkey.ai/v1`, header `x-portkey-provider: openai`, model `gpt-6-luna`) using `PORTKEY_API_KEY`, or directly via `OPENAI_API_KEY` if the user supplies one — never the Anthropic SDK
- `IllustrationProvider` interface with a hand-built SVG/CSS `manual` style-set implementation (no paid image-gen API) — same interface, so a real provider could be swapped in later
- PixiJS for the Cook with Maej simulation; CSS/Canvas for small effects; Howler.js for optional sound
- Booking "payment" is a mock test-mode confirmation (no Razorpay); confirmation is shown on-screen (no transactional email provider)
- Admin auth is a single shared password gate via env var (`ADMIN_PASSWORD`), not Supabase Auth
- Deploy on Vercel (optional — local run must also work standalone within 10 minutes)

## Folder conventions

```
source/            Source recipes (read-only for code; never edited by the app)
docs/              SPEC.md and project notes
src/app/           Routes (see SPEC § Site map)
src/components/    UI components, including PhotoSlot, MaejTip, DishCard
src/lib/pipeline/  Ingestion, extraction, validators, story drafting, illustration
src/lib/schema/    Zod schemas shared by pipeline, UI, and simulation
src/sim/           Cook with Maej engine (PixiJS) and step mechanics
content/           Approved, versioned JSON exported from review (dishes, photos registry)
public/photos/     User-supplied photos, named by PhotoSlot id
scripts/           CLI tools: run pipeline, run evaluation
```

## Working style

- Build in the phases listed in `docs/SPEC.md` § Build plan. At the end of each phase, check the acceptance criteria, summarise what was done, list any photos or answers needed for the next phase, and wait for the user before continuing.
- Keep copy in sentence case, plain and warm. See SPEC § Voice and copy.
- Mobile first. Respect `prefers-reduced-motion`. Every drag interaction needs a tap or keyboard alternative.
- When unsure whether something is in the source document, search `source/recipes.md` before writing it.

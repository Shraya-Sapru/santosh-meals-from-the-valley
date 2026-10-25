# Santosh — Meals from the Valley

A Kashmiri Pandit home supper club: an AI pipeline turns a family recipe
document into verified, source-linked dish stories, an interactive
simulation teaches you to cook the signature dish, and a simple booking
flow turns that into a real seat at the table.

Full product spec: [`docs/SPEC.md`](docs/SPEC.md). Build conventions for
contributors (including AI coding agents): [`CLAUDE.md`](CLAUDE.md).

**MGT 409 final project submission:** [`report.html`](report.html) and
[`slides.html`](slides.html) — both self-contained, open by double-click.

## Run it locally

Requirements: Node.js 20.9+ (tested on Node 24).

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up your `.env`. Copy `.env.example` to `.env` and fill in
   `PORTKEY_API_KEY` (course key — the app uses model `gpt-6-luna` through
   Portkey automatically). If grading staff have their own `.env` one
   folder above this repo, no local `.env` is needed — the app checks
   there automatically.

   ```bash
   cp .env.example .env
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open http://localhost:3000. A sample upcoming event is seeded
   automatically into a local SQLite database at `data/santosh.db` on
   first run — no separate setup step needed.

5. Admin screens live under `/admin` (recipe pipeline, events, photos).
   Default password: `santosh-kitchen` (override with `ADMIN_PASSWORD` in
   `.env` for a real deployment — not required to run the app).

6. To see the recipe AI pipeline run: log in at `/admin/login`, go to
   `/admin/recipes`, and click **Run all 7** (takes under a minute, calls
   the LLM once per dish). Then open **Review** on any dish to see the
   source-vs-extracted comparison, flags, and the Approve gate.

No other service accounts or API keys are required: booking "payment" is
a mock test-mode confirmation, illustrations are a hand-built local set,
and there is no external database or email provider to configure.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS v4, an embedded SQLite
database (`better-sqlite3`, no external service), and an LLM pipeline
that calls `gpt-6-luna` through Portkey (or your own `OPENAI_API_KEY`).
See [`docs/SPEC.md`](docs/SPEC.md) for the full design system, data
model, and build plan.

## Status

- **Phase 0 (Foundation):** done — design system, layout shell, local
  database, admin login, home page.
- **Phase 1 (Recipe pipeline):** done — ingest → segment → extract
  (`gpt-6-luna`) → validate → review → approve, for all 7 dishes. Admin
  screens at `/admin/recipes` and `/admin/review/[slug]`. Run `npm test`
  for the validator unit tests and the Spice DNA fixture check.
- **Next:** dish story pages, Cook with Maej simulation, and booking flow
  — see `docs/SPEC.md` § Build plan.

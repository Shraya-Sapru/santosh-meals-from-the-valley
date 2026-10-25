# Santosh — Product and Design Spec

Name: **Santosh**
Tagline: **Meals from the Valley**
Cuisine: Kashmiri Pandit only
Source of truth: `source/recipes.md` (verbatim from `source/Kashmiri_Food.docx`)

---

## 1. Product overview

Santosh is a weekend home supper club in Bangalore serving Kashmiri Pandit food, with very few restaurants offering it locally. The site has three jobs: tell the story of the food, build the Santosh brand, and take bookings.

| Layer | Name | Purpose | Tier contribution |
|---|---|---|---|
| 1 | The Table | Menu, reservations, payments, admin | Tier 1 foundation |
| 2 | The Recipe-to-Story Engine | AI pipeline: recipe document → structured data → illustrated stories and visualisations | Tier 2 |
| 3 | Cook with Maej | Interactive Rogan Josh simulation built from the structured data | Tier 3 |

All three layers read from one data model. The simulation ends with a booking prompt, closing the loop: discover → cook → book.

---

## 2. Source content (summary — always read the source itself)

### Philosophy (brand story)
From the document: Kashmiri Pandit cuisine is rooted in Shaivite traditions and Sattvic principles (in conformity with Ayurveda). The kitchen skips onions, garlic, and tomatoes for both vegetarian and non-vegetarian dishes. It relies on a signature quartet: asafoetida (heeng), dried ginger powder (sonth), fennel powder (saunf), and Kashmiri red chilli. The practice emphasises purity, slow simmering, and specific spice combinations. Non-vegetarian dishes historically used lamb or goat, and fish.

### Dishes (seven recipes)

| Slug | Dish | Course | Type | One-line description (from source) |
|---|---|---|---|---|
| `nadur-monje` | Nadur Monje (lotus stem fritters) | Starter | Veg | Crushed lotus stem in rice flour batter, fried in mustard oil, served with Kehwa |
| `kehwa` | Kehwa | Starter (drink) | Veg | Light, golden-amber green tea with cardamom, cinnamon, saffron, almonds; served to guests as a symbol of hospitality |
| `rogan-josh` | Rogan Josh | Main | Non-veg | Rich, bright red curry flavoured with fennel, ginger, asafoetida, yogurt, and whole spices |
| `mutton-yakhni` | Mutton Yakhni | Main | Non-veg | Rich yogurt-based mutton gravy with no turmeric or red chilli |
| `dum-aaloo` | Kashmiri Dum Aaloo | Main | Veg | The most popular vegetarian dish; slow cooked in a spiced yogurt gravy |
| `nadru-yakhni` | Nadru Yakhni (lotus stem curry) | Main | Veg | Yogurt-based curry with tender lotus stem; golden, creamy, light on the stomach |
| `kong-phirin` | Kong Phirin | Dessert | Veg | Creamy golden saffron semolina pudding, prepared during festivals and family celebrations |

All mains are served with steamed rice (stated in the source for each). The source ends with a "Compiled/Presented by" credit line — resolved: not shown publicly anywhere on the site.

---

## 3. Site map and routes

| Route | Page | Purpose |
|---|---|---|
| `/` | Home | Brand, tagline, this weekend, entry points to cook and book |
| `/kitchen` | The Kitchen | Library of the seven dishes in meal order |
| `/kitchen/[slug]` | Dish story | Illustrated scroll story of one dish |
| `/cook` | Cook with Maej | Rogan Josh simulation |
| `/this-weekend` | This Weekend | Menu, dates, seats left |
| `/book/[eventId]` | Reserve | Booking form and payment |
| `/book/confirmed/[bookingId]` | Confirmation | Booking summary |
| `/admin` | Admin home | Upcoming events, bookings |
| `/admin/recipes` | Recipe pipeline | Upload, run extraction, see status per dish |
| `/admin/review/[slug]` | Review | Side-by-side source vs extracted, approve or correct |
| `/admin/events` | Events | Create weekend evenings, set seats and menu |
| `/admin/photos` | Photos | PhotoSlot registry and upload status |

Primary navigation: The Kitchen, Cook with Maej, This Weekend, plus a persistent "Reserve a seat" button.

**Cut for this submission:** the standalone Pantry page (§ 6.9 Spice DNA map, § 6.10 Red vs White) — scope is limited to the three pathways (The Kitchen, Cook with Maej, This Weekend/booking) given the project deadline. The Spice DNA computation logic (`src/lib/pipeline/spiceDna.ts`) and its passing fixture test stay in the repo as evidence of the approach, just without a page displaying it.

---

## 4. Design system — look and feel

### 4.1 Direction
Elegant, calm, and pastel. The palette is drawn from the food itself, softened into pastels: lotus stem, cardamom, saffron, almond, and the red of Kashmiri chilli. It should feel like a quiet, generous home table: plenty of space, soft colour, beautiful type, and real photos of the real food. Spend boldness in one place: the illustrated step storyboards and the Cook with Maej simulation. Everything around them stays restrained.

Avoid: warm cream backgrounds with terracotta accents, dark mode with neon accents, identical rounded cards everywhere, gradient washes, ALL-CAPS eyebrow labels, arrows appended to button text, and stock "Indian restaurant" decoration (paisley borders, gold foil, mandalas).

### 4.2 Colour tokens

| Token | Hex | Name | Use |
|---|---|---|---|
| `--rice` | `#FAFAF7` | Rice | Page background |
| `--lotus` | `#F2D7D9` | Lotus | Soft surface, veg dishes, highlights |
| `--cardamom` | `#D3E3CF` | Cardamom | Soft surface, Kehwa, success states |
| `--saffron` | `#F7E1AE` | Saffron | Soft surface, Dum Aaloo, Kong Phirin, sim heat glow |
| `--almond` | `#ECE1D3` | Almond | Dividers, Yakhni dishes, input backgrounds |
| `--chilli` | `#9E3B47` | Chilli | The single deep accent: primary buttons, Rogan Josh, focus rings |
| `--ink` | `#2F3B36` | Ink | Body text and headings (deep cardamom-green, not black) |
| `--ink-soft` | `#5E6B65` | Soft ink | Secondary text, captions |

Rules:
- Text is always `--ink` or `--ink-soft` on pastel surfaces, or `--rice` on `--chilli`. Check WCAG AA contrast for every pairing.
- `--chilli` is used sparingly: one primary action per screen, plus Rogan Josh accents.
- Pastels are used as large calm fields, never as small saturated details.

Dish colour mapping (used for dish pages, cards, and Spice DNA rows):

| Dish | Token |
|---|---|
| Rogan Josh | `--chilli` (accent) with `--lotus` surface |
| Mutton Yakhni | `--almond` |
| Dum Aaloo | `--saffron` |
| Nadru Yakhni | `--lotus` |
| Nadur Monje | `--saffron` |
| Kehwa | `--cardamom` |
| Kong Phirin | `--saffron` |

### 4.3 Typography

| Role | Typeface (Google Fonts) | Notes |
|---|---|---|
| Display and headings | Gloock | High-contrast elegant serif. Use large and generously spaced for dish names and the wordmark. |
| Body and UI | Nunito Sans | Soft humanist sans; pairs with the pastel palette. Body 17–18px, line-height 1.6. |
| Maej's Tips only | Kalam | Handwritten feel for kitchen tips and warnings. Never for body text. |

- Wordmark: "Santosh" set in Gloock; tagline "Meals from the Valley" in Nunito Sans, sentence case, `--ink-soft`.
- Type scale (approx.): 56 / 40 / 28 / 21 / 18 / 15px. Line length under 70 characters for reading text.
- Sentence case everywhere. No all-caps labels.

### 4.4 Layout and shape

- Generous whitespace; max content width ~1120px; reading column ~680px.
- Left-aligned text. Centred only for the home hero wordmark and the simulation stage.
- Radii vary by hierarchy: photos 20px, panels 16px, buttons fully rounded (pill), inputs 12px. Not one radius for everything.
- Shadows: almost none. Separate areas with pastel fields and space instead. If needed, one very soft shadow token only.
- Numbered markers are allowed only where content is a real sequence: recipe steps and the meal order.

Home wireframe:
```
┌──────────────────────────────────────────────────────────┐
│ Santosh       The Kitchen  Pantry  Cook  This Weekend [Reserve a seat] │
├──────────────────────────────────────────────────────────┤
│                                                          │
│            Santosh                                       │
│            Meals from the Valley                         │
│   [ PhotoSlot HERO-SPREAD: overhead photo of the meal ]  │
│   Kashmiri Pandit food, cooked at home on weekends.      │
│   [Reserve a seat]   [Cook Rogan Josh with Maej]         │
├──────────────────────────────────────────────────────────┤
│ The meal, in order (horizontal strip, real sequence)     │
│ 1 Kehwa & Nadur Monje  2 Mains with rice  3 Kong Phirin  │
├──────────────────────────────────────────────────────────┤
│ This weekend: dates, seats left, menu        [Reserve]   │
├──────────────────────────────────────────────────────────┤
│ The four spices: heeng, sonth, saunf, Kashmiri chilli    │
│ (links to Pantry)                                        │
├──────────────────────────────────────────────────────────┤
│ Cook with Maej teaser (illustrated pan, one line, CTA)   │
└──────────────────────────────────────────────────────────┘
```

Dish story wireframe:
```
┌──────────────────────────────────────────────────────────┐
│ [ PhotoSlot DISH-<slug> ]   Dish name (Gloock, large)     │
│                             One-line description          │
│                             Course, veg or non-veg          │
├──────────────────────────────────────────────────────────┤
│ What goes in (ingredients grouped as in source)           │
├──────────────────────────────────────────────────────────┤
│ Step storyboard (scroll): illustration │ step text        │
│                           ...          │ Maej's Tip card  │
├──────────────────────────────────────────────────────────┤
│ Serve it (serving note from source)                       │
│ On the menu this weekend? [Reserve a seat]                │
└──────────────────────────────────────────────────────────┘
```

### 4.5 Illustration style (generated)
- Soft pastel gouache or watercolour look, using only the colour tokens above.
- Top-down or three-quarter kitchen views: vessels, ingredients, flame, steam, oil sheen.
- **No people and no faces.** No hands unless the user approves.
- Never depict onion, garlic, or tomato.
- One fixed style prompt and palette reference for every illustration, so all seven dishes look like one family. Store the style prompt in `src/lib/pipeline/illustration-style.ts`.
- Illustrations are clearly illustrations. Real dishes are only ever shown in user-supplied photos.

### 4.6 Motion
- One orchestrated moment on the home page: the hero photo gently settles in and a soft steam effect (canvas or CSS) rises over the dish once, then stops.
- On dish pages, storyboard illustrations reveal as the user scrolls to each step.
- Everything else moves only in response to the user (opening, confirming, interacting in the simulation).
- No fade-up on every section. No hover animation on every card.
- `prefers-reduced-motion`: disable steam and scroll reveals; show static states.

### 4.7 Imagery rules
- Real food = real photos supplied by the user (see § 9 Photo requests).
- Until a photo arrives, render `<PhotoSlot id>`: a pastel field in the dish's colour, with the dish name in Gloock and a small "Photo coming soon" note visible only in development and admin.
- No video anywhere. No recordings of people.

### 4.8 Components
- `PhotoSlot` — placeholder or photo by id from `content/photos.json`.
- `MaejTip` — Kalam text on `--saffron` or `--lotus` field with a small illustrated spoon mark; used for source warnings and cues.
- `DishCard` — photo, name, one-line description, course; colour from dish mapping. Vary layout by context (not identical cards everywhere).
- `MealStrip` — the three-part meal sequence.
- `SpiceDNA` — matrix visualisation (see § 6.6).
- `SeatCounter` — seats left for an event.
- `Button` — primary (`--chilli` fill, `--rice` text, pill), secondary (outline `--ink`), quiet (text only).

### 4.9 Voice and copy
- Warm, plain, specific. Sentence case. Active verbs on buttons: "Reserve a seat", "Pay and confirm", "Approve step", "Start cooking".
- The same action keeps the same name through a flow ("Reserve a seat" → "Seat reserved").
- Errors say what happened and how to fix it, without apologising: "That evening is full. Join the waitlist or pick another date."
- Dish copy uses only what the source says. Maej's Tips quote or closely paraphrase source warnings.

### 4.10 Accessibility and quality floor
- Responsive down to 360px wide. Visible keyboard focus (`--chilli` ring). AA contrast.
- All simulation drag actions have tap-to-select and keyboard alternatives.
- Alt text for every photo and illustration.

---

## 5. Layer 1 — The Table (bookings and logistics)

### 5.1 Events
An event is one supper club evening.
- Fields: date, start time, seat cap, price per seat (INR), menu (dish slugs), status (draft, open, full, closed).
- Menu follows the source meal structure: Kehwa and Nadur Monje to start, one non-veg main, one veg main, steamed rice, Kong Phirin. The admin chooses which mains each event serves. Suggested pairing (owner decides): one red chilli gravy with one white yogurt gravy, e.g. Rogan Josh with Nadru Yakhni, or Mutton Yakhni with Dum Aaloo.
- Only dishes with status `approved` can be added to a menu.

### 5.2 Reservations
- Flow: This Weekend → pick event → seats (1 to max per booking) → name, email, phone, dietary notes → pay → confirmation.
- Seats are held for 10 minutes during payment; release on timeout or failure. Never oversell: enforce the cap with a database transaction or row lock.
- Full events offer a waitlist (name, email, seats wanted).
- The home address is never shown publicly; it is sent only in the confirmation email (pending open question).

### 5.3 Payments (revised: mock, no external gateway)
- No real payment gateway (course rule caps allowed keys to `PORTKEY_API_KEY`/`OPENAI_API_KEY`; adding Razorpay keys isn't worth the risk for a 2-day build). A clearly labelled "Pay and confirm (test mode)" button marks the booking `confirmed` directly on the server after the seat-hold check passes.
- Booking statuses: `pending_payment`, `confirmed`, `cancelled`, `expired`.

### 5.4 Confirmation (revised: on-screen, no email provider)
- No transactional email provider. The confirmation page itself (`/book/confirmed/[bookingId]`) shows date, time, seats, menu with links to dish stories, what to expect, and address (if approved) — this page's URL is the "confirmation".
- Waitlist: shown as an in-app state ("You're on the waitlist") rather than an emailed "a seat opened up" notice.

### 5.5 Admin
- Single shared admin password via `ADMIN_PASSWORD` env var (simple cookie session), not Supabase Auth. No public accounts needed.
- Screens listed in § 3. Bookings list exports to CSV.

---

## 6. Layer 2 — The Recipe-to-Story Engine

Pipeline: **ingest → extract → validate → review → draft stories → generate illustrations → review → publish.**
Everything runs from `/admin/recipes` and also as a CLI (`scripts/run-pipeline.ts`) for repeatable runs.

### 6.1 Ingest
- Input: `source/Kashmiri_Food.docx` (or a newer upload). Convert with `mammoth` to text/markdown, preserving bold headings and lists.
- Use the LLM to segment the document into: the cuisine introduction, course framing lines (e.g. "Starters always complement the main course…", "No meal is complete without a dessert…"), and the seven recipe blocks. Store each block's raw text.

### 6.2 Why this is non-trivial (handle all of these)
- Rogan Josh nests ingredients under sub-groups ("Whole spices", "Ground spices") and has a separate pressure cooker note.
- Kehwa is prose, with quantities embedded inside the method ("crushed cardamom (2)", "saffron (4 strands)").
- Dum Aaloo has a parallel branch ("In the meantime prepare the gravy").
- Nadru Yakhni uses labelled phases ("Prepare the Lotus Stem", "Temper the Spices").
- Ingredient alternatives appear ("cumin or caraway seeds", "mustard oil or ghee", "sugar or honey").
- Typos in the source ("silted" for slit, "chilly") must be preserved in `sourceText` but normalised in display text, and flagged for review.

### 6.3 Extraction schema (Zod, in `src/lib/schema/recipe.ts`)

```ts
const SourceRef = z.object({
  sourceText: z.string(),          // exact sentence(s) from the source
});

const Ingredient = z.object({
  id: z.string(),
  name: z.string(),                // e.g. "Kashmiri red chilli powder"
  localName: z.string().optional(),// e.g. "saunf", "sonth", "heeng"
  quantity: z.string().nullable(), // keep as written: "4 tsp", "1½ to 2 tsp", "a pinch"
  prep: z.string().optional(),     // "slightly crushed", "whisked", "broken into few pieces"
  group: z.string().optional(),    // "Whole spices", "Ground spices", "Spices"
  alternatives: z.array(z.string()).default([]),
  purpose: z.string().optional(),  // only if source states it: "for colour and mild heat"
}).merge(SourceRef);

const InteractionType = z.enum([
  "heat_hold", "cool_wait", "drop_in", "crush_then_drop", "timed_add",
  "stir", "stir_high_heat", "heat_dial", "sprinkle_stir", "slow_pour_with_stir",
  "pour_water", "cover_simmer", "pressure_whistles", "gentle_stir",
  "rest", "plate", "deep_fry", "pierce", "batter_dip", "steep", "strain", "none",
]);

const Step = z.object({
  id: z.string(),
  order: z.number(),
  phase: z.string(),               // "tempering", "searing", "gravy", "simmer", "finish", ...
  action: z.string(),              // short display text
  ingredientIds: z.array(z.string()),
  heat: z.enum(["off","low","medium-low","medium","high","lowered","unspecified"]),
  duration: z.string().nullable(), // as written: "8 to 10 minutes", "about 45 minutes"
  sensoryCue: z.string().nullable(),
  warning: z.string().nullable(),
  interaction: InteractionType,
  branch: z.string().optional(),   // e.g. "gravy" for Dum Aaloo's parallel branch
}).merge(SourceRef);

const Variant = z.object({
  name: z.string(),                // "Pressure cooker"
  replacesStepIds: z.array(z.string()),
  steps: z.array(Step),
}).merge(SourceRef);

const Recipe = z.object({
  slug: z.string(),
  name: z.string(),
  course: z.enum(["starter","main","dessert"]),
  isVeg: z.boolean(),
  description: z.string(),         // from source only
  ingredients: z.array(Ingredient),
  steps: z.array(Step),
  variants: z.array(Variant).default([]),
  servingNote: z.string().nullable(),
  flags: z.array(z.object({ type: z.string(), message: z.string() })).default([]),
  status: z.enum(["extracted","in_review","approved"]),
});
```

### 6.4 Extraction prompt rules
- System prompt states: use only the provided text; copy quantities exactly as written; every ingredient and step must include `sourceText` copied verbatim; set fields to null when the source does not say; never add ingredients or steps; record anything ambiguous as a `flag`.
- Ask for JSON only; validate with Zod; on failure, retry once with the validation error included, then surface the error in admin.
- Extract one recipe block per call.

### 6.5 Automatic validators (run after every extraction)
1. **Source match:** every `sourceText` must appear in the source block (normalise whitespace and punctuation; allow small fuzzy differences). Unmatched → flag.
2. **Forbidden ingredients:** onion, garlic, tomato anywhere in any recipe → hard error.
3. **Dish-specific rules from the source:** Mutton Yakhni must not contain turmeric or red chilli → hard error.
4. **Coverage:** every ingredient line and instruction line in the source block maps to at least one extracted item → otherwise flag "possibly missed".
5. **Ingredient used but not listed:** a step mentions an ingredient missing from the ingredient list → flag (expected example: dry mint in Nadru Yakhni).
6. **Order:** step order follows source order (except explicitly parallel branches).

### 6.6 Review screen (`/admin/review/[slug]`)
- Left: source text with the matched sentence highlighted. Right: the extracted item as an editable form.
- Each item: Approve, Edit, or Reject. Flags are listed at the top and must be resolved before the dish can be approved.
- Every edit is logged (field, before, after, timestamp) — this log feeds the evaluation in § 11.
- On approval, export to `content/dishes/<slug>.json` (versioned).

### 6.7 Food stories
Each dish story page is assembled from approved data:
- Header: photo, name, description from source.
- "What goes in": ingredients in their source groups, local names shown alongside (heeng, saunf, sonth).
- Step storyboard: one illustration per step (or per phase for long recipes), step text, and a `MaejTip` for each warning or sensory cue.
- "Serve it": serving note from source.
- Short story paragraphs are drafted by the LLM **only from the source text**: the dish description, the course framing lines, and the cuisine introduction. Each drafted sentence stores the source sentence it came from and goes through the same review screen.
- Optional memory notes: the admin can add short typed notes per dish (e.g. "who taught you this?"). These are the only content allowed beyond the source, and they display as clearly attributed notes. No audio or video.

### 6.8 Illustrations (revised: no paid image-gen API)
- `IllustrationProvider` interface: `generate({ prompt, stylePrompt, size }) → imageUrl`, kept pluggable so a real image API could be swapped in later. For this submission, the only implementation is `handmade`: a small library of hand-authored SVG/CSS illustrations (pastel gouache-style, per § 4.5) selected per step by its `interaction` type and phase, plus an `admin` escape hatch to upload a manual image. No external image-gen key required.
- Each illustration still goes through the same review (approve or swap) before publishing, and keeps a reference to which step/phase it illustrates.
- Priority: Rogan Josh first (all steps, also reused as simulation art reference), then other dishes per phase.

### 6.9 Spice DNA map (`/pantry`)
- Computed from approved ingredient data, never hard-coded. Rows = dishes in meal order; columns = heeng, saunf, sonth, Kashmiri chilli, saffron, plus a toggle to show whole spices.
- Clicking a cell shows the ingredient's quantity and the sentence where it is used.
- Expected result from the current source (use as a test fixture):

| Dish | Heeng | Saunf | Sonth | Kashmiri chilli | Saffron |
|---|---|---|---|---|---|
| Rogan Josh | ✓ | ✓ | ✓ | ✓ | |
| Mutton Yakhni | ✓ | ✓ | ✓ | | |
| Dum Aaloo | ✓ | ✓ | ✓ | ✓ | |
| Nadru Yakhni | ✓ | ✓ | ✓ | | |
| Nadur Monje | | | ✓ | ✓ | |
| Kehwa | | | | | ✓ |
| Kong Phirin | | | | | ✓ |

- Caption copy: the signature quartet from the introduction runs through every main; removing the chilli moves Rogan Josh toward the Yakhni family.

### 6.10 Red vs White (`/pantry`)
- Side-by-side comparison of Rogan Josh and Mutton Yakhni, generated from approved data: shared ingredients, different ingredients, and how the method order differs (Rogan Josh sears then builds the gravy; Mutton Yakhni boils the meat first and adds the tempering at the end).
- Uses `--chilli` and `--almond` as the two sides.

---

## 7. Layer 3 — Cook with Maej (Mutton Rogan Josh)

### 7.1 Principle
The simulation is generated from the approved Rogan Josh steps. `src/sim/` maps each step's `interaction` type to a mechanic. If the approved data changes, the simulation changes with it. Never hard-code recipe text in the simulation.

### 7.2 Step-by-step (mirrors the source order exactly)

| # | Source step | Mechanic | Success cue | Failure feedback (MaejTip) |
|---|---|---|---|---|
| 0 | (Intro) The kitchen skips onion, garlic, tomato | Pantry: drag ingredients onto the tray; onion, garlic, tomato are labelled decoys on the shelf | Tray holds exactly the recipe's ingredients | Picking a decoy explains the Shaivite and Sattvic principle from the source |
| 1 | Heat mustard oil until smoking point, then let it cool slightly | `heat_hold` then `cool_wait`: hold to heat, smoke indicator, release, wait | Released at smoke point, waited to cool | Releasing early: oil not ready yet. Adding spices without cooling: shown as too hot |
| 2 | Add bay leaves, cinnamon (broken), cloves, cardamoms (slightly crushed); let crackle | `crush_then_drop`: tap to crush cardamom, break cinnamon, drop all in | Crackle animation and sound | Uncrushed cardamom prompts a nudge |
| 3 | Add asafoetida, followed immediately by mutton | `timed_add`: add heeng, then a short window to add the mutton | Mutton added inside the window | Late: heeng scorches |
| 4 | Sear on high heat 8 to 10 minutes until slightly brown and juices dry up | `stir_high_heat` with time compression | Meat browns, visible juices disappear | Not stirring: uneven colour |
| 5 | Add salt, stir in between, lower the heat | `heat_dial` | Flame lowered | Heat left high before chilli: warning |
| 6 | Add Kashmiri chilli powder and mix well | `sprinkle_stir` | Pot turns deep red | — |
| 7 | Add whisked yogurt a little at a time, stirring continuously | `slow_pour_with_stir` | Smooth gravy | Pouring fast or not stirring: visible curdling (source warning) |
| 8 | Cook on medium-low until yogurt absorbed and oil separates | `stir` with a bhunao meter | Oil visible at edges | Moving on early: "the oil hasn't separated yet" |
| 9 | Stir in fennel and ginger powder; pour in water for gravy | `sprinkle_stir` then `pour_water` with level guide | Level reaches guide | — |
| 10 | Cover tightly; simmer on low ~45 minutes until tender with red oil on top | Method choice: **Handi** (`cover_simmer` with time-skip slider) or **Pressure cooker** (`pressure_whistles`: count 2 whistles, reduce heat 5 minutes, wait for lid to release on its own) — from the source note | Tender meat, red oil layer | Opening the cooker before release: blocked with tip |
| 11 | Uncover, sprinkle garam masala, stir gently | `gentle_stir` (slower gesture) | — | Vigorous stirring: gentle nudge |
| 12 | Rest 10 minutes with lid on; serve hot with rice | `rest` then `plate` | Plated beside rice | — |

### 7.3 Ending
- "Maej's verdict": score from cue accuracy across steps, shown as one of three warm verdicts (copy to be written, light humour allowed).
- Unlock the Rogan Josh story card, then the booking hook: next event date, seats left, and "Reserve a seat". If Rogan Josh is not on the next menu, show "Rogan Josh returns on <date>" or the next event's menu.
- Option to replay with the other cooking method.

### 7.4 Tech
- PixiJS stage inside a React client component; state machine per step (`idle → active → success | retry`).
- Art: pastel illustrated layers (pan, oil, spices, meat states, gravy colour states, steam) using design tokens. Colour of the gravy interpolates between states.
- Sound: optional royalty-free effects (oil sizzle, spice crackle, simmer bubbles, whistle). Muted by default with a toggle. No voices.
- Inputs: pointer drag, tap-to-select alternative, keyboard (arrow keys + space). Works on mobile in portrait.
- Reduced motion: replace particle effects with static state changes.

---

## 8. Data model (SQLite, via `better-sqlite3`)

Same shape as originally planned for Supabase/Postgres; `jsonb` columns below are stored as `TEXT` (JSON-serialised) in SQLite.

| Table | Key fields |
|---|---|
| `source_documents` | id, filename, uploaded_at, raw_text |
| `recipe_blocks` | id, document_id, slug, raw_text |
| `recipes` | slug, data (jsonb, Recipe schema), status, version, approved_at |
| `review_edits` | id, recipe_slug, item_id, field, before, after, edited_at |
| `story_sentences` | id, recipe_slug, text, source_text, status |
| `illustrations` | id, recipe_slug, step_id, url, prompt, provider, status |
| `memory_notes` | id, recipe_slug, text, author, status |
| `photos` | slot_id, url, alt, status |
| `events` | id, date, start_time, seat_cap, price_inr, menu (text[]), status |
| `bookings` | id, event_id, name, email, phone, seats, dietary_notes, status, payment_ref (mock), hold_expires_at |
| `waitlist` | id, event_id, name, email, seats, created_at |
| `pipeline_runs` | id, recipe_slug, model, input_tokens, cached_input_tokens, output_tokens, started_at, finished_at, validator_results (jsonb) — token counts feed the report's Tokenomics section |

---

## 9. Photo requests

Claude Code: when a phase needs photos, send the user one consolidated list from this table with the IDs, then continue building with `PhotoSlot` placeholders. Never ask for videos or audio. Never substitute stock or AI-generated photos.

Photo guidance to share with the user: natural daylight, no flash; plain light or soft-coloured background; landscape, at least 2400px on the long edge (also a square crop for dishes if easy); JPG; filename = slot ID (e.g. `DISH-ROGAN.jpg`); upload via `/admin/photos` or place in `public/photos/`.

| Slot ID | What | Where used | Priority |
|---|---|---|---|
| `HERO-SPREAD` | Overhead shot of the full meal on the table: Kehwa, Nadur Monje, both mains of one menu, rice, Kong Phirin | Home hero | P1 |
| `DISH-ROGAN` | Rogan Josh in a serving bowl, red oil visible | Dish page, simulation ending, cards | P1 |
| `DISH-MYAKHNI` | Mutton Yakhni in a serving bowl | Dish page, Red vs White | P1 |
| `DISH-DUMAALOO` | Dum Aaloo in a serving bowl | Dish page | P1 |
| `DISH-NADRUYAKHNI` | Nadru Yakhni in a serving bowl | Dish page | P1 |
| `DISH-NADURMONJE` | Nadur Monje fritters on a plate | Dish page, meal strip | P1 |
| `DISH-KEHWA` | Kehwa in a cup with almond garnish | Dish page, meal strip | P1 |
| `DISH-KONGPHIRIN` | Kong Phirin in bowls with nuts | Dish page, meal strip | P1 — **exception:** no real photo yet, so a licensed reference photo (CC BY-SA 4.0, Sumit Surai, Wikimedia Commons) is used instead, clearly labelled "Reference photo" in the UI. Swap for a real photo of the actual dish when available. |
| `ING-QUARTET` | The four spices in four small bowls: heeng, saunf powder, sonth powder, Kashmiri chilli powder | Home, Pantry | P1 |
| `ING-WHOLE-SPICES` | Bay leaves, cinnamon, cloves, black and green cardamom together | Pantry, Rogan Josh page | P2 |
| `ING-LOTUS-STEM` | Raw lotus stem, with one cut piece showing the holes | Nadru Yakhni and Nadur Monje pages | P2 |
| `ING-SAFFRON` | Kashmiri saffron strands | Kehwa and Kong Phirin pages | P2 |
| `ING-KEHWA-LEAVES` | Kashmiri green tea leaves | Kehwa page | P2 |
| `TABLE-SETTING` | The dining table set for guests, no people | This Weekend, booking page | P1 |
| `REF-VESSELS` | The actual pan or wok and pressure cooker used for Rogan Josh (reference only, not published) | Simulation art reference | P2 |

---

## 10. Open questions (ask the user before building the affected feature)

| # | Question | Blocks |
|---|---|---|
| 1 | Nadru Yakhni finishes with crushed dry mint, but mint is not in its ingredient list. Add it to the list? | Nadru Yakhni approval |
| 2 | Mutton Yakhni and Nadru Yakhni give no water quantities and few timings. What values should the dish pages show (or leave unstated)? | Yakhni approvals |
| 3 | Mutton Yakhni allows cumin or caraway, and mustard oil or ghee. Which should the illustrations show? | Mutton Yakhni illustrations |
| 4 | Servings per recipe are not stated. How many people does each recipe serve? | Event planning, seat cap guidance |
| 5 | Kehwa is written for one cup. How should it scale for a full table? | Kehwa page note |
| 6 | Dum Aaloo gravy uses "about 4 tbs of oil": is this the mustard oil reused from frying? | Dum Aaloo approval |
| 7 | ~~How should the "Compiled/Presented by" credit appear on the site?~~ **Resolved:** don't show it publicly anywhere. | — |
| 8 | Seat cap per evening, max seats per booking, price per seat, and which evenings (Saturday, Sunday, times)? | Layer 1 |
| 9 | Share the home address only in confirmation emails, or a general area publicly? | Confirmation email, This Weekend |
| 10 | Dietary policy: the menu is fixed with one non-veg and one veg main. Offer a fully vegetarian option per booking? | Booking form |
| 11 | ~~Which image generation service and API key are available for illustrations?~~ **Resolved:** hand-built SVG/CSS illustrations (`handmade` provider), no paid image-gen key. | — |
| 12 | ~~Which email provider should send confirmations?~~ **Resolved:** no email provider; confirmation is the on-screen confirmation page. | — |
| 13 | ~~Is the name "Cook with Maej" approved for the simulation?~~ **Resolved:** yes, approved. | — |

---

## 11. Evaluation (for the class report)

`scripts/evaluate.ts` produces a report from `pipeline_runs` and `review_edits`:
- **Extraction accuracy:** share of extracted fields approved without edits, per recipe and overall.
- **Faithfulness:** count of items failing the source-match validator; count of forbidden or invented ingredients caught.
- **Format robustness:** compare accuracy on list-style recipes (Rogan Josh) versus prose-style (Kehwa) and branched (Dum Aaloo).
- **Coverage:** share of source lines mapped to extracted items.
- **Illustration consistency:** share of illustrations approved on first generation versus regenerated.
- Optional: run extraction with two models or two prompt versions and compare.

---

## 12. Build plan (stop after each phase for the user)

**Phase 0 — Foundation and design system**
Next.js, Tailwind, tokens as CSS variables, fonts, layout shell, navigation, `PhotoSlot`, `MaejTip`, `Button`, Supabase project, admin auth, `.env.example`.
Accept when: home shell renders with tokens and placeholder slots on mobile and desktop; a style-guide page `/admin/style` shows every token and component.
Ask user: P1 photos list; open questions 7, 11, 13.

**Phase 1 — Pipeline: ingest, extract, validate, review**
Ingest the .docx, segment into seven blocks, extract with Zod schema, run all validators, build the review screen with edit logging, export approved JSON.
Accept when: all seven recipes extracted; Spice DNA fixture test passes from extracted data; forbidden-ingredient and Yakhni rules have unit tests; Rogan Josh is approved by the user.
Ask user: open questions 1–6.

**Phase 2 — The Kitchen**
Dish story pages from approved data, story sentence drafting and review, illustrations (Rogan Josh first). Pantry/Spice DNA/Red vs White are cut from scope (see § 3).
Accept when: all approved dishes have story pages; no published sentence lacks a source reference; reduced-motion works.
Ask user: P2 photos; illustration review.

**Phase 3 — The Table**
Events admin, This Weekend, booking with seat holds, Razorpay test payments, confirmation and waitlist emails.
Accept when: concurrent bookings cannot oversell (tested); a test payment confirms a booking end to end; full events show the waitlist.
Ask user: open questions 8, 9, 10, 12.

**Phase 4 — Cook with Maej**
Simulation engine reading approved Rogan Josh data; all steps in § 7.2; both cooking methods; verdict; booking hook.
Accept when: playable start to finish on mobile and desktop with touch, mouse, and keyboard; changing an approved step's text updates the simulation; sound muted by default.

**Phase 5 — Polish and evaluation**
Home orchestrated moment, copy pass, accessibility audit, performance (images optimised), evaluation report generated.
Accept when: Lighthouse accessibility ≥ 95; evaluation report exported for the class write-up.

---

## 13. Out of scope
- Video of any kind, voice narration, audio recordings of people.
- Dishes not in the source document.
- Customer accounts, reviews, or social features.
- Live (non-test) payments.

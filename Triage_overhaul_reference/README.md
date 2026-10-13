# Handoff: CRO Audit System — App Redesign

## Overview
This is a redesign of the CRO Audit SPA (`CROAuditSPA_V1/index.html`), a browser tool Shopify freelancers use to run a 60-point conversion audit, price the fixes and hand the client a report. The redesign does two things:

1. **Look and feel.** It reskins the app with the *triage* design system: square, hairline, terminal-native, Geist and Geist Mono, one lime accent. It also raises readability to 15–16px body text and 44px+ tap targets.
2. **Flow and functionality.** It restructures the audit into 5 steps (**Setup → Checklist → Revenue → Report → Scripts**). The separate Findings and Calculator stages merge into one Revenue step. The redesign also adds a Phase 1 / Phase 2 split, optional pricing in the client report, a 5-page PDF and a new checklist map. It removes several things clients should not see.

Read `CLAUDE.md`, `SPEC.md` and `BUILD_NOTES.md` in the repo first. Where this README conflicts with `SPEC.md`, **this README wins for UI, flow and the report**. Data integrity rules in `BUILD_NOTES.md` still apply: Supabase source of truth, generated `audit-items.js`, single store, demo mode.

## About the design files
The files in `design/` are **design references built in HTML**. They show the intended look and behaviour; they are not production code to paste in. Recreate them inside the existing app (`index.html`, React and Babel-standalone 7.23.2, pinned per `BUILD_NOTES.md`) using its patterns: function components, the single store, `getItemState()`, `calcROI()` and the theme variables in `:root`.

To view the designs, open `design/Triage App Final.dc.html` in a browser. It shows every screen in desktop dark, desktop light and mobile dark. Each screen is its own `Screen *.dc.html` file and can be opened alone. The `theme` and `vp` (viewport) props switch variants.

## Fidelity
**High fidelity.** Colours, type, spacing, copy and layout are final. Match them closely using the tokens below. Sample data (Better Brewer, $48,000/mo and so on) is illustrative; wire every figure to real audit state.

---

## Global changes

### Theme: replace the current tokens
The app already loads Geist and has a light/dark lime palette, but it uses shadows, `rgba()` tints and DM-era naming. Move to the triage role tokens (light is the default; dark goes under `[data-theme="dark"]`):

| Role | Light | Dark |
|---|---|---|
| `--bg` | #EEEFEA | #0A0B09 |
| `--surface` | #E3E5DD | #13150F |
| `--ink` | #0B0C0A | #E8EBE2 |
| `--mute` | #5A5D56 | #8A8E84 |
| `--rule` | #CBCEC4 | #272A21 |
| `--accent` | #C6F432 | #C6F432 |
| `--on-accent` | #0B0C0A | #0A0B09 |
| `--accent-text` | #4A6400 | #C6F432 |
| `--loss` | #C2381C | #FF6A4D |
| `--gain` | #3E7A00 | #C6F432 |
| `--btn-bg` | #0B0C0A | #C6F432 |
| `--btn-ink` | #C6F432 | #0A0B09 |

Mapping from the current variables:
- `--paper` → `--bg`
- `--paper-2` → `--surface`
- `--ink-3`/`--ink-4` → `--mute`
- `--accent-dk` → `--accent-text`
- `--state-fail`/`--impact-high` → `--loss`
- `--state-pass`/`--accent-positive` → `--gain`

Delete `--shadow`, `--shadow-lg`, every `*-bg` rgba tint, `--amber` and `--impact-medium`. Keep the CSS-variables-only rule from `CLAUDE.md`.

**Rules:**
- `border-radius: 0` everywhere, with 1px `--rule` hairlines.
- No shadows, gradients, blur or transparency.
- Hover is opacity .85 over 120ms ease. Press has no transform. Focus is an ink border plus a 2px lime inset underline.
- Lime is never used as text on light backgrounds; use `--accent-text` there.
- Loss/gain colours appear only on figures.

### Typography
- **Geist** (`--font-sans`) for headings and body; **Geist Mono** (`--font-mono`) for labels, buttons, numbers, paths and tags.
- Page H1: 32px/1.05, weight 600, letter-spacing −0.04em. Display numbers: 52–64px, 600, −0.045 to −0.05em.
- Body: 15–16px, line-height 1.55. Secondary text uses `--mute`.
- Labels: mono 11–12px, weight 500–600, uppercase, letter-spacing .08–.12em.
- Buttons (DS `Button`): mono 11–12px, 600, uppercase, letter-spacing .1em. Padding is 15×22px for md and 10×16px for sm. Primary is `--btn-bg`/`--btn-ink`; secondary is transparent with a `--rule` border.
- Use the true minus sign `−` (U+2212). Units are mono caps (`/MO`). No emoji; glyphs only: `→ ✓ · ▾ ⇅ ⋯ $`.

### Inputs and tap targets
- Inputs are 44px tall on desktop and 48px on mobile, square, with a `--bg` or `--surface` fill and a 1px `--rule` border. Labels sit above them in mono 12px uppercase.
- Every tap target is at least 44×44px on mobile.

### Field visibility tags
Every section of a form or panel carries a tag:
- **IN REPORT:** a mono 11px label with a 1px `--rule` border, for anything the client will see.
- **PRIVATE:** a full-width `--ink` header bar with `--bg` text ("PRIVATE · Only you see this. Never printed."), with a 1px `--ink` border around the block. Used for Audit fee, Notes and Your pricing.

### App chrome (inside an audit)
- **Top bar, 56px:** Wordmark (20px) / Audits / *audit title* (15px, 600). Then a spacer, the save state in mono 12px mute ("✓ Saved · just now"), and the buttons Edit info, Export .json (hidden in demo) and Theme, all secondary sm.
- **Step strip, 48px:** five tabs, `01 SETUP · 02 CHECKLIST · 03 REVENUE · 04 REPORT · 05 SCRIPTS`, in mono 12px with .08em tracking. The active tab is 600 `--ink` with a 2px `--btn-bg` bottom border. Inactive tabs are 500 `--mute`. Completed steps show a `✓` in `--gain`. Tabs are clickable.
- **Footer action bar, 72px:** a secondary "← Previous step" on the left and a primary next action on the right ("Start checklist →", "Size the revenue →", "View report →" and so on).
- **Mobile:**
  - Top bar is 52px: a 44px ← button, the step title (15px, 600) and a mono 11px subline such as `03/05 · BETTER BREWER`.
  - Setup shows a 5-segment progress bar (4px tall).
  - The primary CTA is fixed at the bottom: 52px tall, full width, mono 13px with .1em tracking, plus 28px of bottom safe-area padding.
- **Remove** the vertical `translateY` stage slide (0.55s cubic-bezier). Use instant or opacity (120ms) step changes.

---

## Screens

### 01 Sign in (`Screen Sign In.dc.html`)
- Magic-link sign in. Heading "Sign in"; copy "Enter the email you bought the kit with. We'll send a one-time link."
- An Email field, then the primary button "Send magic link →".
- An "or" divider, then a secondary "Try the demo" button with the copy "The demo runs the full audit and report. Nothing is saved, and there's no export."
- Footer meta: "v1 · local-first · Audits stay in this browser".
- This replaces the visuals of the existing `LoginScreen`; keep its Supabase auth logic. "Try the demo" routes to `/demo`.

### 02a Audits, table view (default) (`Screen Audits Table.dc.html`)
- **Header:** label "WORKSPACE", H1 "Audits" (36px). On the right:
  - a workspace cap: "3 of 5 active" plus 5 slot pips (28×8px, filled `--btn-bg` when used);
  - a **TABLE / GRID** segmented switch (46px tall, active segment `--ink` fill);
  - a primary "+ New audit".
- **Table:**
  - Columns: AUDIT (title, then mono `url · client` underneath), THEME, PROGRESS, FAILS, EST. RECOVERY (right-aligned, `--gain`), UPDATED, and actions.
  - PROGRESS is a 6px bar plus "38/60 · In progress".
  - FAILS reads "9 · 4 P0" in `--loss`.
  - Rows are 18px padded and change to `--surface` on hover.
  - Actions: an "Open" sm button and a 36px `⋯` menu.
- **Row menu** (240px, 1px `--ink` border): Open, Duplicate, Archive ("Exports .json, frees a slot"; hidden in demo), and Delete… in `--loss`.
- **Below the table:** "2 slots open · Archive a delivered audit to free its slot…", then "Import .json" with helper text.
- **Mobile:** each audit is a card (title, URL, progress bar, fails, recovery, "OPEN →"), with a fixed "+ NEW AUDIT" CTA.
- The TABLE/GRID choice persists per user (localStorage, skipped in demo).

### 02b Audits, grid view (`Screen Audits Cards.dc.html`)
- Same header with GRID active.
- Each card shows a 60-cell mini map: 6 rows of 10 cells (pass `--gain`, fail `--loss`, not reviewed `--rule`), with a legend of PASS / FAIL / NOT REVIEWED.
- Card stats: REVIEWED, FAILS, /MO. The CTA depends on status: Resume, Report or Start.
- Empty slots render as dashed "OPEN SLOT · NEW AUDIT" cards.

### 03 Audits, empty state (`Screen Audits Table`, `empty`)
- Shown on first run in place of the table: H2 "Run your first **audit.**", with "audit." as a lime highlight block.
- Body copy: "60 checks across 6 sections of a Shopify store. Every failure gets a CVR lift range and a monthly dollar figure, then rolls into a report you hand the client."
- A 4-column explainer: 01 Setup, 02 Checklist, 03 Revenue, 04 Report.
- Buttons: "+ Start first audit" and "Import .json".

### 04 Demo mode (`Screen Audits Table`, `demo`)
- An inverse banner on **every screen**: `--ink` background, a lime "DEMO" chip, "Nothing here is saved. Refreshing the page clears this audit." and "Get the full kit →".
- Hide the workspace cap, Import, Export and Archive. Behaviour is otherwise unchanged; `demoMode` already exists.

### 05 Setup, step 01 (`Screen Setup.dc.html`)
**New full step.** It replaces `NewAuditModal` plus the first-run `ClientInfoOverlay`.

- **Left column:** H1 "New audit"; copy "Store metrics drive every dollar figure in the revenue step. Use the client's last 30 days."
- **Card "Client" (IN REPORT):** Client name, Store URL (with a `https://` prefix cell), Shopify theme (select), Audit date, and Auditor. Auditor shows the helper "Pre-filled from your last audit" and comes from `last_auditor_name`.
- **Card "Store metrics" (IN REPORT, "Last 30 days"):** Monthly revenue ($), Avg. order value ($) and Conversion rate (%), on 48px inputs in mono 18px. A live derived strip underneath shows "≈ sessions/mo 54,906 · ≈ orders/mo 511 · rev/session $0.87".
- **Card PRIVATE:** Audit fee ($), with the note "Feeds the client ROI multiple. Set the implementation fee later, in Revenue."
- **Right column (340px):** a live "REPORT COVER" preview (client, auditor, date, theme) and the note "Edit any of this later from the audit header…".
- **Footer:** "← Audits" on the left; "Next: 60 checks, 6 sections" and "Start checklist →" on the right.
- **Validation:** Client name (or title) and Auditor are required. The metrics may be skipped, but the existing guard stays: leaving the Checklist with metrics missing opens Edit info.

### 06 Checklist, step 02 (`Screen Checklist Focus.dc.html`)
Focus mode shows one item at a time. **Remove auto-advance.**

**Map strip** (below the step strip, `--surface`, 1px bottom rule):
- **Sort button** (pinned left): "⇅ SECTION ▾". It opens a dropdown titled "SORT CHECKLIST BY" with four options:
  - **Section:** GENERAL · COLLECTION · PRODUCT · CART · CHECKOUT · MOBILE/PERF
  - **Priority:** P0 · HIGH · P1 · MEDIUM · P2 · LOW
  - **Quick wins:** < 30 MIN · < 2 HRS · 1 DAY +
  - **CVR lift:** +0.20% + · +0.10–0.20% · +0.05–0.10% · < +0.05%

  Each option has a one-line note, e.g. "Highest priority first · next item follows this order". The groups in the strip **change with the sort**. This replaces the current `getGroupedItems` labels ("High Impact", "Quick Wins / High Value…", "High Lift (≥30%)").
- **Groups:** each group shows a mono label plus a done/total count, then its cells in **one horizontal line**. The whole strip scrolls horizontally (`overflow-x:auto`) in every sort mode.
- **Cells:** 18×18px on desktop and 22×14px on mobile. Fill is pass `--gain`, fail `--loss`, TBD `--mute`, not reviewed `--rule`. The current item has a 2px `--ink` outline with a 2px offset.
- **Hover tooltip** (desktop): 300px, `--bg` fill, 1px `--ink` border. It shows `SECTION · 01/10` with the status, the item name (15px, 600) and the question (14px, mute). Render it outside the scroller so it isn't clipped, positioned under the cell and clamped to the viewport.
- **Click a cell:** navigate to that item.
- **Mobile:** a single tap shows an item card under the map with the same info plus "OPEN →". A double tap, or OPEN →, navigates to the item. Each group row scrolls horizontally on its own.
- Keep the current cell scrolled into view by setting `scrollLeft` (never `scrollIntoView`).
- **Summary on the right:** "38/60 reviewed · 9 fails · +$2,030/mo so far".

**Item card:**
- Meta line in mono: "GENERAL · ITEM 01 OF 10 · #1 OF 60". Title (e.g. "Sticky header"), then the question.
- **Status keys:** PASS / FAIL / TBD / N/A, 80px tall in a 4-column grid with an 8px gap.
  - Each key shows its keyboard letter (P, F, T, N) in the top-right corner, mono 12px at 0.6 opacity, with no "KEY" prefix.
  - When selected, PASS fills `--gain`, FAIL fills `--loss`, and TBD and N/A fill `--ink`, all with `--bg` text.
- **Fails on device** (restores `fails_on_desktop` / `fails_on_mobile`):
  - The FAIL key shows desktop and mobile icons in its lower-left corner, about 22px, with a "+" between them. Use the triage-style icons from `design/Screen Checklist Focus.dc.html`: the same shapes as the current `ICON_DESKTOP`/`ICON_MOBILE`, but with square corners, square caps, miter joins and a square phone dot.
  - The icons always show. Opacity is 1 when selected, 0.3 when unselected, and 0.12 when the check doesn't apply to that viewport (`primary_viewport`). The "+" shows only when both are lit.
  - Setting FAIL selects Desktop + Mobile. Clicking FAIL again cycles: Mobile only → Desktop only → Desktop + Mobile. Single-viewport items don't cycle.
  - The first time a user ever sets FAIL on a two-viewport item, a tooltip appears under the FAIL key. It is 300px wide (240px on mobile), with an `--ink` fill and `--bg` text. It reads "FAILS ON DESKTOP + MOBILE" in mono 11px, then "Click FAIL again for mobile only, then desktop only." in 14px. It fades in over 200ms, holds about 3s, then fades out.
  - Store a "tooltip seen" user pref in localStorage (skipped in demo) so it only appears once.
  - Mobile uses the same pattern in 68px keys, with no letters.
- "EST. RECOVERY IF FIXED +$140/MO" in `--gain`. Show it on FAIL, internal only.
- Read-only meta: "P1 · < 30 MIN · THEME SETTING" (priority, fix time, complexity).
- FINDING (IN REPORT, with "Reset to default"), RECOMMENDATION (IN REPORT), SCREENSHOT URL (paste only), and NOTES (PRIVATE).
- **Footer:** "← Prev" and "Next · *next item name* →". Next follows the active sort order. Hint text: "J/K move · / jump" (the status letters now live on the keys). Primary button: "Size the revenue →".

### 07 Revenue, step 03 (`Screen Revenue Rail.dc.html`)
**Merges `FindingsStage` and `CalculatorStage`.** The layout is a left content column plus a 440px right rail on `--surface`.

**Left column**
- H1 "Revenue"; copy "Ship quick wins now. Move anything that needs proof into the testing roadmap."
- **COLUMNS chips** (top right): SECTION, PRIORITY, FIX TIME and CVR LIFT, each with a 12px checkbox and no border. They show or hide optional columns and are saved per user.
- **Findings table** (1px `--rule` box):
  - Header row on `--surface`: ☐ · FINDING · [SECTION] · [PRIORITY] · [FIX TIME] · [CVR LIFT] · PHASE · /MO.
  - Clicking SECTION, PRIORITY, FIX TIME or CVR LIFT sorts by that column; the active one shows "↓" in `--ink` at 600.
  - Use `white-space:nowrap`. The PRIORITY column is 96px so "PRIORITY ↓" fits on one line.
- **Groups:**
  - **PHASE 1 · Quick wins**: "Ship in week 1 · implementation fee", total "+$X/mo".
  - **PHASE 2 · Testing roadmap**: "A/B test over 12 weeks · monthly retainer", total "+$X/mo if proven".
- **Each row:**
  - a 22px include checkbox (checked uses `--btn-bg` with a ✓; unchecked rows go `--surface` and `--mute`);
  - title (15px, 600) over the finding (14px, mute);
  - section;
  - a `PriorityTag` (P0 solid lime; P1/P2 `muted`, an outlined mute);
  - fix time and lift in mono 13px;
  - a phase button "→ TEST" or "→ SHIP" (28px, mono 11px) that moves the row between phases;
  - /MO in mono 15px, 600, `--gain`.
- **Pitch paragraph** (IN REPORT): "Click to edit · Reset". This is the existing `pitch_override` behaviour. **Change:** the generated pitch must **not** contain pricing, fees or ROI. It ends at the annual figure: "…recover about $2,030 a month, or $24,360 a year."

**Right rail**
- **CLIENT SEES** (IN REPORT):
  - annual revenue at risk, 56px in `--gain`, with "annual revenue at risk · 7 findings" underneath;
  - a 2×2 grid: CURRENT CVR, PROJECTED CVR, MONTHLY RECOVERY, TESTS PLANNED ("3 · 12 wks");
  - the ROI line "5.7× return on $4,250 · pays back in 2.1 months".
- **PRIVATE bar**: "Only you see below".
- **PHASE 1 · SUGGESTED FEE**: the existing tiered suggestion (10/15/20% of annual recovery).
- **YOUR IMPLEMENTATION FEE**: a $ input with a 1px `--ink` border and a "+ $750 audit" suffix.
- **Hourly sanity check**: a chip in PASS (`--gain`), FAIL (`--loss`) or neutral state, e.g. "$100/hr × 30h floor · +$500 (17%)". Keep the existing logic.
- **PHASE 2 · TESTING RETAINER** (new): "$ / month" and "months" inputs, with "3 tests · ~4 weeks each · renews monthly" underneath.
- **TOTAL ENGAGEMENT**: audit fee + implementation fee + (retainer × months).

**Mobile:**
- A sticky summary on `--surface` at the top: "ANNUAL AT RISK · IN REPORT" with $X at 40px, plus `/mo`, the CVR change and the ROI.
- Phase groups use 44px checkbox targets. Each row shows the title, "P0 · 1 day" and /mo.
- "PRIVATE · Your pricing" collapses into an accordion row ("$3,500 + $1,500/mo ▾").
- Fixed CTA: "VIEW REPORT →".

**Logic changes**
- Keep pre-check (top 10 by Priority, then Effort, then order), the 3–6% lift cap and `calcROI`.
- Phase defaults stay in `defaultPhase()`: `< 30 min` / `1-2 hrs` → quick win, otherwise test. The user overrides with → TEST / → SHIP (stored as `items[id].phase`).
- **Open question for Tim:** confirm which findings count as tests and which as quick wins. In the sample data, "Sticky add to cart" (2 hrs) is a test, which the current `defaultPhase` would not produce.

### 08 Report, step 04 (`Screen Report Final.dc.html`)
**CLIENT VIEW bar** (56px, `--surface`):
- "CLIENT VIEW · Notes are hidden. This is what prints."
- Checkboxes: Detailed findings, Screenshot links, and **Show pricing** (new, off by default, saved per audit).
- Primary button "Print / Save PDF".

**Document:**
- **Always white** (`#FFFFFF`), with light tokens forced via `data-theme="light"` regardless of app theme. Max width 880px, padding 64×72px, 40px between sections.
- **Cover:**
  - "SHOPIFY CRO AUDIT" label, then H1 client title (52px);
  - a meta row: PREPARED FOR, PREPARED BY, AUDIT DATE, STORE, THEME;
  - a 2px `--ink` rule underneath.
- **Opening sentence:**
  - "THE SHORT VERSION", then an H2 at 52px/1.04 with letter-spacing −0.045em and `text-wrap:balance`, max-width 720px: "**$24,360 a year is at stake on betterbrewer.com.au.**" The word "stake" is a lime highlight block (`--accent` background, `#0B0C0A` text, 0 .08em padding);
  - a subline: "Across 7 findings." When pricing is on it continues: "Fixing them pays back in about 2.1 months."
- **Metric row:** one row, 1px `--rule` grid, 22px figures. MONTHLY SESSIONS, CURRENT CVR, PROJECTED CVR and MONTHLY RECOVERY always show; RETURN and PAYBACK show only when pricing is on.
- **Investment strip** (pricing on only): 1px `--ink` border, "INVESTMENT $4,250 · $750 audit + $3,500 implementation".
- **Pitch box:** 3px left `--ink` border on a `--bg` fill, 17px/1.6.
- **Findings:**
  - "ranked by priority, then effort"; columns # · FINDING (bold title — finding) · SECTION · PRIORITY · FIX · CVR LIFT.
  - **There is no /MO column and no per-finding dollar figures anywhere in the client report** (internal only). Remove the total row too.
- **PHASE 1 · Quick wins:** "N findings · ship in week 1". Each item is two columns: title, the meta "P0 · Section · fix time" and the finding on the left; **FIX** and the recommendation on the right, after a 1px left rule.
- **PHASE 2 · Testing roadmap:**
  - copy: "These changes are likely to help, but the size of the effect depends on [client]'s audience. Each one runs as an A/B test until it reaches significance. Winners ship to all traffic; results are reported monthly."
  - a 12-week Gantt chart: a 260px label column plus 12 week columns, under MONTH 1–3 headers with a 1px ink underline;
  - each test row has an id, title and hypothesis, plus an `--ink` bar (white text: metric, then lift range);
  - a 3-cell footer: CADENCE "One test live at a time, ~4 weeks each", REPORTING "Monthly results and next test", UPSIDE IF ALL WIN "+$X/mo on top of phase 1".
- **Footnote:** "Figures are estimates built on benchmarked CVR lift ranges. Traffic, season, offer and audience all move conversion rate."
- **Test data (new):** derive one test per `phase === 'test'` finding, in priority order, about 4 weeks each and run one at a time. Store `{ hyp, metric }` per item; default these from the item and make them editable later. The sample is in `design/findings-data.js` (`TRIAGE_APP_TESTS`).
- **Mobile:** the same document at 24×20px padding, a 30px H2, a 2-column metric grid, findings as compact rows (title + priority), and roadmap tests as 6px bars on a 12-column grid. The bottom bar holds "PRINT / PDF" and "SCRIPTS →".

### 09 Report, print/PDF (`Screen Report Print.dc.html`)
- Browser print only (no PDF library, per `CLAUDE.md`). A4 portrait, 794×1123px per page at 96dpi, padding 56×64×40px. Every page has a running header ("SHOPIFY CRO AUDIT" / "CONFIDENTIAL · FOR [CLIENT]") and a footer ("[Client] · Shopify CRO audit · [date]" / "N / 5"). Ink rules; no lime on paper.
- Five pages:
  1. **Summary:** title, cover meta, the opening sentence (44px), a 3×2 metric grid (2×2 when pricing is off), the investment strip if pricing is on, the pitch box, and an "IN THIS REPORT" contents list.
  2. **Findings, "What we found":** the full table, with each finding's description on its own line under the title (13px). Then the line "P0 issues block purchases or cost the most revenue. P1 issues add friction. P2 issues are polish…"
  3. **Phase 1 · Quick wins:** each finding beside its fix.
  4. **Phase 2 · Testing roadmap:** intro copy; then each test's title, weeks, hypothesis and a bar on a 12-week grid; then the cadence, reporting and upside boxes.
  5. **Next steps, "Questions about this report?":**
     - an intro paragraph and three steps: review the findings, ship Phase 1, start testing;
     - a contact box: name, email, site, booking link and a 140px QR placeholder;
     - the estimates disclaimer.

     **Copy and contact details are placeholders for Tim to confirm.** Pull them from the auditor's profile.
- Use `break-after: page` per page. Long finding lists paginate onto continuation pages that repeat the header and footer.

### 10 Scripts, step 05 (`Screen Scripts.dc.html`)
- H1 "Scripts"; copy "Pre-filled from this audit. Add one specific detail about their store before sending."
- **Script list:**
  - 01 The foot-in-the-door: "Cold outreach · open with a free quick win"
  - 02 The strategy-first pivot
  - 03 The report hand-off
  - 04 The nudge: "No reply after 5 days"

  The active script has a `--surface` fill and an `--accent-text` number.
- **Email panel:** SUBJECT with COPY, then the body with filled values shown as highlight chips (e.g. "checkout", "create an account before they can pay", "$430 a month"). Then "Copy email".
- Helper text: "Filled from the audit: top quick win, its section and monthly value. Click to swap for another finding." Clicking a chip swaps in another finding.

### 11 Edit info (`Screen Edit Info.dc.html`)
- Opens from "Edit info" on any step as a **right-side drawer** (desktop) or full-screen sheet (mobile) over the current view. This replaces the centred `ClientInfoOverlay`.
- Header: audit title, "Audit info", and an "ESC" hint.
- Fields: Audit title, Client name, Auditor, Store URL, Shopify theme. Metrics: Revenue/mo, AOV, CVR.
- **Live impact preview** when a metric changes: "CVR 0.93 → 1.10 · Revenue step recalculates: −$310/mo in scope".
- A PRIVATE block for Audit fee.
- Footer: Cancel and "Save changes". Esc closes the drawer.

---

## Interactions and behaviour (summary)
- **Navigation:** step tabs are clickable; the footer has back/next. Leaving the Checklist with metrics missing opens Edit info with a skip option (existing behaviour).
- **Checklist keys:** J/K previous/next, P F T N set status (pressing F again cycles the viewports, like clicking), `/` jump to an item. Next and Prev follow the active map sort.
- **Map:** hover shows a tooltip; click navigates (desktop). On mobile, tap previews and double-tap navigates.
- **Revenue:** checkboxes include or exclude findings and recalculate everything live with the lift cap. Phase buttons move rows between phases. Column chips and header sorting are saved per user.
- **Report:** Show pricing toggles the RETURN and PAYBACK metrics, the payback sentence and the investment strip. Notes and the private pricing panel never render in the report.
- **Save state:** the top bar reads "✓ Saved · just now" after the debounced upsert, and "Draft · saved locally" before first save. Demo shows neither.
- **Motion:** opacity 120ms ease only. No slide transitions.

## State changes
Bump the store schema version and write a migration (per `CLAUDE.md`). New or changed fields:
- `audit.report.show_pricing: boolean` (default `false`)
- `audit.pricing.retainer_monthly: number`, `audit.pricing.retainer_months: number`
- `audit.items[id].phase: 'quick-win' | 'test'` (already exists)
- `audit.items[id].test: { hyp, metric } | null` (new, for the roadmap)
- User prefs (localStorage, not in the audit): `fail_tooltip_seen: boolean`, `audits_view: 'table' | 'grid'`, `revenue_columns: {section, priority, fix_time, lift}`, `revenue_sort`, `checklist_sort`
- Pitch generator: remove the fee and ROI sentence.

## Removed or changed
- **Kept:** the per-item fails on desktop/mobile toggle. It moves into the FAIL key (see screen 06).
- **Removed:**
  - the separate Findings and Calculator stages (merged into Revenue);
  - `NewAuditModal` (replaced by the Setup step);
  - checklist auto-advance;
  - the stage slide animation;
  - shadows and rgba tints;
  - per-finding /mo values and the /mo total in all client-facing output;
  - the price inside the pitch paragraph.
- **Renamed:** "Impact" becomes "**Priority**" (P0/P1/P2) wherever it appears as a label, filter, sort or column. The data field stays `impact` (High/Medium/Low → P0/P1/P2 via `IMPACT_LABEL`).
- **Changed:** `ClientInfoOverlay` becomes the Edit info drawer. Status "Fail" may display as "Issue found" in the report (open question in `SPEC.md`).

## Open notes for the build
- **Consider dropping the FIX and CVR LIFT columns from the client report.** Showing fix times such as "< 30 min" can undercut single-price selling: clients may nitpick hours or decide to do the fix themselves. The design keeps both columns for now; confirm with Tim before shipping.
- **Hidden pricing:** when pricing is off, a separate follow-up document (invoice or SOW) generated from the same audit data may be needed. Not in scope; flag it as v1.1.
- **Quick wins vs tests:** confirm with Tim which findings count as Phase 1 quick wins and which as Phase 2 tests (see the Revenue logic changes).

## Design tokens (reference)
- **Spacing:** 4, 6, 8, 12, 16, 18, 20, 22, 28, 32, 48, 64, 96px. Panel padding is 48px; stack gap 28px; inline gap 12px.
- **Radius:** 0. **Border:** 1px `--rule`, or 2px `--ink` for section rules in the report. **Shadows:** none.
- **Type scale:**
  - Display: 72, 54 or 40px
  - Heading: 28–36px
  - Figures: 30 or 44px; 52–64px for hero figures
  - Body: 18, 16, 15 or 13px
  - Labels: 11–12px
  - Code: 12.5px/1.8
- **Wordmark:** "triage" in Geist 600 with −0.05em tracking, followed by a lime block (0.42×0.74em, nudged 0.06em down). It never animates.

## Assets
There are no images or icons. Glyphs serve as icons. The wordmark is type (see the `Wordmark` component in `design/_ds/…/_ds_bundle.js`). The QR code on PDF page 5 is a placeholder.

## Screenshots
`screenshots/` has a PNG of every final screen at 1× size: desktop dark, desktop light and mobile dark, using the numbering above (01–11). Examples: `06-checklist-desktop-dark.png`, `08-report-desktop-light.png`. The PDF is shown as two strips of five A4 pages, `09-pdf-pricing-off.png` and `09-pdf-pricing-on.png`. Screenshots are visual reference only; the `.dc.html` files are the source of truth for exact values and behaviour.

## Files
- `design/Triage App Final.dc.html`: an index of every final screen (desktop dark, desktop light, mobile).
- `design/Screen Sign In.dc.html`, `Screen Audits Table.dc.html` (props `empty`, `demo`), `Screen Audits Cards.dc.html`, `Screen Setup.dc.html`, `Screen Checklist Focus.dc.html`, `Screen Revenue Rail.dc.html`, `Screen Report Final.dc.html` (prop `pricing`), `Screen Report Print.dc.html` (prop `pricing`), `Screen Scripts.dc.html`, `Screen Edit Info.dc.html`.
- `design/findings-data.js`: sample findings, tests and pitch text.
- `design/_ds/…`: the triage design system (tokens, plus `_ds_bundle.js` with the Button, Wordmark, PriorityTag, Input, Select and Checkbox components).
- `design/support.js`: runtime needed only to open the `.dc.html` references in a browser. Not for production.
- `Handoff Notes.md`: the running notes from design review.

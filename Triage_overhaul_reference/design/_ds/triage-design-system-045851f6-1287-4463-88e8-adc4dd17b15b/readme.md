# triage Design System

**triage** — The CRO Audit System for Shopify Devs. A CLI-first tool that scans a Shopify theme against 60 conversion checks and ranks every failure by estimated monthly revenue. Audience: Shopify theme developers who live in the CLI and speak dev terminology.

Direction: **Exit Code v1** (primary wordmark) with **Exit Code v2** (underscore) as the alternate. Terminal-native: "looks like your shell output on a good day." Lime is the cursor, the CTA and the recovered number — nothing else.

## Sources
- `Triage Brief.md` — handoff brief (project `019de8d0-f829-7d0b-ac1f-00e01ba2668d`, "Liftkit" design system project).
- `Triage Directions.html` — exploration board, same project. Directions 01 v1/v2 are canon; v3, v6–v8, Ledger, Hazard, Diff, Hotfix were rejected.
- No codebase, Figma, logo file or slide template was supplied. The Liftkit system in the same project is an earlier brand and does **not** apply.

## Products / surfaces
- **CLI** (`@triage/cli`, `triage audit`, `triage report --pdf`) — the core product; represented by the Terminal component.
- **Marketing site** — hero from the direction board; UI kit in `ui_kits/site/`.
- **Web audit flow / report** — extrapolated in the UI kit from the brief's component list. Not in the source.

---

## CONTENT FUNDAMENTALS
- **Voice:** terse, dev-native, numeric. Reads like CLI output and a good README. Speaks to the developer as "you"; the client is a third party ("Hand the client a number.").
- **Revenue loss is implied, never described as bleeding.** No medical metaphors — no "diagnose", "sick", "symptoms", "bleeding", "heal", despite the name.
- **Numbers carry the argument.** Every finding has a dollar figure: `−$3,120/mo`. Use the true minus `−` (U+2212). Units in mono caps (`/MO`).
- **Dev terminology is welcome:** P0/P1/P2, file paths with line numbers (`sections/main-product.liquid:88`), flags, `ATC`, "ship the fix".
- **Casing:** sentence case for headlines and finding titles. Labels, buttons, nav: uppercase via CSS on Geist Mono. Brand name always lowercase: `triage`.
- **Emphasis:** one word per headline, set as a lime highlight block — never italic, never bold.
- **No emoji.** Unicode glyphs only: `→` on CTAs and command hints, `·` as a separator, `✓` for passed, `$` as prompt.
- **Examples (verbatim from source):**
  - "Ship the fix that costs the *most.*"
  - "Triage scans your Shopify theme against 60 conversion checks and ranks every failure by monthly revenue. Run `triage audit` from the terminal. Hand the client a number."
  - "Run an audit →" · "$ npm i -g @triage/cli"
  - "Add to cart sits below the fold on mobile" · "Filters reset on back nav"

## VISUAL FOUNDATIONS
- **Color:** near-neutral warm-grey paper (`#EEEFEA`) or near-black (`#0A0B09`), ink text, mute grey body. One accent: lime `#C6F432`, used for the wordmark cursor, the CTA, P-tags and headline highlight; in dark mode it is also the gain colour. On light backgrounds lime is never text — use `--accent-text #4A6400`. Loss is red (`#C2381C` / `#FF6A4D`), gain is green (`#3E7A00` / lime). Loss and gain appear only on figures.
- **Theming:** light by default; `data-theme="dark"` on any ancestor swaps all role tokens. Buttons invert: ink fill + lime text in light, lime fill + black text in dark.
- **Type:** Geist for display and body, Geist Mono for labels, buttons, paths and code. Display 600, 54px/1.02, −0.045em. Body 400 16/1.55 in mute. Labels 11–12px mono uppercase, 0.1–0.14em. Code 12.5/1.8.
- **Shape:** radius 0 everywhere. 1px hairline rules (`--rule`). No shadows, no gradients, no blur, no transparency effects.
- **Backgrounds:** flat colour only. No imagery, patterns, textures or illustrations. The terminal block is the main visual.
- **Cards:** `--surface` fill, 1px `--rule` border, square, no shadow (finding row, terminal, metric panel).
- **Layout:** two-column hero (copy left, finding + terminal right), 48px panel padding, 28px vertical stack gap, 12px between inline siblings. Section headers: three-column grid (mono number + title / note / right-aligned mono meta) over a hairline.
- **Animation:** none on the wordmark — ever. UI motion is minimal: opacity transitions ~120ms ease. The CLI replay in the UI kit reveals lines in steps, like real output.
- **Hover:** opacity to .8–.85. **Press:** no transform. **Focus:** ink border + 2px lime inset underline.
- **Imagery:** none in the source. If needed, prefer real storefront screenshots in square frames with a hairline border.

## ICONOGRAPHY
- No icon set exists in the source. The brand uses typographic glyphs as icons: `→` (action / next command), `$` (prompt), `·` (separator), `✓` (passed), `−` (loss), `▾` (select caret).
- No emoji, no icon font, no SVG sprites.
- The wordmark's lime block / underscore is the only mark. There is **no logo file**; the mark is the type treatment rendered by the `Wordmark` component (Geist 600, −0.05em, block 0.42×0.74em nudged 0.06em down; underscore 0.46×0.11em on the baseline).
- If icons become necessary, use Lucide (stroke 1.5, square caps) from CDN — this is a recommendation, not in the source.

## Fonts
Geist and Geist Mono load from Google Fonts via `tokens/fonts.css`. No local font binaries were supplied, so no `@font-face` files ship with the system.

---

## Index
- `styles.css` — entry point (imports only)
- `tokens/` — `fonts.css`, `colors.css` (light + `[data-theme="dark"]`), `typography.css`, `spacing.css`, `base.css` (`.t-display`, `.t-body`, `.t-label`, highlight `em`)
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand)
- `components/` — React primitives, one card per directory
- `ui_kits/site/` — marketing site + audit flow click-through
- `thumbnail.html`, `SKILL.md`

## Components
Namespace `window.TriageDesignSystem_045851`.
- brand: **Wordmark** (cursor / underscore)
- actions: **Button** (primary / secondary / ghost, md / sm)
- code: **InlineCode**, **InstallChip**, **Terminal**, **CodeToken**
- findings: **PriorityTag**, **FindingRow**
- data: **MetricPanel**
- navigation: **NavBar**
- forms: **Input**, **Select**, **Checkbox**
- layout: **SectionHeader**

### Intentional additions
- **CodeToken** — needed to colour CLI output inside Terminal per the brief's token map.
- **Select / Checkbox** — the brief lists "Form inputs" without specifics; these are the minimum for an audit setup form.
- Button **secondary/ghost** and **MetricPanel** visuals are not drawn in the source; they follow the system rules.

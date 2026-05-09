# CLAUDE.md

Operating context for the CRO Audit SPA build. Read this before doing anything else.

## What this project is

A React-based single-page application that replaces the existing Notion-template-based CRO audit deliverable. Owner is Tim Black (timblackdesign.com), running this under his Black Design, Inc. freelance practice. The SPA ships under the "CRO Audit System" brand — a Liftkit rebrand is planned but gated behind unrelated business validation work and is **not part of this build**.

The full v1 specification is in `SPEC.md`. Read it before writing any code. This file covers operating context that doesn't belong in the spec itself.

## Reference files in this repo

- **`SPEC.md`** — the v1 specification. Authoritative for what to build.
- **`audit-checklist-2026-05-03.csv`** — fresh export from Tim's Notion checklist database (verified 2026-05-03). This is the canonical source for the 60 audit items and their per-item fields.
- **`CLAUDE.md`** — this file.

## External references (do not modify)

- **Live ROI Calculator** — `https://cro-audit-system-for-shopify.netlify.app/roi-calculator`. The SPA's calculator step is derived from this. The HTML source has been reviewed and the relevant logic (lift database, suggested fee tiers, sanity check, pitch generator, print stylesheet) is described in SPEC.md. The live calculator continues to exist as a standalone tool — do not modify it as part of this build.
- **Existing Netlify site** — the SPA will eventually deploy alongside the live calculator at the same domain on a new path. Deploy mechanics are out of scope for the build itself.

## Tech stack

- **React** (single-component or small component tree, artifact-style if possible)
- **No backend.** All state in React + localStorage.
- **No build tooling required** if it can be avoided. If a build step is needed (e.g., for Tailwind), keep it minimal.
- **No external auth, no API calls, no database.** v1 is a self-contained client-side app.

## Build sequence

The spec lists 11 numbered build steps. Treat them as ordered checkpoints, not a single sprint:

- After **Step 1 (data structure)** — stop, show the unified JSON shape, get confirmation before continuing. This is the foundation; getting it wrong cascades.
- After **Step 8 (calculator step)** — stop, show the calculator panels in a working state, get confirmation before continuing. This step has the most logic and is where things can go subtly wrong (lift cap math, suggested fee tiers, true ROI calculation, sanity check states).
- Other steps can flow without explicit checkpoints unless something feels uncertain.

If a step requires a decision the spec doesn't resolve, ask before guessing.

## Things that are out of scope

The spec has a "Out of scope for v1" section — read it. A few items worth re-flagging here because they tend to creep in:

- **No backend, even a tiny one.** No serverless functions, no API routes, no auth. v1 is purely client-side.
- **No real PDF generation.** Browser print-to-PDF only. Do not pull in jsPDF, PDFKit, or any PDF library.
- **No image upload.** Screenshot URL paste only — string field, no file handling.
- **No magic link / entitlement / use-cap logic.** That's v1.5. v1 has no concept of "credits" or "uses remaining."
- **No Liftkit-specific styling.** SPA ships under CRO Audit System. The theme layer must be brand-agnostic, but the active brand is CRO Audit System.

If something in the spec feels like it needs one of the above to work properly, surface it as a question — don't quietly add it.

## Data integrity rules

- **One source of truth for checklist data.** The unified JSON (built from the CSV in Step 1) is the only place per-item data lives. Do not maintain a separate hardcoded list of items, lift ranges, or impact levels anywhere else in the codebase. The live calculator's `ISSUE_DB` array is a *reference*, not something to copy into the SPA verbatim — its lift ranges should be merged into the unified JSON.

- **localStorage schema is versioned.** The key `liftkit-audits-v1` is intentional and prefixed for forward compatibility. Do not rename it. If the schema changes mid-build, increment the version and write a migration.

- **No state lives in two places.** If something is in localStorage, it's not also in a separate React state hook that drifts out of sync. Use a single store pattern.

## Demo mode

The spec defines a `demoMode` flag set by URL path. When true:

- No localStorage reads or writes — nothing
- No JSON export/import controls visible
- All other UI identical to paid mode

Do not skip wiring this up to "add later." It's architecturally simpler to bake it in from Step 3 than to retrofit. The check is a single boolean read on app load.

## Style conventions

- **Match the live calculator's design tokens** as the starting point for the theme layer: DM Sans (body), DM Serif Display (headings), DM Mono (data/labels), indigo accent (`#6366f1` / `#4338ca`), dark paper background. The full color palette is in the live calculator's `:root` CSS — port it into the theme/config file.
- **CSS variables only** for any value that might change at rebrand time. No hardcoded color strings outside the theme file.
- **Mobile-first.** Tim cares about mobile because the Notion template's mobile experience is the specific failure mode this SPA exists to fix. Test mobile layouts as you go, not at the end.

## Working with the user

A few preferences worth knowing:

- Tim works iteratively and wants to understand the *why* behind decisions. When making a non-obvious technical call, name the alternative you considered and why you chose this one.
- He catches reasoning errors and expects corrections with clear re-explanation. If you realize you were wrong about something earlier, say so directly.
- Copy style preference: David Ogilvy crossed with Jason Fried — short sentences, numbers-first, no hype language. This applies to UI copy, error messages, empty states, and the default ROI pitch paragraph.
- He prefers blended solutions over picking one option, when the blend actually works. If two approaches each have something to offer, propose the blend rather than forcing a choice.

## When in doubt

- If the spec contradicts something in this file, the spec wins.
- If the spec is silent on something, ask before guessing.
- If a "small improvement" idea occurs to you mid-build, note it as a question or v1.1 candidate rather than adding it. Scope discipline is what makes the one-week target real.

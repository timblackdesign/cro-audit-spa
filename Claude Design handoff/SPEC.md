# CRO Audit SPA — v1 Spec

**Status:** Planning complete, ready for build
**Brand:** Ships under "CRO Audit System" (Liftkit rebrand deferred until 3–5 paid audits are documented)
**Target ship:** ~1 week from build start
**Replaces:** Notion template as the kit deliverable

---

## Why this exists

The current Notion-based deliverable is clunky on mobile and the "switch to desktop" caveat is a momentum killer for freelancers using the kit on-site or between client calls. A purpose-built SPA gives a UX that matches buyer expectations, removes the Notion duplication friction, and consolidates the audit + ROI calculator into one tool.

The SPA is built brand-agnostic so the eventual Liftkit rebrand is a styling pass, not a rebuild.

The same codebase serves two surfaces from day one: a paid version (workspace cap of 5 audits, localStorage-saved) and a demo version (no saving, no export, refresh wipes state) — controlled by URL path. This sets up a clean v1.5 transition where v1 paid retires, the demo continues as the public top-of-funnel, and v1.5 launches at a separate URL with magic-link gating and credit-based pricing.

---

## Scope — what ships in v1

The v1 cut is the audit experience plus the ROI calculator, in one tool. Single-device per audit. No backend, no auth, no real PDF generation.

### Audit experience

- 60 checklist items across 6 sections (10 items each):
  - General
  - Collection Page
  - Product Page
  - Cart
  - Checkout
  - Mobile/Performance
- Per-item editable fields:
  - Status (Pass / Fail / TBD / N/A)
  - Finding (default copy pre-populated, editable per audit)
  - Recommendation (default copy pre-populated, editable per audit)
  - Notes (free text)
  - Screenshot URL (URL paste only — no file upload in v1)
- Item display also shows (read-only): Impact, Effort, Estimated Fix Time, Impact Area, Shopify Fix Complexity

### Client info / audit setup

Captured up front, used by the calculator step:

- Client Name
- Auditor Name (per-audit field, defaults to last value used)
- Store URL
- Shopify Theme
- Audit Date
- Audit Fee (private to freelancer, not shown in client report)
- Monthly Revenue
- AOV (Average Order Value)
- CVR (Conversion Rate)

Implementation Price is set inside the calculator step (Your Pricing panel), not in client info — see Calculator step below.

### Multi-audit support

- List view of all saved audits in localStorage
- Each audit is independent (own client info, own per-item state)
- Start new / open existing / delete / archive / duplicate
- **Workspace cap of 5 active audits.** Enforced in UI only — no anti-tamper logic. Framed as a workspace ("Active audits: 3 of 5"), not a restriction.
- "Archive" action removes an audit from the active 5 and exports its JSON. This is the freelancer's normal workflow when delivery is complete and also conditions buyers for the v1.5 credit-consumption model.

### Persistence

- All state lives in `localStorage` per browser
- "Export audit" button → downloads JSON file (full audit state)
- "Import audit" button → loads JSON file back into the SPA
- This is the safety net for device switching, browser clearing, or sharing an audit-in-progress

### Demo mode

The same codebase serves two surfaces, controlled by URL path:

- **Paid mode** (e.g., `/audit`): full functionality as described above
- **Demo mode** (e.g., `/audit/demo`): public top-of-funnel preview

Demo mode behavior:

- `demoMode` flag set on load by reading the URL path
- **No localStorage reads or writes.** All state held in React state only. Refresh wipes everything.
- **No JSON export or import.** Audit state cannot be preserved across sessions or migrated into paid mode.
- **In-browser report still works.** Freelancer can complete a sample audit and view/print the client-facing output to feel the deliverable.
- No workspace cap (irrelevant — only one audit can exist per session)
- All other UI is identical to paid mode

Demo mode does not need to be deployed at v1 launch, but the architecture must support it from day one so v1.5 launch doesn't require a refactor.

### Calculator step

The calculator step in the SPA is derived from the live ROI Calculator (`https://cro-audit-system-for-shopify.netlify.app/roi-calculator`, source preserved in the project as the canonical reference). The CSV upload step is removed — audit data is already in the SPA.

The step has two panels side by side (stacked on mobile):

**Findings list (top, full width)**

Every Fail item is shown with a checkbox and these columns:

- Checkbox (drives inclusion)
- Checkpoint name + section
- Impact pill (High / Medium / Low)
- CVR Lift range (e.g., "+0.10–0.22%")
- Monthly Recovery (calculated from Sessions × AOV × midpoint lift)

Pre-check logic:

- Up to 10 items pre-checked by default
- Ranked by **Impact** (High → Medium → Low), then **Effort** (Low → High), then **checklist order** as final tiebreaker
- Hard cap at 10 even if more Highs exist
- Fewer than 10 Fails → all checked
- Items beyond the top 10 sit in a collapsible "X additional findings" accordion

Lift cap (defensive math, must carry forward):

- `LIFT_CAP_MIN = 3.0%`, `LIFT_CAP_MAX = 6.0%`
- Sum of checked findings' lift ranges is capped at this range before applying to CVR
- Prevents absurd projected CVR lifts when many items are checked

**Your Pricing panel (freelancer-private)**

Three sub-sections:

1. **Suggested Implementation Fee.** Tiered by ratio of High-impact findings among the checked items:
   - High ratio ≥ 50% → 20% of annual recovery
   - High ratio ≥ 25% → 15%
   - Otherwise → 10%
   - Display: suggested $ amount, suggested % with finding count, range bookends ($X at 10% – $Y at 20%)
   - "Your fee" input pre-fills with suggested as placeholder, freelancer can override

2. **True Client ROI.** Annual recovery ÷ (audit fee + implementation fee). Displayed as "X.X× return" with breakdown subtitle.

3. **Hourly Rate Sanity Check.** Inputs: min hourly rate, estimated hours. Compares implementation fee against `hourlyRate × hours`. Three states:
   - Pass (green): fee ≥ hourly estimate, shows surplus and percentage
   - Fail (red): fee < hourly estimate, shows shortfall
   - Neutral (gray): inputs incomplete

**Revenue Impact Summary panel (client-facing)**

Metric grid:

- Monthly Sessions (estimated from revenue / AOV / CVR)
- Current CVR (baseline from client info)
- Projected CVR (after applying capped lift)
- Monthly at Risk / Monthly Recovery
- Annual Revenue at Risk (large display)
- ROI subtitle: "X.X× return on total investment · pays back in N.N months"

**ROI Pitch Paragraph**

Auto-generated plain-English paragraph for proposals. Pulls in client name, monthly revenue, current and projected CVR, lift range, annual recovery, audit fee, implementation fee, and ROI multiple.

**Editable by default in v1.** "Edit" button converts the paragraph to a textarea so the freelancer can tweak language for specific clients. Edited copy persists with the audit. "Reset" button regenerates from current inputs if the freelancer wants to start over.

### Output / client report

- In-browser results page
- Print-to-PDF styling matches the live calculator's print stylesheet (white background, indigo accent rule, cover page with client name + auditor + date)
- Findings table renders without checkboxes in print
- Your Pricing panel is hidden in print (`.no-print`)
- ROI pitch paragraph renders with the print-friendly styling (left accent border, light background)
- No real PDF generation in v1 — that's v1.1

---

## Out of scope for v1

Parking lot for v1.1 and beyond:

- Backend / auth / cross-device sync
- Magic link entitlement system (v1.5)
- Gumroad webhook integration for credit issuance (v1.5)
- Migration script for issuing v1.5 credits to existing v1 buyers (v1.5)
- Real generated PDFs (using browser print for now)
- Image upload (URL paste only)
- AI-powered intake or auto-population from a store URL
- Liftkit rebrand styling (ships under CRO Audit System)
- Freelancer-side pricing module (target hourly rate, value-based percentage of opportunity, confidence weighting)
- Per-item methodology copy (lift ranges, rationale, client-facing framing)
- Notion data import (one-time migration tool — defer until needed)

---

## Technical decisions

### Stack

- **React** (single-file component, artifact-style)
- No build tooling required
- Plain HTML/JS was considered and rejected — too much state complexity (60 items × multi-audit × per-item editing)

### Hosting

- Same Netlify site as the current ROI calculator
- New path (suggested: `/audit` or similar)
- Auth-free shareable URL

### Theme layer

- Colors, fonts, product name, and copy strings live in a single theme/config file
- Liftkit rebrand becomes a styling pass on this file, not a rebuild
- Worth ~30 minutes upfront, saves days at rebrand time

### Data structure

- 60 items shipped as a static JSON file inside the app, derived from the latest Notion export (verified 2026-05-03 against `Audit Checklist a557e4ea7cb58335963081a2ef8ce47e_all.csv`)
- **Single source of truth.** The JSON consolidates the data currently split between two places:
  - The Notion export's per-item fields (Name, Section, Impact, Effort, Estimated Fix Time, Impact Area, Shopify Fix Complexity, Finding, Recommendation)
  - The live calculator's `ISSUE_DB` array (per-item `liftMin` and `liftMax`)
- The SPA's calculator logic must read lift ranges from this unified JSON, not maintain a separate hardcoded list. If lift ranges need updating, they update in one place.
- Per-item static fields: `id`, `name`, `section`, `impact`, `effort`, `estimated_fix_time`, `impact_area`, `shopify_fix_complexity`, `default_finding`, `default_recommendation`, `lift_min`, `lift_max`
- Per-audit state stored separately: `status`, `finding` (override), `recommendation` (override), `notes`, `screenshot_url`
- All 60 calculator `ISSUE_DB` fragments match exactly to Notion item names (verified — no orphans on either side). The "Thumb-Zone" item that was missing from the older project file is present in the current Notion source.

### Local storage schema

```
liftkit-audits-v1: {
  audits: {
    [audit_id]: {
      id,
      client_info,
      items: { [item_id]: { status, finding, recommendation, notes, screenshot_url } },
      pricing: { audit_fee, implementation_fee, hourly_rate, estimated_hours },
      pitch_override: string | null,    // null = use generated paragraph
      created_at,
      updated_at
    }
  },
  active_audit_id: string | null,
  last_auditor_name: string | null      // remembered across audits, defaults the field on new audits
}
```

(Naming the storage key with `liftkit-` prefix even under CRO Audit System branding so a rebrand doesn't break existing audits.)

---

## Open questions / decisions deferred

- **Hosting path name** — `/audit`? `/app`? Something else? Decide before deploy.
- **Default Finding and Recommendation copy** — current Notion defaults are fine for v1 but should be revisited as part of the methodology documentation work that's in progress separately.
- **Status terminology** — Pass / Fail / TBD / N/A is current Notion convention. "Fail" reads aggressive in client-facing output. The SPA can map internally: status = "fail" displays as "Issue Found" in the report. Worth aligning with the methodology copy later.

---

## Build sequence

Suggested order so each step has a checkpoint:

1. **Data structure** — convert latest Notion CSV + calculator's `ISSUE_DB` into a single unified JSON, define schema, confirm shape
2. **Theme/config layer** — colors, type, product name, copy strings (start from live calculator's design tokens — DM Sans / DM Serif Display / DM Mono, indigo accent, dark paper background)
3. **Mode detection** — read URL path, set `demoMode` flag, gate localStorage reads/writes accordingly
4. **Audit list view** — start new, open existing, delete, archive, duplicate, workspace cap of 5
5. **Client info form** — captured before audit starts (includes Auditor Name with last-used default)
6. **Audit experience** — section nav, per-item view, status + edits + notes + screenshot URL
7. **JSON export/import** — disabled in demo mode
8. **Calculator step** — Findings list with pre-check logic and lift cap, Your Pricing panel (suggested fee, true ROI, hourly sanity check), Revenue Impact Summary, editable ROI pitch paragraph
9. **Output / client report** — in-browser results page, print-to-PDF styling matching live calculator's print stylesheet (cover page, hidden checkboxes, hidden Your Pricing panel, white background)
10. **Polish pass** — mobile UX (sticky button pattern from live calculator), empty states, error handling, demo mode messaging
11. **Deploy** — Netlify, paid mode at primary path; demo path can deploy now or wait for v1.5 launch

Step 1 is a natural first checkpoint to review before going further — the data shape determines everything downstream. Step 8 is the second natural checkpoint — the calculator step has the most logic and is where most things can go subtly wrong.

---

## v1.5 transition plan

v1.5 adds a real entitlement layer: backend-issued magic links with a lifetime credit cap, sold as credit packs. The v1 codebase carries forward — v1.5 is an additional surface, not a rebuild.

### Architecture at v1.5 launch

- **Paid v1** retires from new sales but its URL stays live for ~2 months as a grace period for buyers mid-audit
- **Demo mode** (same codebase, `demoMode === true`, served at the demo URL path) becomes the permanent public top-of-funnel
- **v1.5** launches at a separate path or subdomain (e.g., `/app` or `app.timblackdesign.com`), gated by magic link
- v1.5 may be a fork or a sibling app — architectural decision deferred to v1.5 planning

### Magic link mechanics (v1.5, not v1)

- Backend issues a unique URL on Gumroad purchase (Gumroad webhook → backend token issuance)
- Each link grants a fixed number of credits (5 per pack as a starting point, up for debate)
- Each completed/archived audit decrements the counter
- Counter hits zero → buyer purchases another credit pack
- Stack: Laravel is the current preferred backend choice (deferred decision)

### Migration grace for existing v1 buyers

- Every paid v1 buyer (via Gumroad) receives 10–15 v1.5 credits as a thank-you at v1.5 launch
- Issued via emailed magic link
- Requires: scripted issuance against the Gumroad buyer list (v1.5 engineering task)

### Data portability requirements

- v1 JSON export must be importable into v1.5 (schema compatibility maintained)
- Schema version baked into localStorage key from day one (`liftkit-audits-v1`) so v1 and v1.5 don't collide if both are open in the same browser

### What does not change at v1.5

- The 60-item checklist data
- The audit experience UI (sections, per-item editing, status flow)
- The calculator step logic and pre-check rules
- The in-browser report / print-to-PDF output
- The theme/config layer (Liftkit rebrand still triggered separately by audit validation)

---

## Trigger conditions for the Liftkit rebrand

Unchanged from the existing kickoff doc. All must be true:

1. 3–5 real paid audits completed
2. Documented outcomes (revenue impact, conversion changes, retainer conversions)
3. Case studies or testimonials usable in marketing
4. Domain secured
5. Phase 1 repositioning of the current CRO Audit System completed

The SPA shipping under CRO Audit System does not change these conditions. When triggered, the rebrand is a theme-layer styling pass plus domain/copy updates. The rebrand is independent of the v1 → v1.5 transition — they may happen together or separately.

---

*Spec version: 1.2 — integrates live calculator (Your Pricing panel, lift cap, suggested fee tiers, sanity check, editable pitch paragraph, print stylesheet)*

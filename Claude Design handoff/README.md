# Handoff: CRO Audit System SPA v1

## Overview

A single-page React app that replaces a Notion-template-based audit deliverable for solo Shopify freelancers. The freelancer creates a client audit, works through 60 checklist items across 6 sections (status + notes + screenshot URL per item), reviews findings, runs an ROI calculator, and generates a print-ready client report.

**Live prototype:** `CRO Audit SPA.html` in the parent directory — open this in a browser to see and interact with the full design.

## About the Design Files

The files in this bundle are **high-fidelity design prototypes built in HTML/JSX using inline Babel** — not production code. They show intended look, behavior, interactions, and data flow. The task is to **recreate these designs in a real React codebase** with a proper build pipeline (Vite or similar), using the design tokens, component patterns, and logic documented here.

Do not ship the HTML prototype files directly. They use CDN-loaded React + Babel for prototyping speed; production needs a proper build.

## Fidelity

**High-fidelity.** Colors, typography, spacing, interactions, animation, and data logic are final. Recreate pixel-accurately using the design tokens below.

---

## Architecture

### Stack
- **React 18** (hooks only — no class components)
- **No external UI library** — all components are custom, built from design tokens
- **localStorage** for persistence (key: `liftkit-audits-v1`)
- **No backend** — v1 is fully client-side
- **Demo mode** — detected from URL path (`/demo` or `?demo=1`); disables localStorage reads/writes

### File Structure (prototype → production mapping)

| Prototype file | Production equivalent |
|---|---|
| `CRO Audit SPA.html` | `src/App.tsx` + `src/main.tsx` |
| `data/audit-items.js` | `src/data/auditItems.ts` |
| `Components.jsx` | `src/components/ui/` (Card, Button, ImpactPill, etc.) |
| `screens/AuditList.jsx` | `src/screens/AuditList.tsx` |
| `screens/ClientInfo.jsx` | `src/screens/ClientInfo.tsx` |
| `screens/AuditScreen.jsx` | `src/screens/AuditScreen.tsx` |
| `screens/FindingsScreen.jsx` | `src/screens/FindingsScreen.tsx` |
| `screens/CalculatorScreen.jsx` | `src/screens/CalculatorScreen.tsx` |
| `screens/ReportScreen.jsx` | `src/screens/ReportScreen.tsx` |

### Screen Flow

```
List → [Start New Audit] → AuditScreen (02)
                             ↓ [Review Findings →]
                           FindingsScreen (03)
                             ↓ [Calculate ROI →]
                           CalculatorScreen (04)
                             ↓ [View PDF Report →]
                           ReportScreen (05)

List → [Open existing] → AuditScreen
Header [✎ Client Name] → ClientInfo (edit mode) → back to AuditScreen
```

---

## localStorage Schema

```typescript
interface StorageRoot {
  audits: Record<string, Audit>;
  active_audit_id: string | null;
  last_auditor_name: string | null;
}

interface Audit {
  id: string;
  client_info: ClientInfo;
  items: Record<string, ItemState>; // keyed by item id (e.g. "gen-01")
  pricing: {
    implementation_fee?: number;
    hourly_rate?: number;
    estimated_hours?: number;
  };
  pitch_override: string | null; // null = use generated paragraph
  created_at: string; // ISO
  updated_at: string; // ISO
}

interface ClientInfo {
  client_name: string;
  auditor_name: string;
  store_url: string;
  shopify_theme: string;
  audit_date: string; // YYYY-MM-DD
  monthly_revenue: number | '';
  aov: number | '';
  cvr: number | '';
  audit_fee: number | '';
}

interface ItemState {
  status: 'pass' | 'fail' | 'tbd' | 'na';
  finding: string;       // overrides default_finding; empty = use default
  recommendation: string; // overrides default_recommendation; empty = use default
  notes: string;
  screenshot_url: string;
}
```

Storage key: `liftkit-audits-v1`  
**Schema version is baked into the key** for v1.5 migration compatibility.

---

## Audit Item Data Structure

All 60 items live in `data/audit-items.js`. Each item has:

```typescript
interface AuditItem {
  id: string;           // e.g. "gen-01", "pdp-03", "mob-06"
  section: string;      // "General" | "Collection Page" | "Product Page" | "Cart" | "Checkout" | "Mobile/Performance"
  name: string;
  impact: 'High' | 'Medium' | 'Low';
  effort: 'Low' | 'Medium' | 'High';
  fix_time: string;     // e.g. "< 1 hr", "2–4 hrs"
  impact_area: string;
  complexity: string;   // Shopify fix complexity description
  liftMin: number;      // CVR lift minimum, e.g. 0.10 (= 0.10%)
  liftMax: number;      // CVR lift maximum, e.g. 0.22
  default_finding: string;
  default_recommendation: string;
}
```

Sections (6 × 10 items each):
- `General` (gen-01 → gen-10)
- `Collection Page` (col-01 → col-10)
- `Product Page` (pdp-01 → pdp-10)
- `Cart` (cart-01 → cart-10)
- `Checkout` (chk-01 → chk-10)
- `Mobile/Performance` (mob-01 → mob-10)

---

## Screens

### 1. Audit List (`AuditList.tsx`)

**Purpose:** Landing surface. Shows all saved audits. Entry point to create or open audits.

**Layout:**
- Max width: 840px, centered, padding 48px top/bottom 24px sides
- Header row: "Your audits" (DM Serif Display 32px) + "Start New Audit" button (top-right)
- Workspace cap bar: thin 2px progress bar (accent fill) + "X/5 workspaces" mono label
- Audit cards: flex row, 2px gap between cards (gap acts as hairline rule)
- Empty state: centered card with serif heading + DM Sans body + CTA button

**Audit card anatomy (per row):**
- 2px progress fill bar at top (accent color, fills left→right by % complete; green when 100%)
- `padding: 18px 20px`, flex row, `gap: 20px`
- Index number: DM Mono 11px `var(--ink-5)` (zero-padded: "01", "02"...)
- Client name: DM Serif Display 17px + amber "Setup incomplete" pill (if name = "New Client" OR metrics missing)
- Store URL below name: DM Mono 10px `var(--ink-5)`
- Progress: DM Mono 12px right-aligned (`done / 60`) + status label below (DM Mono 10px)
- Updated date: DM Mono 10px + 11px, right-aligned
- "Open" button: accent bg, white text, DM Sans 12px semibold uppercase
- `···` overflow menu: `var(--paper-3)` bg, `var(--rule)` border — triggers dropdown with Duplicate / Archive & Export / Delete

**Workspace cap:** Max 5 active audits. When full, show a note below the list (not a modal).

**"Setup incomplete" badge:** amber (`#c8834a`) text, `rgba(200,131,74,0.1)` bg, `rgba(200,131,74,0.25)` border. Show when `client_name === 'New Client'` OR any of `monthly_revenue`, `aov`, `cvr` are empty.

**"Start New Audit":** Creates a new audit immediately with placeholder data (client_name: "New Client", today's date, empty metrics). Sets `activeAuditId`. Navigates to AuditScreen. **No form gate.**

---

### 2. Client Info (`ClientInfo.tsx`)

**Purpose:** Edit-only screen (not a creation gate). Accessible via header "✎ Client Name" button.

**Layout:** Max width 600px, centered, padding 40px top

**Form sections (two cards with 2px gap):**
1. **Essential fields** (`var(--paper-2)` bg, `var(--rule)` border, `padding: 20px`):
   - Auto-fit grid, min 200px columns, gap 16px
   - Fields: Client Name*, Auditor Name, Store URL, Audit Date (date input)
2. **Collapsible: Store metrics & pricing** (collapsed by default):
   - Toggle button with `▼` chevron that rotates on open
   - Fields: Monthly Revenue ($), Avg Order Value ($), Conversion Rate (%), Audit Fee ($), Shopify Theme
   - Label: "optional — needed for ROI calculator"

**Sticky footer CTA:**
- `position: fixed, bottom: 0, left: 0, right: 0`
- `var(--paper)` bg, `var(--rule)` border-top, padding 14px 24px
- Right-aligned: hint text (DM Mono 11px) + "Save & Return →" button
- Button disabled (opacity 0.6, `var(--paper-3)` bg) until `client_name` is non-empty

**CRITICAL: All inputs must be defined as components OUTSIDE the screen component** to prevent React remounting on every render (which causes focus loss after one keystroke). See `CIInput` and `CIFieldLabel` in `screens/ClientInfo.jsx`.

---

### 3. Audit Screen (`AuditScreen.tsx`)

**Purpose:** Core working surface. 6 sections × 10 items. Freelancer marks Pass/Fail/TBD/N/A per item.

**Layout:** Full-height flex column
```
[App Header 52px]
[Sticky Step Bar ~60px]
[Body: Sidebar 220px | Item Card flex-1]
[Sticky Bottom CTA Bar ~56px]
```

**Sticky Step Bar:**
- `var(--paper-2)` bg, `var(--rule)` border-bottom
- 2px progress bar at top (accent fill, 0–100% of 60 items complete)
- Two rows:
  - Row 1: `02 — CHECKLIST` badge (accent bg, white text, DM Mono 9px) + section name (DM Mono 10px `var(--ink-3)`)
  - Row 2: `Item X/10` · `Y/60 complete` (DM Mono 10px `var(--ink-5)`)
- Right side: `Review Findings →` button — greyed/bordered when no items marked; accent bg when ≥1 item marked

**Sidebar (220px, `var(--paper-2)` bg, desktop only — hidden below 600px):**
- Top zone: Section switcher (6 rows) — each row has short code (GEN/COL/PDP...) + done/total count. Active section has `var(--accent)` left border + `var(--paper-3)` bg. Clicking switches section and resets to item 1.
- Bottom zone: Item list for active section (10 rows) — each row has 7px status dot + item name (2-line clamp) + item number. Active item has `var(--accent)` left border.

**Status dot colors:** TBD = `var(--rule-2)` with border, Pass = `var(--state-pass)`, Fail = `var(--state-fail)`, N/A = `var(--ink-5)`

**Item Card (scrollable area, max-width 600px centered):**

All card sub-components use 2px gaps (gap acts as hairline rule).

1. **Item header** (`var(--paper-2)` bg, `var(--rule)` border):
   - H2: DM Serif Display 19px, `var(--ink)`, `letter-spacing: -0.3px`
   - Pills row: Impact + Effort + Fix Time + CVR lift range — all DM Mono 10px, `var(--paper-3)` bg. Impact pill uses semantic colors.
   - CVR lift pill: `var(--accent-positive)` text, `var(--paper-3)` bg, e.g. `+0.10–0.22% CVR`
   - "Details" toggle: reveals Impact Area + Shopify Complexity in 2-col grid

2. **Status** (`var(--paper-2)` bg, `var(--rule)` border):
   - Label: DM Mono 10px 600 uppercase `var(--ink-4)`, margin-bottom 8px
   - 4 equal-width buttons: Pass / Fail / TBD / N/A
   - Each: `padding: 13px 6px`, `var(--paper-3)` bg by default
   - Active states: Pass = `var(--state-pass-bg)` + `#86efac` border; Fail = `var(--state-fail-bg)` + `#fca5a5` border; TBD = `var(--paper-3)` + `var(--rule-2)` border; N/A = `var(--paper)` + `var(--rule)` border

3. **Finding** (only visible when status = fail):
   - `rgba(252,165,165,0.2)` border
   - Header: "FINDING" in `var(--state-fail)` + "in client report" right-aligned
   - Textarea pre-populated with `default_finding`; editable per audit
   - Edit overrides stored in `items[itemId].finding`

4. **Recommendation** (only visible when status = fail):
   - Same pattern, "RECOMMENDATION" label in `var(--ink-3)`

5. **Notes + Screenshot** (collapsible, always visible):
   - Toggle shows "Notes · screenshot" when content exists
   - Textarea for private notes (not in report)
   - URL input for screenshot URL

6. **Bottom nav** (2-col grid):
   - Prev: left-aligned, shows "← PREV" + truncated previous item name (22 chars max)
   - Next: right-aligned, shows "NEXT →" + truncated next item name
   - Last item: Next becomes "Review Findings →" (accent bg)

**Sticky Bottom CTA Bar (fixed, full-width):**
- `var(--paper-2)` bg, `var(--rule)` border-top, `padding: 12px 20px`
- Left: "≡ SECTION · X/10" mobile drawer trigger (hidden on desktop) + progress text
- Right: "Mark items to continue" (greyed, disabled) → "Review Findings →" (accent) once ≥1 item marked

**Mobile Drawer (< 600px):**
- Fixed overlay, `rgba(0,0,0,0.6)` scrim
- Bottom sheet slides up, max-height 80vh
- Top: 3×2 section grid
- Below: scrollable item list for active section

**CRITICAL: ALL textarea and input components must be defined OUTSIDE the screen component** to prevent focus loss. See `AuditTextarea`, `AuditUrlInput` in `screens/AuditScreen.jsx`.

---

### 4. Findings Screen (`FindingsScreen.tsx`)

**Purpose:** Review all Fail items, select which to include in ROI calculation. Step 3 of 4.

**Layout:** Max width 900px, centered, padding 32px top, 80px bottom (for fixed bar)

**Pre-check logic (run when entering screen):**
1. Collect all items with `status === 'fail'`
2. Sort by: Impact (High=0, Medium=1, Low=2), then Effort (Low=0, Medium=1, High=2), then checklist order
3. Pre-check top 10; uncheck the rest

**Table columns:** Checkbox | Checkpoint + Section | Impact pill | CVR Lift range | Monthly Recovery (if metrics set)

**Monthly Recovery calculation per item:**
```
sessions = revenue / (aov × (cvr/100))
monthly = sessions × aov × (liftMid/100)
where liftMid = (liftMin + liftMax) / 2
```

**Accordion:** Items beyond top 10 in a collapsible row at bottom of table. Default collapsed.

**Row behavior:** Entire row is clickable to toggle checkbox. Unchecked rows at `opacity: 0.38`.

**Filter input:** Text input — filters visible items by name or section. Must be defined OUTSIDE component.

**Select/Deselect All button:** Toggles all ranked items.

**Metrics gate modal:** If store metrics are missing when "Calculate ROI →" is clicked:
- Overlay: `rgba(0,0,0,0.7)` scrim, centered modal
- `var(--paper-2)` bg, `var(--rule-2)` border, `box-shadow: 0 24px 64px rgba(0,0,0,0.6)`
- Two buttons: "Add metrics →" (accent, routes to ClientInfo edit) | "Continue anyway" (ghost)

**Sticky Bottom CTA Bar:**
- Left: "X findings included"
- Right: "Calculate ROI →" (always accent — gate handled on click)

---

### 5. Calculator Screen (`CalculatorScreen.tsx`)

**Purpose:** ROI math — pricing panel (private) + revenue impact summary. Step 4 of 4.

**Layout:** Max width 1060px, centered. Two-column grid: `minmax(260px, 340px) 1fr`, gap 2px. Stacks to 1 column on mobile.

#### Left Panel — Your Pricing (private, not in report)

**"PRIVATE" badge** in header: `var(--paper-3)` bg, `var(--rule)` border.

**Suggested Implementation Fee:**
```typescript
const highCount = checkedItems.filter(f => f.impact === 'High').length;
const highRatio = checkedItems.length > 0 ? highCount / checkedItems.length : 0;
const feePercent = highRatio >= 0.5 ? 0.20 : highRatio >= 0.25 ? 0.15 : 0.10;
const suggestedFee = Math.round(annualRecovery * feePercent);
```
Display: DM Serif Display 30px `var(--accent-positive)` + "X% of annual" label. Range note below.
"Your fee" input: overrides suggested fee. Pre-filled with placeholder = suggestedFee.

**True Client ROI:**
```
trueROI = annualRecovery / (auditFee + implementationFee)
payback = totalInvestment / monthlyRecovery  // in months
```
Display: DM Serif Display 26px `var(--accent-positive)`, e.g. "7.2×"

**Hourly Rate Sanity Check:**
- Two inputs: Min hourly ($) + Est. hours
- Compare: `implementationFee` vs `hourlyRate × hours`
- Pass (green `#86efac` bg tint): fee ≥ hourly estimate
- Fail (red `#fca5a5` bg tint): fee < hourly estimate
- Neutral (`var(--paper-3)`): inputs incomplete

#### Right Panel — Revenue Impact Summary

**CVR lift cap (CRITICAL — must implement):**
```typescript
const LIFT_CAP_MIN = 3.0; // %
const LIFT_CAP_MAX = 6.0; // %

let totalMid = 0, totalMin = 0, totalMax = 0;
checkedItems.forEach(f => {
  totalMid += (f.liftMin + f.liftMax) / 2;
  totalMin += f.liftMin;
  totalMax += f.liftMax;
});
const cappedMid = Math.min(totalMid, (LIFT_CAP_MIN + LIFT_CAP_MAX) / 2);
const cappedMin = Math.min(totalMin, LIFT_CAP_MIN);
const cappedMax = Math.min(totalMax, LIFT_CAP_MAX);

const sessions = revenue / (aov * (cvr/100));
const newCVR = (cvr/100) + (cappedMid/100);
const monthlyRecovery = (sessions * aov * newCVR) - revenue;
const annualRecovery = monthlyRecovery * 12;
```

**Metric grid** (3 columns, `gap: 1px`, `var(--rule)` bg acting as hairline borders):
- Monthly Sessions (estimated)
- Current CVR (baseline)
- Projected CVR (after capped lift) — `var(--accent-positive)` color
- Monthly Recovery — `var(--accent-positive)` color
- Annual Revenue at Risk (spans 2 cols) — DM Serif Display 36px `var(--accent-positive)`

**Structured Proposal Block** (replaces old pitch paragraph):
5 labeled rows in a data table format (1px hairline grid):
- **Scope**: `X issues identified across Y sections of [client name]`
- **Projected Lift**: `X–Y% CVR improvement · $Z/mo recovered`
- **Annual Impact**: `$XXXK` (DM Serif Display 22px, accent-positive)
- **Investment**: `$X audit + $Y implementation = $Z total`
- **Client ROI**: `X.X× return · pays back in Y months`

"Edit text" toggle converts to textarea for custom copy. "Reset" regenerates from current inputs. Edited copy stored in `audit.pitch_override`.

**Sticky Bottom CTA Bar:**
- Left: "X findings · $Y annual recovery" (or "add metrics for $ figures")
- Right: "View PDF Report →" (always accent)

**CRITICAL: All number inputs must be defined OUTSIDE the component** to prevent focus loss. See `CalcNumberInput`, `CalcPitchTextarea` in `screens/CalculatorScreen.jsx`.

---

### 6. Report Screen (`ReportScreen.tsx`)

**Purpose:** Print-ready client-facing document. White-paper editorial style. `@media print` flips the entire app.

**Layout:** White background (`#fff`). Max width 780px, centered, padding 60px 48px.

**Document structure:**
1. **Cover block**: indigo kicker (`#6366f1` DM Mono 10px) → H1 client name (DM Serif Display 40px `#1e1b4b`) → metadata row (Auditor / Date / Store / Theme)
2. **Revenue Impact Summary**: 3-col metric grid (same data as calculator, light mode colors) + Pitch/Proposal box (left border `4px solid #4338ca`, `#f0f2fe` bg)
3. **Findings table**: Grouped by section. Each section has an indigo section header (DM Mono, `2px solid #4338ca` bottom border). Per item: H3 name + pills + Finding text + Recommendation text + Screenshot URL if present.
4. **Footer**: auditor name + date, `#dde0f5` border-top

**Print-only elements:** All UI chrome has `className="no-print"` (`display: none !important` in `@media print`). The `#print-document` div has white bg and black text forced.

**Hidden in report:** Your Pricing panel, checkboxes, all interactive controls.

---

## Design Tokens

### Colors (dark mode — default for app UI)

```css
--paper:   #0e1018   /* base background */
--paper-2: #161925   /* card/surface */
--paper-3: #1e2235   /* raised surface / input bg */
--rule:    #252840   /* hairline border */
--rule-2:  #363a55   /* stronger border */
--ink:     #e2e8f0   /* primary text */
--ink-2:   #c8d0e0   /* secondary text */
--ink-3:   #94a3b8   /* tertiary text */
--ink-4:   #64748b   /* muted / labels */
--ink-5:   #475569   /* very muted / meta */

--accent:             #6366f1   /* indigo-500 — CTA, focus, badges */
--accent-bg:          rgba(99,102,241,0.12)
--accent-positive:    #818cf8   /* indigo-400 — positive metrics, revenue */
--accent-positive-bg: rgba(129,140,248,0.12)

--impact-high:        #f87171   /* red */
--impact-high-bg:     rgba(248,113,113,0.12)
--impact-medium:      #a78bfa   /* violet */
--impact-medium-bg:   rgba(167,139,250,0.12)

--state-pass:         #86efac   /* green-300 */
--state-pass-bg:      rgba(34,197,94,0.08)
--state-fail:         #fca5a5   /* red-300 */
--state-fail-bg:      rgba(248,113,113,0.08)

--shadow: 0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.25)
```

### Typography

Three families from Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet">
```

| Role | Family | Size | Weight | Letter-spacing | Transform |
|---|---|---|---|---|---|
| App logo / card titles | DM Serif Display | 16–32px | 400 | -0.3px to -0.5px | — |
| Hero/section headings | DM Serif Display | 28–40px | 400 | -0.5px to -1.5px | — |
| Metric values large | DM Serif Display | 30–36px | 400 | -1px | — |
| Body / descriptions | DM Sans | 13–15px | 300–400 | normal | — |
| Buttons | DM Sans | 12–13px | 600 | 0.06em | uppercase |
| Labels / kickers | DM Mono | 9–11px | 400–600 | 0.08–0.14em | uppercase |
| Inputs / data | DM Mono | 12–14px | 400 | normal | — |
| Meta / hints | DM Mono | 9–10px | 400 | 0.08–0.1em | uppercase |

### Border Radius
**Zero everywhere.** No border-radius on any UI element. The only exceptions: status dot circles (`50%`).

### Spacing
Base unit: 4px. Common values: 5, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32px.
Card padding: 20px mobile, 18–20px app cards.

### Transitions
- Fast (color/opacity): `0.12–0.15s linear`
- Base (hover states): `0.2s`
- Screen entrance: `0.28s cubic-bezier(0.16, 1, 0.3, 1)` (slide up + fade)
- Screen exit: `0.18s ease-in` (slide up + fade out)

---

## Screen Transition System

All screen changes use a slide-up animation:

```css
@keyframes slideUpIn {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes slideUpOut {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(-12px); }
}
```

Implementation: `key={currentScreen}` on the main content wrapper triggers remount on screen change. A `transitioning` boolean controls whether `.screen-exit` or `.screen-enter` class is applied. Exit plays for 200ms, then the new screen mounts with entrance animation.

---

## Demo Mode

```typescript
const DEMO_MODE = window.location.pathname.includes('/demo') 
  || window.location.search.includes('demo=1');
```

When `DEMO_MODE === true`:
- Skip all localStorage reads/writes
- State lives only in React state (refresh wipes everything)
- No JSON export/import
- Show "Demo" badge in header (amber: `#c8834a`, `rgba(200,131,74,0.12)` bg)
- No workspace cap (irrelevant for single-session use)
- All other UI identical

---

## Print System

```css
@media print {
  body { background: #fff !important; color: #111 !important; }
  .no-print { display: none !important; }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  @page { margin: 0.75in; size: letter; }
}
```

All app chrome, navigation, and pricing panels use `className="no-print"`. The `#print-document` div contains the white-paper report.

Print accent color: `#4338ca` (indigo-700, higher contrast than the `#6366f1` used on screen).

---

## Known TODOs / Future Work

- **Real PDF generation** (v1.1) — currently uses `window.print()`. Target: Puppeteer or similar server-side PDF.
- **Backend / auth** (v1.5) — magic-link gating with credit packs via Gumroad webhook + Laravel backend.
- **Image upload** — v1 is URL-paste only. v1.1 adds file upload.
- **Cross-device sync** — v1 is single-device localStorage. v1.5 adds cloud storage.
- **Liftkit rebrand** — theme-layer styling pass only; no structural changes needed.

---

## Files in This Package

| File | Description |
|---|---|
| `README.md` | This file |
| `CRO Audit SPA.html` | Full interactive prototype — open in browser |
| `Components.jsx` | Shared UI primitives (Card, Button, ImpactPill, etc.) |
| `data/audit-items.js` | All 60 audit items with lift ranges + default copy |
| `screens/AuditList.jsx` | Audit list screen |
| `screens/ClientInfo.jsx` | Client info edit screen |
| `screens/AuditScreen.jsx` | Core audit checklist screen |
| `screens/FindingsScreen.jsx` | Findings review screen |
| `screens/CalculatorScreen.jsx` | ROI calculator screen |
| `screens/ReportScreen.jsx` | Print-ready client report |
| `tweaks-panel.jsx` | Design tweaks panel (prototype only — not needed in production) |
| `SPEC.md` | Full v1 product specification |
| `colors_and_type.css` | Full design token CSS |

# BUILD_NOTES.md

Architectural facts that are not obvious from reading the code. Read this before touching the data layer.

---

## Babel standalone is pinned — do not un-pin it

`index.html` loads `@babel/standalone@7.23.2` from unpkg (pinned). Do not change this to the un-versioned URL (`babel.min.js` without a version). Newer Babel standalone versions default to the automatic JSX runtime, which emits `import { jsx } from 'react/jsx-runtime'` — that `import` statement crashes in a non-module `<script>` tag. 7.23.2 uses the classic runtime by default and works correctly with this app's inline Babel setup.

## Supabase free tier auto-pauses

The Supabase project pauses after ~1 week of inactivity on the free tier. If the app loads the login screen but auth fails with a database error, go to the Supabase dashboard and click "Resume project". It takes ~60 seconds to come back up.

---

## audit-items.js is generated — do not edit it directly

`audit-items.js` is written by `scripts/export-checklist.js` at every Netlify deploy. Any manual edits will be overwritten on the next build. The file is committed to the repo only so the dev server works locally without running the export script first.

## Source of truth: Supabase `checklist_items` table

All 60 checklist item definitions live in the `checklist_items` table on the project's Supabase instance (`https://wnwcpgqyenredfuhkhlx.supabase.co`).

**Columns:** `id`, `name`, `section`, `impact`, `estimated_fix_time`, `impact_area`, `shopify_fix_complexity`, `default_finding`, `default_recommendation`, `lift_min`, `lift_max`, `sort_order`, `primary_viewport`

## How to regenerate audit-items.js

```bash
SUPABASE_URL=<url> SUPABASE_ANON_KEY=<anon_key> node scripts/export-checklist.js
```

Or just deploy — `export-checklist.js` runs automatically as part of the Netlify build command.

## How schema changes work

1. Add the column in the Supabase SQL editor (`ALTER TABLE checklist_items ADD COLUMN ...`)
2. Write a targeted update script in `scripts/` that sets values for the new column — use `upsert` keyed on `id`, touch only the columns you own
3. Run the update script with `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (service role needed for writes)
4. Add the new column name to the `.select(...)` list in `scripts/export-checklist.js`
5. Re-run the export script (or deploy) to regenerate `audit-items.js`

## sort_order controls global item order

The export query does `.order('sort_order')` globally across all 60 items. The frontend groups items into sections using `AUDIT_ITEMS.filter(i => i.section === s)`, so within-section display order is determined by each item's relative `sort_order` value. Sort order values are assigned in section bands (0–9 General, 10–19 Collection, 20–29 Product, 30–39 Cart, 40–49 Checkout, 50–59 Mobile/Performance).

## seed-checklist.js is a one-time script

`scripts/seed-checklist.js` was used once to populate the table from `audit-items.json`. Do not re-run it — it would overwrite any changes made to the DB since the initial seed. For ongoing updates, write targeted update scripts.

## Per-audit state: Supabase `audits` table

Each audit is a single JSON blob stored in `audits.data`. Per-item state lives in `audit.items[itemId]` — a flat object shallow-merged by `handleUpdateItem` (line ~3324 in index.html). Adding new per-item fields (e.g., `fails_on_desktop`) just requires adding them to `getItemState()` defaults; the existing merge and debounced Supabase upsert pick them up automatically.

## Demo mode

URL path `/demo` sets `demoMode = true`. All localStorage reads/writes and all Supabase writes are skipped. The UI renders identically. No special handling is needed for new UI features — they just work.

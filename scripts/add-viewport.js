// scripts/add-viewport.js
// Adds primary_viewport to checklist_items and re-sorts items within sections
// so desktop items come first, then 'both', then mobile at the end.
//
// Run AFTER the SQL migration:
//   ALTER TABLE checklist_items ADD COLUMN IF NOT EXISTS primary_viewport text NOT NULL DEFAULT 'both';
//
// Usage:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/add-viewport.js

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const MOBILE_IDS = [
  'filter-logic',
  'order-summary-toggle',
  'sticky-cta-cart',
  'search-visibility',
  'tap-targets',
  'thumb-zone',
  'input-font-size',
  'mobile-navigation',
  'page-speed',
  'lcp',
];

const DESKTOP_IDS = ['secondary-hover-image'];

// New sort_order values — only items that need to move are listed.
// Items not listed here are already in the correct position.
const SORT_ORDER_UPDATES = [
  // General band (0–9): search-visibility + tap-targets move to end
  { id: 'predictive-search',    sort_order: 1 },
  { id: 'logo-link',            sort_order: 2 },
  { id: 'typography-hierarchy', sort_order: 3 },
  { id: 'readability',          sort_order: 4 },
  { id: 'footer-policies',      sort_order: 5 },
  { id: 'social-links',         sort_order: 6 },
  { id: '404-page',             sort_order: 7 },
  { id: 'search-visibility',    sort_order: 8 },
  { id: 'tap-targets',          sort_order: 9 },

  // Collection band (10–19): secondary-hover-image to front, filter-logic to end
  { id: 'secondary-hover-image', sort_order: 10 },
  { id: 'clear-titles',          sort_order: 11 },
  { id: 'breadcrumbs',           sort_order: 12 },
  { id: 'active-filters',        sort_order: 13 },
  { id: 'sorting-options',       sort_order: 14 },
  { id: 'product-count',         sort_order: 15 },
  { id: 'price-visibility',      sort_order: 16 },
  { id: 'quick-add',             sort_order: 17 },
  { id: 'grid-consistency',      sort_order: 18 },
  { id: 'filter-logic',          sort_order: 19 },

  // Checkout band (40–49): order-summary-toggle moves to end
  { id: 'error-handling',          sort_order: 44 },
  { id: 'checkout-branding',       sort_order: 45 },
  { id: 'abandoned-checkout',      sort_order: 46 },
  { id: 'post-purchase-page',      sort_order: 47 },
  { id: 'order-confirmation-email',sort_order: 48 },
  { id: 'order-summary-toggle',    sort_order: 49 },

  // Mobile/Performance band (50–59): mobile items move to end
  { id: 'no-content-shifting', sort_order: 50 },
  { id: 'image-format',        sort_order: 51 },
  { id: 'app-bloat',           sort_order: 52 },
  { id: 'third-party-scripts', sort_order: 53 },
  { id: 'exit-intent',         sort_order: 54 },
  { id: 'page-speed',          sort_order: 55 },
  { id: 'lcp',                 sort_order: 56 },
  { id: 'mobile-navigation',   sort_order: 57 },
  { id: 'input-font-size',     sort_order: 58 },
  { id: 'thumb-zone',          sort_order: 59 },
];

async function run() {
  let errors = 0;

  // 1. Set primary_viewport = 'mobile'
  const { error: mobileErr } = await supabase
    .from('checklist_items')
    .update({ primary_viewport: 'mobile' })
    .in('id', MOBILE_IDS);
  if (mobileErr) { console.error('mobile update failed:', mobileErr.message); errors++; }
  else console.log(`Set primary_viewport='mobile' on ${MOBILE_IDS.length} items`);

  // 2. Set primary_viewport = 'desktop'
  const { error: desktopErr } = await supabase
    .from('checklist_items')
    .update({ primary_viewport: 'desktop' })
    .in('id', DESKTOP_IDS);
  if (desktopErr) { console.error('desktop update failed:', desktopErr.message); errors++; }
  else console.log(`Set primary_viewport='desktop' on ${DESKTOP_IDS.length} items`);

  // 3. Update sort_order for affected items — use individual UPDATEs, not upsert,
  //    because upsert would try to insert and hit NOT NULL constraints on other columns.
  const sortResults = await Promise.all(
    SORT_ORDER_UPDATES.map(({ id, sort_order }) =>
      supabase.from('checklist_items').update({ sort_order }).eq('id', id)
    )
  );
  const sortErrs = sortResults.filter(r => r.error);
  if (sortErrs.length) {
    sortErrs.forEach(r => console.error('sort_order update failed:', r.error.message));
    errors++;
  } else {
    console.log(`Updated sort_order for ${SORT_ORDER_UPDATES.length} items`);
  }

  if (errors) { console.error(`\n${errors} error(s). Fix above before re-exporting.`); process.exit(1); }
  console.log('\nDone. Run export-checklist.js to regenerate audit-items.js.');
}

run();

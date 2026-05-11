// scripts/seed-checklist.js
// Run once to populate checklist_items from audit-items.json.
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.
//
// Usage:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-checklist.js

const { createClient } = require('@supabase/supabase-js');
const items = require('../audit-items.json').items;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seed() {
  const rows = items.map((item, i) => ({ ...item, sort_order: i }));
  const { error } = await supabase.from('checklist_items').upsert(rows);
  if (error) { console.error('Seed failed:', error.message); process.exit(1); }
  console.log(`Seeded ${rows.length} items.`);
}

seed();

// scripts/export-checklist.js
// Fetches checklist_items from Supabase and writes audit-items.js.
// Runs at every Netlify deploy via the build command.
// Requires SUPABASE_URL and SUPABASE_ANON_KEY env vars.

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function exportItems() {
  const { data, error } = await supabase
    .from('checklist_items')
    .select('id,name,section,impact,effort,estimated_fix_time,impact_area,shopify_fix_complexity,default_finding,default_recommendation,lift_min,lift_max')
    .order('sort_order');

  if (error) { console.error('Export failed:', error.message); process.exit(1); }

  const out = `const AUDIT_ITEMS = ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(path.join(__dirname, '..', 'audit-items.js'), out);
  console.log(`Exported ${data.length} items to audit-items.js`);
}

exportItems();

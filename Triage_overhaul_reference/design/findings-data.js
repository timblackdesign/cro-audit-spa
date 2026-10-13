window.TRIAGE_APP_FINDINGS = [
  ['Page speed', 'Mobile load takes longer than 3 seconds.', 'Compress images, defer non-critical scripts, remove unused apps.', 'Mobile/Perf', 'P0', '1 day', '+0.20–0.50%', '+$520', true, 'quick'],
  ['Guest checkout', 'Shoppers must create an account to check out.', 'Set customer accounts to optional in Settings → Checkout.', 'Checkout', 'P0', '< 30 min', '+0.20–0.40%', '+$430', true, 'quick'],
  ['Predictive search', 'Search does not suggest products or collections.', 'Enable Shopify Predictive Search in theme settings.', 'General', 'P0', '< 30 min', '+0.10–0.22%', '+$260', true, 'quick'],
  ['Largest contentful paint', 'LCP exceeds 2.5s and fails Core Web Vitals.', 'Preload the hero image; size and compress it.', 'Mobile/Perf', 'P0', '2 hrs', '+0.10–0.22%', '+$260', true, 'quick'],
  ['Sticky add to cart', 'Add to cart sits below the fold on mobile.', 'Add a sticky ATC bar in sections/main-product.liquid.', 'Product page', 'P1', '2 hrs', '+0.08–0.18%', '+$210', true, 'test'],
  ['Layout shift', 'Layout shifts significantly while loading.', 'Set explicit width and height on all images and embeds.', 'Mobile/Perf', 'P1', '2 hrs', '+0.08–0.18%', '+$210', true, 'quick'],
  ['Sticky header', 'Header does not remain visible on scroll-up.', 'Enable "Sticky Header" in theme settings.', 'General', 'P1', '< 30 min', '+0.05–0.12%', '+$140', true, 'quick'],
  ['Tap targets', 'Buttons and links are under 44×44px on mobile.', 'Add padding to mobile navigation and buttons via CSS.', 'General', 'P1', '1 week', '+0.06–0.15%', '+$170', false, 'test'],
  ['Filters reset on back nav', 'Collection filters clear when the shopper navigates back.', 'Persist filter state in URL parameters.', 'Collection page', 'P2', '3 hrs', '+0.03–0.08%', '+$90', false, 'test']
].map(([title, finding, rec, section, p, time, lift, mo, on, ph], i) => ({ n: String(i + 1).padStart(2, '0'), title, finding, rec, section, p, pm: p !== 'P0', time, lift, mo, on, ph }));
window.TRIAGE_APP_TESTS = [
  { n: 'T1', title: 'Sticky add to cart on mobile PDP', hyp: 'A persistent ATC bar raises add-to-cart rate on mobile product pages.', metric: 'Mobile ATC rate', lift: '+0.08–0.18%', start: 1, len: 4 },
  { n: 'T2', title: 'Larger mobile tap targets', hyp: 'Bigger nav and button targets reduce mis-taps and lift mobile CVR.', metric: 'Mobile CVR', lift: '+0.06–0.15%', start: 4, len: 4 },
  { n: 'T3', title: 'Persist collection filters', hyp: 'Keeping filters on back navigation increases collection → PDP clicks.', metric: 'Collection CTR', lift: '+0.03–0.08%', start: 8, len: 4 }
];
window.TRIAGE_APP_PITCH = 'Better Brewer currently converts 0.93% of roughly 54,900 monthly sessions into $48,000 in revenue. This audit found 9 conversion issues. Fixing the 7 highest-impact ones is projected to lift conversion to 0.97% and recover about $2,030 a month, or $24,360 a year.';

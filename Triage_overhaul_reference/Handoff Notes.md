# Handoff notes

## Checklist map (Screen Checklist Focus · 1h)
- Desktop: hovering a square shows the item tooltip; **clicking a square navigates to that item** (sets it as current, loads its fields).
- Mobile: single tap shows the item card under the map; **double-tap navigates to that item**. The card's OPEN → button does the same.
- The map is a single horizontally scrollable line in every sort mode (Section, Priority, Quick wins, CVR lift). The sort button stays pinned left. Tooltips render outside the scroller so they aren't clipped. On mobile, each group row scrolls horizontally.
- On load / item change, scroll the current square into view within the strip (use scrollLeft, not scrollIntoView).

## Report (Screen Report Final · 08, Screen Report Print · 09)
- Consider dropping the FIX and CVR LIFT columns from the client report. Showing fix times (e.g. "< 30 min") can undercut the single-price approach: clients may nitpick time or decide to do the fixes themselves. Design currently keeps both columns.
- Per-finding /mo figures are internal and removed from all client-facing report views.

## Pricing in the report
- Pricing is optional per audit ("Show pricing" in the Report's CLIENT VIEW bar; off by default).
- Off: pitch contains no price; RETURN and PAYBACK metrics and the payback sentence are hidden.
- On: adds an INVESTMENT strip under the metrics ($750 audit + $3,500 implementation) plus RETURN / PAYBACK.
- Price is never written into the pitch paragraph.
- Future: when pricing is hidden, consider a separate follow-up file (invoice or SOW) generated from the same audit data.

## PDF report structure (Screen Report Print)
- 5 A4 pages: 1 Summary · 2 Findings · 3 Phase 1 quick wins · 4 Phase 2 testing roadmap · 5 Next steps + contact.
- Page 5 contact details (email, site, booking link, QR) come from the dev's profile; QR is a placeholder.
- Long finding lists need to paginate the Findings / Phase 1 pages onto continuation pages.

## Checklist · fails on device (picked option 1a)
- Status keys show their shortcut letter (P F T N) top-right; no "KEY" prefix. Footer hint becomes "J/K move · / jump".
- FAIL key shows desktop + mobile icons lower-left (triage style: square corners, square caps). Icons always show; selected = full opacity, unselected = 0.3, not applicable to this item = 0.12. "+" between them only when both are lit.
- Setting FAIL selects Desktop + Mobile. Clicking FAIL again cycles Mobile only → Desktop only → Desktop + Mobile. Single-viewport items don't cycle. Maps to existing fails_on_desktop / fails_on_mobile.
- First FAIL ever: tooltip under the FAIL key ("FAILS ON DESKTOP + MOBILE · Click FAIL again for mobile only, then desktop only.") fades in, holds ~3s, fades out. Remember it was shown in a user pref (localStorage key, skipped in demo) so it only appears once.

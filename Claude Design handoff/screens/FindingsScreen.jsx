// Screen: Findings — Step 3
// All Fail items shown with checkboxes. Pre-checks top 10 by impact/effort/order.
// Accordion for items beyond the top 10. Gate to calculator step.

// Lifted input to prevent focus loss
function FindingsSearchInput({ value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Filter findings…"
      style={{
        background: 'var(--paper)',
        border: '1px solid var(--rule)',
        padding: '8px 12px',
        fontFamily: "'DM Mono', monospace",
        fontSize: 12,
        color: 'var(--ink)',
        outline: 'none',
        width: 180,
      }}
      onFocus={e => e.target.style.borderColor = 'var(--accent)'}
      onBlur={e => e.target.style.borderColor = 'var(--rule)'}
    />
  );
}

const FindingsScreen = ({ audit, checkedIds, onToggle, onSetChecked, onBack, onContinue, onEditInfo }) => {
  const { useState, useMemo } = React;
  const [showGate, setShowGate] = useState(false);

  const items = window.AUDIT_ITEMS;
  const auditItems = audit.items || {};
  const clientInfo = audit.client_info || {};

  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState('');

  // All fail items
  const failItems = useMemo(() =>
    items.filter(item => auditItems[item.id]?.status === 'fail'),
    [items, auditItems]
  );

  // Ranked: High→Med→Low, then Low→Med→High effort, then checklist order
  const impactRank = { High: 0, Medium: 1, Low: 2 };
  const effortRank = { Low: 0, Medium: 1, High: 2 };
  const ranked = useMemo(() =>
    [...failItems].sort((a, b) => {
      if (impactRank[a.impact] !== impactRank[b.impact]) return impactRank[a.impact] - impactRank[b.impact];
      if (effortRank[a.effort] !== effortRank[b.effort]) return effortRank[a.effort] - effortRank[b.effort];
      return items.indexOf(a) - items.indexOf(b);
    }),
    [failItems, items]
  );

  const TOP = 10;
  const topItems = ranked.slice(0, TOP);
  const restItems = ranked.slice(TOP);
  const visibleItems = showAll ? ranked : topItems;

  // Filter
  const filtered = filter
    ? visibleItems.filter(i => i.name.toLowerCase().includes(filter.toLowerCase()) || i.section.toLowerCase().includes(filter.toLowerCase()))
    : visibleItems;

  const checkedCount = ranked.filter(i => checkedIds[i.id]).length;

  const impactColor = { High: 'var(--impact-high)', Medium: 'var(--impact-medium)', Low: 'var(--ink-3)' };
  const impactBg    = { High: 'var(--impact-high-bg)', Medium: 'var(--impact-medium-bg)', Low: 'var(--paper-3)' };

  // CVR math for monthly recovery preview
  const cvr = (parseFloat(clientInfo.cvr) || 0) / 100;
  const revenue = parseFloat(clientInfo.monthly_revenue) || 0;
  const aov = parseFloat(clientInfo.aov) || 0;
  const sessions = revenue > 0 && aov > 0 && cvr > 0 ? revenue / (aov * cvr) : 0;
  const hasMetrics = sessions > 0;

  const fmt = (n) => {
    const num = Math.round(n);
    if (num >= 1000000) return '$' + (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return '$' + (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return '$' + num.toLocaleString('en-US');
  };

  const thS = {
    fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
    color: 'var(--ink-4)', padding: '8px 14px', borderBottom: '1px solid var(--rule)',
    background: 'var(--paper)', textAlign: 'left', whiteSpace: 'nowrap',
  };
  const tdS = {
    padding: '11px 14px', borderBottom: '1px solid var(--paper-3)', verticalAlign: 'middle',
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px 80px' }}>

      {/* Back */}
      <div style={{ marginBottom: 24 }}>
        <button onClick={onBack}
          style={{ background: 'none', border: 'none', color: 'var(--ink-4)', fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-4)'}
        >← Back to checklist</button>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-5)', marginBottom: 8 }}>Step 3 of 4</div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, fontWeight: 400, color: 'var(--ink)', letterSpacing: '-0.5px' }}>Review findings</h1>
        </div>
        <div style={{ display: 'flex', align: 'center', gap: 10 }}>
          <FindingsSearchInput value={filter} onChange={setFilter} />
        </div>
      </div>

      {/* No failures state */}
      {failItems.length === 0 && (
        <div style={{ background: 'var(--paper-2)', border: '1px solid var(--rule)', padding: '48px 32px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: 'var(--ink-3)', marginBottom: 10 }}>No failed items</div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--ink-4)', lineHeight: 1.6 }}>
            Go back to the checklist and mark items as Fail to include them in the ROI calculation.
          </p>
        </div>
      )}

      {/* Findings table */}
      {failItems.length > 0 && (
        <div style={{ background: 'var(--paper-2)', border: '1px solid var(--rule)', marginBottom: 16 }}>
          {/* Table header row */}
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--rule)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ background: 'var(--accent)', color: '#fff', fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.06em', padding: '3px 8px' }}>03</span>
              <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, color: 'var(--ink)', letterSpacing: '-0.2px' }}>Findings</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--ink-4)', letterSpacing: '0.04em' }}>
                <strong style={{ color: 'var(--ink)' }}>{failItems.length}</strong> failures &nbsp;·&nbsp;
                <strong style={{ color: 'var(--accent-positive)' }}>{checkedCount}</strong> included
              </span>
              {/* Select/deselect all */}
              <button
                onClick={() => {
                  const allChecked = ranked.every(i => checkedIds[i.id]);
                  const next = {};
                  ranked.forEach(i => { next[i.id] = !allChecked; });
                  onSetChecked(next);
                }}
                style={{ background: 'none', border: '1px solid var(--rule)', color: 'var(--ink-4)', fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', padding: '4px 10px' }}
              >
                {ranked.every(i => checkedIds[i.id]) ? 'Deselect All' : 'Select All'}
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
              <thead>
                <tr>
                  <th style={{ ...thS, width: 36 }}></th>
                  <th style={thS}>Checkpoint</th>
                  <th style={thS}>Impact</th>
                  <th style={{ ...thS, textAlign: 'right' }}>CVR Lift</th>
                  {hasMetrics && <th style={{ ...thS, textAlign: 'right' }}>Monthly</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const isChecked = !!checkedIds[item.id];
                  const mid = (item.liftMin + item.liftMax) / 2 / 100;
                  const monthly = sessions > 0 ? sessions * aov * mid : 0;
                  return (
                    <tr
                      key={item.id}
                      style={{ opacity: isChecked ? 1 : 0.38, transition: 'opacity 0.15s', cursor: 'pointer' }}
                      onClick={() => onToggle(item.id)}
                    >
                      <td style={tdS}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggle(item.id)}
                          onClick={e => e.stopPropagation()}
                          style={{ width: 15, height: 15, accentColor: 'var(--accent)', cursor: 'pointer' }}
                        />
                      </td>
                      <td style={{ ...tdS, maxWidth: 300 }}>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.3 }}>{item.name}</div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--ink-5)', marginTop: 2, letterSpacing: '0.04em' }}>{item.section}</div>
                      </td>
                      <td style={tdS}>
                        <span style={{ display: 'inline-block', fontFamily: "'DM Mono', monospace", fontSize: 10, padding: '2px 8px', background: impactBg[item.impact], color: impactColor[item.impact], letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                          {item.impact}
                        </span>
                      </td>
                      <td style={{ ...tdS, fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--ink-3)', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        +{item.liftMin}–{item.liftMax}%
                      </td>
                      {hasMetrics && (
                        <td style={{ ...tdS, fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--accent-positive)', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          +{fmt(monthly)}/mo
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Accordion for items beyond top 10 */}
            {restItems.length > 0 && (
              <div style={{ borderTop: '1px solid var(--rule)' }}>
                <button
                  onClick={() => setShowAll(s => !s)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '11px 14px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--ink-4)', letterSpacing: '0.04em', textTransform: 'uppercase' }}
                >
                  <span>{showAll ? 'Show fewer' : `${restItems.length} additional finding${restItems.length !== 1 ? 's' : ''} — outside top 10`}</span>
                  <span style={{ transform: showAll ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', fontSize: 9 }}>▼</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer CTA — now in sticky bar */}
      <div style={{ height: 64 }}></div>{/* spacer for fixed bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200, background: 'var(--paper-2)', borderTop: '1px solid var(--rule)', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }} className="no-print">
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--ink-5)', letterSpacing: '0.04em' }}>
          {checkedCount} finding{checkedCount !== 1 ? 's' : ''} included
        </span>
        <button
          onClick={() => { if (!hasMetrics) { setShowGate(true); } else { onContinue(); } }}
          style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '11px 28px', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer' }}
        >
          Calculate ROI →
        </button>
      </div>

      {/* Metrics gate modal */}
      {showGate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={() => setShowGate(false)}
        >
          <div
            style={{ background: 'var(--paper-2)', border: '1px solid var(--rule-2)', maxWidth: 440, width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--rule)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, color: 'var(--ink)', letterSpacing: '-0.3px' }}>Store metrics needed</span>
              <button onClick={() => setShowGate(false)} style={{ background: 'none', border: 'none', color: 'var(--ink-4)', fontFamily: "'DM Mono', monospace", fontSize: 12, cursor: 'pointer', padding: 0 }}>✕</button>
            </div>
            {/* Modal body */}
            <div style={{ padding: '20px 20px' }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.65, marginBottom: 20 }}>
                Monthly Revenue, AOV, and Conversion Rate are required to calculate the revenue impact of your findings. Without them, the calculator only shows percentage lifts — no dollar figures.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button
                  onClick={() => { setShowGate(false); onEditInfo && onEditInfo(); }}
                  style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer' }}
                >
                  Add metrics →
                </button>
                <button
                  onClick={() => { setShowGate(false); onContinue(); }}
                  style={{ background: 'var(--paper-3)', color: 'var(--ink-3)', border: '1px solid var(--rule)', padding: '12px 16px', fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer' }}
                >
                  Continue anyway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Object.assign(window, { FindingsScreen });

// Screen: Audit Experience v3
// Changes:
// - Section item list panel: shows all 10 items for current section with status dots
// - PREV/NEXT shows truncated name of adjacent item
// - Persistent "Review Findings →" in section tab bar once ≥1 item marked
// - Structured layout: left sidebar (item list) + right item card on desktop

function AuditTextarea({ value, placeholder, onChange, rows = 3 }) {
  return (
    <textarea
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%',
        background: 'var(--paper)',
        border: '1px solid var(--rule)',
        padding: '10px 12px',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        color: 'var(--ink-2)',
        lineHeight: 1.6,
        resize: 'vertical',
        outline: 'none',
        transition: 'border-color 0.15s',
      }}
      onFocus={e => e.target.style.borderColor = 'var(--accent)'}
      onBlur={e => e.target.style.borderColor = 'var(--rule)'}
    />
  );
}

function AuditUrlInput({ value, onChange }) {
  return (
    <input
      type="url"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder="https://..."
      style={{
        width: '100%',
        background: 'var(--paper)',
        border: '1px solid var(--rule)',
        padding: '9px 12px',
        fontFamily: "'DM Mono', monospace",
        fontSize: 12,
        color: 'var(--ink-2)',
        outline: 'none',
      }}
      onFocus={e => e.target.style.borderColor = 'var(--accent)'}
      onBlur={e => e.target.style.borderColor = 'var(--rule)'}
    />
  );
}

const AuditScreen = ({ audit, onUpdateItem, onComplete, onBack, onEditInfo }) => {
  const { useState, useEffect, useRef, useCallback } = React;

  const sections = window.SECTIONS;
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [activeItemIdx, setActiveItemIdx] = useState(0);
  const [expandedFields, setExpandedFields] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false); // mobile item list drawer

  const activeSection = sections[activeSectionIdx];
  const activeItem = activeSection.items[activeItemIdx];
  const itemState = (audit.items || {})[activeItem.id] || {};

  const contentRef = useRef(null);
  useEffect(() => {
    // Small delay ensures layout has settled before scrolling
    const t = setTimeout(() => {
      if (contentRef.current) contentRef.current.scrollTop = 0;
    }, 50);
    return () => clearTimeout(t);
  }, [activeSectionIdx, activeItemIdx]);

  const updateItem = useCallback((field, value) => {
    onUpdateItem(activeItem.id, { ...itemState, [field]: value });
  }, [activeItem.id, itemState, onUpdateItem]);

  // Progress
  const sectionProgress = (section) => {
    const done = section.items.filter(item => {
      const s = (audit.items || {})[item.id]?.status;
      return s && s !== 'tbd';
    }).length;
    return { done, total: section.items.length };
  };
  const totalDone = sections.reduce((acc, s) => acc + sectionProgress(s).done, 0);
  const totalPct = Math.round((totalDone / 60) * 100);
  const anyMarked = totalDone > 0;

  // Navigation
  const goNext = () => {
    if (activeItemIdx < activeSection.items.length - 1) {
      setActiveItemIdx(i => i + 1);
    } else if (activeSectionIdx < sections.length - 1) {
      setActiveSectionIdx(s => s + 1);
      setActiveItemIdx(0);
    }
  };
  const goPrev = () => {
    if (activeItemIdx > 0) {
      setActiveItemIdx(i => i - 1);
    } else if (activeSectionIdx > 0) {
      setActiveSectionIdx(s => s - 1);
      setActiveItemIdx(sections[activeSectionIdx - 1].items.length - 1);
    }
  };

  const isFirst = activeSectionIdx === 0 && activeItemIdx === 0;
  const isLast = activeSectionIdx === sections.length - 1 && activeItemIdx === activeSection.items.length - 1;

  // Adjacent item names for PREV/NEXT labels
  const getPrevItem = () => {
    if (activeItemIdx > 0) return activeSection.items[activeItemIdx - 1];
    if (activeSectionIdx > 0) {
      const prevSec = sections[activeSectionIdx - 1];
      return prevSec.items[prevSec.items.length - 1];
    }
    return null;
  };
  const getNextItem = () => {
    if (activeItemIdx < activeSection.items.length - 1) return activeSection.items[activeItemIdx + 1];
    if (activeSectionIdx < sections.length - 1) return sections[activeSectionIdx + 1].items[0];
    return null;
  };
  const truncate = (str, len = 22) => str && str.length > len ? str.slice(0, len) + '…' : str;
  const prevItem = getPrevItem();
  const nextItem = getNextItem();

  // Status config
  const STATUS_OPTIONS = [
    { id: 'pass', label: 'Pass', color: 'var(--state-pass)',  bg: 'var(--state-pass-bg)',  border: '#86efac' },
    { id: 'fail', label: 'Fail', color: 'var(--state-fail)',  bg: 'var(--state-fail-bg)',  border: '#fca5a5' },
    { id: 'tbd',  label: 'TBD',  color: 'var(--ink-3)',       bg: 'var(--paper-3)',         border: 'var(--rule-2)' },
    { id: 'na',   label: 'N/A',  color: 'var(--ink-5)',       bg: 'var(--paper)',            border: 'var(--rule)' },
  ];
  const currentStatus = itemState.status || 'tbd';
  const isFail = currentStatus === 'fail';

  const toggleField = (key) => setExpandedFields(f => ({ ...f, [key]: !f[key] }));
  const fieldKey = activeItem.id;
  const showDetails = expandedFields[`${fieldKey}-details`];
  const showNotes = expandedFields[`${fieldKey}-notes`];

  const impactColor = { High: 'var(--impact-high)', Medium: 'var(--impact-medium)', Low: 'var(--ink-3)' };

  // Status dot color for item list
  const statusDot = (itemId) => {
    const s = (audit.items || {})[itemId]?.status;
    if (!s || s === 'tbd') return 'var(--rule-2)';
    if (s === 'pass') return 'var(--state-pass)';
    if (s === 'fail') return 'var(--state-fail)';
    return 'var(--ink-5)'; // n/a
  };

  const statusLabel = (itemId) => {
    const s = (audit.items || {})[itemId]?.status;
    return s || 'tbd';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>

      {/* ── STICKY STEP BAR ── */}
      <div style={{
        background: 'var(--paper-2)',
        borderBottom: '1px solid var(--rule)',
        flexShrink: 0,
        zIndex: 50,
      }}>
        {/* Overall progress bar */}
        <div style={{ height: 2, background: 'var(--rule)' }}>
          <div style={{ height: '100%', background: 'var(--accent)', width: `${totalPct}%`, transition: 'width 0.4s' }}></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', gap: 12 }}>
          {/* Left: step label + context */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: '#fff',
                background: 'var(--accent)', padding: '2px 8px',
              }}>
                02 — Checklist
              </span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.04em' }}>
                {activeSection.label}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--ink-5)', letterSpacing: '0.04em' }}>
                Item {activeItemIdx + 1}/{activeSection.items.length}
              </span>
              <span style={{ color: 'var(--rule-2)', fontSize: 10 }}>·</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: totalDone > 0 ? 'var(--ink-4)' : 'var(--ink-5)', letterSpacing: '0.04em' }}>
                {totalDone}/60 complete
              </span>
            </div>
          </div>

          {/* Right: next step CTA */}
          <button
            onClick={onComplete}
            style={{
              background: anyMarked ? 'var(--accent)' : 'transparent',
              border: `1px solid ${anyMarked ? 'var(--accent)' : 'var(--rule)'}`,
              color: anyMarked ? '#fff' : 'var(--ink-5)',
              padding: '8px 16px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: anyMarked ? 'pointer' : 'default',
              opacity: anyMarked ? 1 : 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {anyMarked
              ? <><span>Review Findings</span><span style={{ fontSize: 14 }}>→</span></>
              : <span>03 — Findings</span>
            }
          </button>
        </div>
      </div>

      {/* ── BODY: ITEM LIST SIDEBAR + ITEM CARD ── */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>

        {/* ── LEFT: Section item list (desktop sidebar) ── */}
        <div style={{
          width: 220,
          flexShrink: 0,
          background: 'var(--paper-2)',
          borderRight: '1px solid var(--rule)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
          className="audit-sidebar"
        >
          {/* Section switcher — moved from top tabs into sidebar */}
          <div style={{ borderBottom: '2px solid var(--rule)', flexShrink: 0 }}>
            {sections.map((sec, idx) => {
              const { done, total } = sectionProgress(sec);
              const active = idx === activeSectionIdx;
              return (
                <button
                  key={sec.id}
                  onClick={() => { setActiveSectionIdx(idx); setActiveItemIdx(0); }}
                  style={{
                    width: '100%',
                    background: active ? 'var(--paper-3)' : 'transparent',
                    border: 'none',
                    borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
                    borderBottom: '1px solid var(--rule)',
                    padding: '7px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    transition: 'background 0.12s',
                  }}
                >
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: active ? 'var(--ink-2)' : 'var(--ink-5)' }}>
                    {sec.short}
                  </span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: done === total ? 'var(--state-pass)' : active ? 'var(--ink-3)' : 'var(--ink-5)' }}>
                    {done}/{total}
                  </span>
                </button>
              );
            })}
          </div>
          <div style={{ flex: 1 }}>
            {activeSection.items.map((item, idx) => {
              const isActive = idx === activeItemIdx;
              const s = statusLabel(item.id);
              const dot = statusDot(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveItemIdx(idx)}
                  style={{
                    width: '100%',
                    background: isActive ? 'var(--paper-3)' : 'transparent',
                    border: 'none',
                    borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                    borderBottom: '1px solid var(--rule)',
                    padding: '9px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 9,
                    textAlign: 'left',
                    transition: 'background 0.12s',
                  }}
                >
                  {/* Status dot */}
                  <span style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: dot,
                    flexShrink: 0,
                    border: s === 'tbd' ? '1px solid var(--rule-2)' : 'none',
                  }}></span>
                  {/* Item name */}
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12,
                    color: isActive ? 'var(--ink)' : s === 'tbd' ? 'var(--ink-4)' : 'var(--ink-3)',
                    lineHeight: 1.3,
                    flex: 1,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {item.name}
                  </span>
                  {/* Item number */}
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--ink-5)', flexShrink: 0 }}>
                    {idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: Item card ── */}
        <div ref={contentRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 100px' }}>
          <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 2 }}>

            {/* Item header */}
            <div style={{ background: 'var(--paper-2)', border: '1px solid var(--rule)', padding: '14px 18px' }}>
              <div style={{ marginBottom: 10 }}>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 19, fontWeight: 400, color: 'var(--ink)', letterSpacing: '-0.3px', lineHeight: 1.2, marginBottom: 8 }}>
                  {activeItem.name}
                </h2>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 10, padding: '2px 8px',
                    background: activeItem.impact === 'High' ? 'var(--impact-high-bg)' : activeItem.impact === 'Medium' ? 'var(--impact-medium-bg)' : 'var(--paper-3)',
                    color: impactColor[activeItem.impact], letterSpacing: '0.04em', textTransform: 'uppercase'
                  }}>
                    {activeItem.impact}
                  </span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, padding: '2px 8px', background: 'var(--paper-3)', color: 'var(--ink-4)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Effort: {activeItem.effort}
                  </span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, padding: '2px 8px', background: 'var(--paper-3)', color: 'var(--ink-4)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {activeItem.fix_time}
                  </span>
                  {/* CVR lift — moved inline with pills, less prominent */}
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, padding: '2px 8px', background: 'var(--paper-3)', color: 'var(--accent-positive)', letterSpacing: '0.04em' }}>
                    +{activeItem.liftMin}–{activeItem.liftMax}% CVR
                  </span>
                </div>
              </div>

              {/* Details toggle */}
              <button
                onClick={() => toggleField(`${fieldKey}-details`)}
                style={{ background: 'none', border: 'none', color: 'var(--ink-5)', fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 5 }}
              >
                <span style={{ transform: showDetails ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform 0.15s', fontSize: 8 }}>▼</span>
                {showDetails ? 'Hide details' : 'Details'}
              </button>
              {showDetails && (
                <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {[['Impact Area', activeItem.impact_area], ['Shopify Complexity', activeItem.complexity]].map(([label, value]) => (
                    <div key={label} style={{ background: 'var(--paper-3)', padding: '8px 10px' }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-5)', marginBottom: 3 }}>{label}</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'var(--ink-3)' }}>{value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── STATUS ── primary action */}
            <div style={{ background: 'var(--paper-2)', border: '1px solid var(--rule)', padding: '12px 18px' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 8 }}>Status</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 5 }}>
                {STATUS_OPTIONS.map(opt => {
                  const active = currentStatus === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => updateItem('status', opt.id)}
                      style={{
                        padding: '13px 6px',
                        background: active ? opt.bg : 'var(--paper-3)',
                        border: `1px solid ${active ? opt.border : 'var(--rule)'}`,
                        color: active ? opt.color : 'var(--ink-5)',
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 12,
                        fontWeight: active ? 600 : 400,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition: 'all 0.12s',
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── FINDING ── only on fail */}
            {isFail && (
              <div style={{ background: 'var(--paper-2)', border: '1px solid rgba(252,165,165,0.2)' }}>
                <div style={{ padding: '10px 18px', borderBottom: '1px solid var(--rule)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--state-fail)' }}>Finding</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--ink-5)', letterSpacing: '0.04em' }}>in client report</span>
                </div>
                <div style={{ padding: '10px 18px' }}>
                  <AuditTextarea
                    value={itemState.finding !== undefined ? itemState.finding : activeItem.default_finding}
                    placeholder={activeItem.default_finding}
                    onChange={v => updateItem('finding', v)}
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* ── RECOMMENDATION ── only on fail */}
            {isFail && (
              <div style={{ background: 'var(--paper-2)', border: '1px solid var(--rule)' }}>
                <div style={{ padding: '10px 18px', borderBottom: '1px solid var(--rule)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>Recommendation</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--ink-5)', letterSpacing: '0.04em' }}>in client report</span>
                </div>
                <div style={{ padding: '10px 18px' }}>
                  <AuditTextarea
                    value={itemState.recommendation !== undefined ? itemState.recommendation : activeItem.default_recommendation}
                    placeholder={activeItem.default_recommendation}
                    onChange={v => updateItem('recommendation', v)}
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* ── NOTES + SCREENSHOT ── collapsible */}
            <div style={{ background: 'var(--paper-2)', border: '1px solid var(--rule)' }}>
              <button
                onClick={() => toggleField(`${fieldKey}-notes`)}
                style={{ width: '100%', background: 'none', border: 'none', padding: '10px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              >
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: (itemState.notes || itemState.screenshot_url) ? 'var(--ink-3)' : 'var(--ink-5)' }}>
                  Notes {itemState.screenshot_url ? '· screenshot' : ''}
                </span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--ink-5)', transform: showNotes ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform 0.15s' }}>▼</span>
              </button>
              {showNotes && (
                <div style={{ padding: '0 18px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <AuditTextarea
                    value={itemState.notes}
                    placeholder="Private notes (not in report)…"
                    onChange={v => updateItem('notes', v)}
                    rows={2}
                  />
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--ink-5)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 5 }}>Screenshot URL</div>
                    <AuditUrlInput value={itemState.screenshot_url} onChange={v => updateItem('screenshot_url', v)} />
                  </div>
                </div>
              )}
            </div>

            {/* ── BOTTOM NAV ── prev/next with names */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, paddingTop: 6 }}>
              <button
                onClick={goPrev}
                disabled={isFirst}
                style={{
                  background: 'var(--paper-2)', border: '1px solid var(--rule)',
                  color: isFirst ? 'var(--ink-5)' : 'var(--ink-3)',
                  padding: '11px 14px', cursor: isFirst ? 'default' : 'pointer',
                  opacity: isFirst ? 0.3 : 1, textAlign: 'left',
                  display: 'flex', flexDirection: 'column', gap: 2,
                }}
              >
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-5)' }}>← Prev</span>
                {prevItem && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'var(--ink-4)', lineHeight: 1.2 }}>{truncate(prevItem.name)}</span>}
              </button>

              {isLast ? (
                <button
                  onClick={onComplete}
                  style={{ background: 'var(--accent)', border: 'none', color: '#fff', padding: '11px 14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: 'right' }}
                >
                  Review Findings →
                </button>
              ) : (
                <button
                  onClick={goNext}
                  style={{
                    background: 'var(--paper-2)', border: '1px solid var(--rule)',
                    color: 'var(--ink-3)', padding: '11px 14px', cursor: 'pointer',
                    textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end',
                  }}
                >
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-5)' }}>Next →</span>
                  {nextItem && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'var(--ink-4)', lineHeight: 1.2 }}>{truncate(nextItem.name)}</span>}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .audit-sidebar { display: none !important; }
          .audit-drawer-btn { display: flex !important; }
        }
        @media (min-width: 601px) {
          .audit-drawer-btn { display: none !important; }
        }
      `}</style>

      {/* ── STICKY BOTTOM CTA BAR ── */}
      <div className="no-print" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        background: 'var(--paper-2)', borderTop: '1px solid var(--rule)',
        padding: '12px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Mobile drawer trigger */}
          <button
            className="audit-drawer-btn"
            onClick={() => setDrawerOpen(true)}
            style={{
              display: 'none',
              background: 'var(--paper-3)', border: '1px solid var(--rule-2)',
              color: 'var(--ink-3)', fontFamily: "'DM Mono', monospace", fontSize: 10,
              letterSpacing: '0.08em', textTransform: 'uppercase', padding: '8px 12px',
              cursor: 'pointer', alignItems: 'center', gap: 6,
            }}
          >
            <span style={{ fontSize: 12 }}>≡</span>
            {activeSection.short} · {activeItemIdx + 1}/{activeSection.items.length}
          </button>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--ink-5)', letterSpacing: '0.04em' }}>
            {totalDone}/60 complete
          </span>
        </div>
        <button
          onClick={onComplete}
          disabled={!anyMarked}
          style={{
            background: anyMarked ? 'var(--accent)' : 'var(--paper-3)',
            border: anyMarked ? 'none' : '1px solid var(--rule)',
            color: anyMarked ? '#fff' : 'var(--ink-5)',
            padding: '11px 24px',
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            cursor: anyMarked ? 'pointer' : 'not-allowed',
            opacity: anyMarked ? 1 : 0.4,
            transition: 'all 0.2s',
          }}
        >
          {anyMarked ? 'Review Findings →' : 'Mark items to continue'}
        </button>
      </div>

      {/* ── MOBILE DRAWER OVERLAY ── */}
      {drawerOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 400, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
          onClick={() => setDrawerOpen(false)}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }}></div>
          <div
            style={{ position: 'relative', background: 'var(--paper-2)', borderTop: '1px solid var(--rule-2)', maxHeight: '80vh', display: 'flex', flexDirection: 'column', zIndex: 1 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Sheet header */}
            <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--rule)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, color: 'var(--ink)', letterSpacing: '-0.2px' }}>Sections</span>
              <button onClick={() => setDrawerOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--ink-4)', fontFamily: "'DM Mono', monospace", fontSize: 13, cursor: 'pointer', padding: '4px 8px' }}>✕</button>
            </div>
            {/* Section tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--rule)', flexShrink: 0 }}>
              {sections.map((sec, idx) => {
                const { done, total } = sectionProgress(sec);
                const active = idx === activeSectionIdx;
                return (
                  <button key={sec.id} onClick={() => { setActiveSectionIdx(idx); setActiveItemIdx(0); }}
                    style={{ background: active ? 'var(--paper-3)' : 'var(--paper-2)', border: 'none', padding: '10px 8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}
                  >
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: active ? 'var(--accent)' : 'var(--ink-5)' }}>{sec.short}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: done === total ? 'var(--state-pass)' : 'var(--ink-4)' }}>{done}/{total}</span>
                  </button>
                );
              })}
            </div>
            {/* Item list */}
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {activeSection.items.map((item, idx) => {
                const isActive = idx === activeItemIdx;
                const s = (audit.items || {})[item.id]?.status;
                const dot = !s || s === 'tbd' ? 'var(--rule-2)' : s === 'pass' ? 'var(--state-pass)' : s === 'fail' ? 'var(--state-fail)' : 'var(--ink-5)';
                return (
                  <button key={item.id} onClick={() => { setActiveItemIdx(idx); setDrawerOpen(false); }}
                    style={{ width: '100%', background: isActive ? 'var(--paper-3)' : 'transparent', border: 'none', borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent', borderBottom: '1px solid var(--rule)', padding: '12px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: dot, flexShrink: 0, border: (!s || s === 'tbd') ? '1px solid var(--rule-2)' : 'none' }}></span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: isActive ? 'var(--ink)' : 'var(--ink-3)', lineHeight: 1.3, flex: 1 }}>{item.name}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--ink-5)', flexShrink: 0 }}>{idx + 1}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Object.assign(window, { AuditScreen, AuditTextarea, AuditUrlInput });

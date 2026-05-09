// Screen: Audit List — landing surface showing active audits

const AuditListScreen = ({ audits, onOpen, onNew, onDelete, onArchive, onDuplicate, demoMode }) => {
  const { useState } = React;
  const MAX_AUDITS = 5;
  const activeCount = audits.length;
  const canCreate = activeCount < MAX_AUDITS && !demoMode;

  const [menuOpen, setMenuOpen] = useState(null); // audit id with open menu

  const formatDate = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const progressPct = (audit) => {
    const items = audit.items || {};
    const done = Object.values(items).filter(v => v.status && v.status !== 'tbd').length;
    return { done, total: 60, pct: Math.round((done / 60) * 100) };
  };

  const isSetupIncomplete = (audit) => {
    const ci = audit.client_info || {};
    return !ci.client_name || ci.client_name === 'New Client' || !ci.monthly_revenue || !ci.aov || !ci.cvr;
  };

  return (
    <div style={{ maxWidth: 840, margin: '0 auto', padding: '48px 24px 80px' }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-5)', marginBottom: 10 }}>
            {demoMode ? 'Demo Mode' : `Active audits: ${activeCount} of ${MAX_AUDITS}`}
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, fontWeight: 400, color: 'var(--ink)', letterSpacing: '-0.5px', lineHeight: 1.05 }}>
            Your audits
          </h1>
        </div>
        <button
          onClick={onNew}
          disabled={!canCreate && !demoMode}
          style={{
            background: (canCreate || demoMode) ? 'var(--accent)' : 'var(--paper-3)',
            color: (canCreate || demoMode) ? '#fff' : 'var(--ink-5)',
            border: 'none',
            padding: '12px 24px',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            cursor: (canCreate || demoMode) ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexShrink: 0,
          }}
        >
          + Start New Audit
        </button>
      </div>

      {/* Workspace cap bar */}
      {!demoMode && activeCount > 0 && (
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 2, background: 'var(--rule)', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', background: 'var(--accent)', width: `${(activeCount / MAX_AUDITS) * 100}%`, transition: 'width 0.3s' }}></div>
          </div>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: activeCount >= MAX_AUDITS ? 'var(--impact-high)' : 'var(--ink-4)', whiteSpace: 'nowrap' }}>
            {activeCount}/{MAX_AUDITS} workspaces
          </span>
        </div>
      )}

      {/* Empty state */}
      {audits.length === 0 && (
        <div style={{ border: '1px solid var(--rule)', padding: '64px 32px', textAlign: 'center', background: 'var(--paper-2)' }}>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: 'var(--ink-3)', marginBottom: 12, letterSpacing: '-0.3px' }}>
            No audits yet
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--ink-4)', lineHeight: 1.6, marginBottom: 28, maxWidth: 380, margin: '0 auto 28px' }}>
            Start your first audit to work through the 60-point checklist and generate a client ROI report.
          </p>
          <button
            onClick={onNew}
            style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '12px 28px', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer' }}
          >
            Start your first audit →
          </button>
        </div>
      )}

      {/* Audit list */}
      {audits.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {audits.map((audit, idx) => {
            const { done, total, pct } = progressPct(audit);
            const isMenuOpen = menuOpen === audit.id;
            return (
              <div
                key={audit.id}
                style={{ background: 'var(--paper-2)', border: '1px solid var(--rule)', position: 'relative', transition: 'border-color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--rule-2)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--rule)'}
              >
                {/* Progress fill at top */}
                <div style={{ height: 2, background: 'var(--rule)', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', background: pct === 100 ? 'var(--state-pass)' : 'var(--accent)', width: `${pct}%`, transition: 'width 0.3s' }}></div>
                </div>

                <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                  {/* Index */}
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--ink-5)', letterSpacing: '0.06em', flexShrink: 0, minWidth: 24 }}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>

                  {/* Client name + URL */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, color: 'var(--ink)', letterSpacing: '-0.3px', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {audit.client_info?.client_name || 'New Client'}
                      </div>
                      {isSetupIncomplete(audit) && (
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c8834a', background: 'rgba(200,131,74,0.1)', border: '1px solid rgba(200,131,74,0.25)', padding: '2px 7px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                          Setup incomplete
                        </span>
                      )}
                    </div>
                    {audit.client_info?.store_url && (
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--ink-5)', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {audit.client_info.store_url}
                      </div>
                    )}
                  </div>

                  {/* Progress */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: pct === 100 ? 'var(--state-pass)' : 'var(--ink-3)', letterSpacing: '0.04em' }}>
                      {done} / {total}
                    </div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--ink-5)', marginTop: 2 }}>
                      {pct === 0 ? 'not started' : pct === 100 ? 'complete' : `${pct}% done`}
                    </div>
                  </div>

                  {/* Date */}
                  <div style={{ flexShrink: 0, textAlign: 'right', minWidth: 90 }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--ink-5)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Updated</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--ink-4)', marginTop: 2 }}>{formatDate(audit.updated_at)}</div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <button
                      onClick={() => onOpen(audit.id)}
                      style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '8px 18px', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer' }}
                    >
                      Open
                    </button>
                    {/* Overflow menu */}
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setMenuOpen(isMenuOpen ? null : audit.id); }}
                        style={{ background: 'var(--paper-3)', border: '1px solid var(--rule)', color: 'var(--ink-3)', padding: '8px 10px', cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontSize: 12, lineHeight: 1 }}
                      >
                        ···
                      </button>
                      {isMenuOpen && (
                        <div
                          style={{ position: 'absolute', right: 0, top: '100%', marginTop: 2, background: 'var(--paper-3)', border: '1px solid var(--rule-2)', zIndex: 200, minWidth: 140, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
                          onMouseLeave={() => setMenuOpen(null)}
                        >
                          {[
                            { label: 'Duplicate', action: () => { onDuplicate(audit.id); setMenuOpen(null); } },
                            { label: 'Archive & Export', action: () => { onArchive(audit.id); setMenuOpen(null); } },
                            { label: 'Delete', action: () => { onDelete(audit.id); setMenuOpen(null); }, danger: true },
                          ].map(item => (
                            <button
                              key={item.label}
                              onClick={item.action}
                              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', background: 'none', border: 'none', borderBottom: '1px solid var(--rule)', fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', color: item.danger ? 'var(--impact-high)' : 'var(--ink-3)', cursor: 'pointer' }}
                              onMouseEnter={e => e.currentTarget.style.background = 'var(--paper-2)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'none'}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cap message when full */}
      {!demoMode && activeCount >= MAX_AUDITS && (
        <div style={{ marginTop: 20, padding: '14px 18px', background: 'var(--paper-3)', border: '1px solid var(--rule)', fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--ink-4)', letterSpacing: '0.04em', lineHeight: 1.6 }}>
          Workspace full. Archive a completed audit to free a slot — this exports the JSON so nothing is lost.
        </div>
      )}
    </div>
  );
};

Object.assign(window, { AuditListScreen });

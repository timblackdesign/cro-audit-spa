// Screen: Client Report — print-to-PDF view
// Clean white-paper editorial with indigo accents. Your Pricing hidden.

const ReportScreen = ({ audit, onBack }) => {
  const { useMemo } = React;

  const items = window.AUDIT_ITEMS;
  const clientInfo = audit.client_info || {};
  const auditItems = audit.items || {};

  const failItems = useMemo(() => items.filter(item => auditItems[item.id]?.status === 'fail'), [items, auditItems]);

  const LIFT_CAP_MIN = 3.0, LIFT_CAP_MAX = 6.0;
  const cvr = (parseFloat(clientInfo.cvr) || 0) / 100;
  const revenue = parseFloat(clientInfo.monthly_revenue) || 0;
  const aov = parseFloat(clientInfo.aov) || 0;
  const sessions = revenue > 0 && aov > 0 && cvr > 0 ? revenue / (aov * cvr) : 0;

  let totalMid = 0, totalMin = 0, totalMax = 0;
  failItems.forEach(f => {
    totalMid += (f.liftMin + f.liftMax) / 2;
    totalMin += f.liftMin;
    totalMax += f.liftMax;
  });
  const cappedMid = Math.min(totalMid, (LIFT_CAP_MIN + LIFT_CAP_MAX) / 2);
  const cappedMin = Math.min(totalMin, LIFT_CAP_MIN);
  const cappedMax = Math.min(totalMax, LIFT_CAP_MAX);
  const newCVR = cvr + (cappedMid / 100);
  const monthlyRecovery = sessions > 0 ? (sessions * aov * newCVR) - revenue : 0;
  const annualRecovery = monthlyRecovery * 12;
  const payback = audit.pricing?.implementation_fee > 0 && monthlyRecovery > 0
    ? ((parseFloat(clientInfo.audit_fee) || 0) + parseFloat(audit.pricing.implementation_fee)) / monthlyRecovery
    : null;

  const fmt = (n) => {
    const num = Math.round(n);
    if (num >= 1000000) return '$' + (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return '$' + (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return '$' + num.toLocaleString('en-US');
  };
  const fmtNum = (n) => Math.round(n).toLocaleString('en-US');

  const impactColor = { High: '#e53e3e', Medium: '#805ad5', Low: '#718096' };
  const impactBg   = { High: '#fff5f5', Medium: '#faf5ff', Low: '#f7fafc' };

  const pitch = audit.pitch_override || (failItems.length > 0 && revenue > 0
    ? `Our audit of ${clientInfo.client_name || 'your store'} identified ${failItems.length} conversion issue${failItems.length !== 1 ? 's' : ''} across the purchase funnel. Based on your current monthly revenue of ${fmt(revenue)} and conversion rate of ${(cvr * 100).toFixed(2)}%, addressing these findings is projected to recover ${fmt(annualRecovery)} in annual revenue — a ${cappedMin.toFixed(1)}–${cappedMax.toFixed(1)}% lift in conversion rate.`
    : null);

  // Group fails by section for the report table
  const sections = window.SECTIONS;
  const failsBySec = sections.map(sec => ({
    ...sec,
    fails: failItems.filter(f => f.section === sec.id),
  })).filter(s => s.fails.length > 0);

  return (
    <div>
      {/* ── SCREEN-ONLY: back nav + print CTA ── */}
      <div className="no-print" style={{ background: '#0e1018', borderBottom: '1px solid #252840', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: '#64748b', fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}
          onMouseEnter={e => e.currentTarget.style.color = '#e2e8f0'}
          onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
        >
          ← Back to calculator
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Print to PDF</span>
          <button
            onClick={() => window.print()}
            style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '9px 20px', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer' }}
          >
            Export Report
          </button>
        </div>
      </div>

      {/* ── PRINT DOCUMENT ── */}
      <div id="print-document" style={{ background: '#fff', color: '#111', minHeight: '100vh' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '60px 48px 80px' }}>

          {/* Cover block */}
          <div style={{ borderBottom: '3px solid #4338ca', paddingBottom: 32, marginBottom: 40 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6366f1', marginBottom: 16 }}>
              CRO Audit Report · for Shopify
            </div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 40, fontWeight: 400, color: '#1e1b4b', letterSpacing: '-1.5px', lineHeight: 1.05, marginBottom: 12 }}>
              {clientInfo.client_name || 'Client Name'}
            </h1>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {[
                ['Auditor', clientInfo.auditor_name],
                ['Date', clientInfo.audit_date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })],
                ['Store', clientInfo.store_url],
                ['Theme', clientInfo.shopify_theme],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6366a8', marginBottom: 3 }}>{label}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#1e1b4b', fontWeight: 500 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Impact Summary */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6366a8', marginBottom: 16 }}>Revenue Impact Summary</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#dde0f5', marginBottom: 20 }}>
              {[
                ['Monthly Sessions', fmtNum(sessions), 'estimated'],
                ['Current CVR', `${(cvr * 100).toFixed(2)}%`, 'baseline'],
                ['Projected CVR', `${(newCVR * 100).toFixed(2)}%`, `+${cappedMin.toFixed(1)}–${cappedMax.toFixed(1)}% lift`],
                ['Monthly Recovery', fmt(monthlyRecovery), 'per month'],
                ['Annual at Risk', fmt(annualRecovery), payback ? `pays back in ${payback.toFixed(1)} months` : null],
                ['Issues Found', `${failItems.length}`, 'across 6 sections'],
              ].map(([label, value, sub]) => (
                <div key={label} style={{ background: '#fff', padding: '16px 18px' }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6366a8', marginBottom: 6 }}>{label}</div>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#1e1b4b', lineHeight: 1, letterSpacing: '-0.5px' }}>{value}</div>
                  {sub && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#8688c0', marginTop: 4 }}>{sub}</div>}
                </div>
              ))}
            </div>

            {/* Pitch box */}
            {pitch && (
              <div style={{ borderLeft: '4px solid #4338ca', paddingLeft: 20, background: '#f0f2fe', padding: '20px 20px 20px 24px' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6366a8', marginBottom: 10 }}>ROI Summary</div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.75, color: '#1e1b4b' }}>{pitch}</p>
              </div>
            )}
          </div>

          {/* Findings table */}
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6366a8', marginBottom: 16 }}>Findings</div>

            {failsBySec.map(sec => (
              <div key={sec.id} style={{ marginBottom: 28 }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4338ca', borderBottom: '2px solid #4338ca', paddingBottom: 6, marginBottom: 14 }}>
                  {sec.label}
                </div>
                {sec.fails.map((item, i) => {
                  const itemState = auditItems[item.id] || {};
                  const finding = itemState.finding !== undefined ? itemState.finding : item.default_finding;
                  const recommendation = itemState.recommendation !== undefined ? itemState.recommendation : item.default_recommendation;
                  return (
                    <div key={item.id} style={{ borderBottom: i < sec.fails.length - 1 ? '1px solid #dde0f5' : 'none', paddingBottom: 20, marginBottom: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, fontWeight: 400, color: '#1e1b4b', letterSpacing: '-0.3px', marginBottom: 4 }}>
                            {item.name}
                          </h3>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, padding: '2px 8px', background: impactBg[item.impact], color: impactColor[item.impact], letterSpacing: '0.06em', textTransform: 'uppercase', border: `1px solid ${impactColor[item.impact]}33` }}>
                              {item.impact} Impact
                            </span>
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, padding: '2px 8px', background: '#f8f9ff', color: '#6366a8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                              +{item.liftMin}–{item.liftMax}% CVR lift
                            </span>
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, padding: '2px 8px', background: '#f8f9ff', color: '#6366a8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                              {item.fix_time}
                            </span>
                          </div>
                        </div>
                      </div>

                      {finding && (
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#e53e3e', marginBottom: 5 }}>Finding</div>
                          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.65, color: '#2d3748' }}>{finding}</p>
                        </div>
                      )}
                      {recommendation && (
                        <div>
                          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4338ca', marginBottom: 5 }}>Recommendation</div>
                          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.65, color: '#2d3748' }}>{recommendation}</p>
                        </div>
                      )}
                      {itemState.screenshot_url && (
                        <div style={{ marginTop: 8, fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#6366a8' }}>
                          Screenshot: <a href={itemState.screenshot_url} style={{ color: '#4338ca' }}>{itemState.screenshot_url}</a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ borderTop: '1px solid #dde0f5', paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 40 }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: '#8688c0', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              CRO Audit System for Shopify · {clientInfo.auditor_name || ''}
            </span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: '#8688c0', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {clientInfo.audit_date || ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { ReportScreen });

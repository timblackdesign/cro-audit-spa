// Screen: Calculator — Step 4
// Your Pricing (private) + Revenue Impact Summary + ROI Pitch
// Findings list has moved to FindingsScreen (Step 3).
// Inputs are lifted outside component to prevent focus loss.

function CalcNumberInput({ value, onChange, placeholder, prefix, style: extraStyle }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {prefix && (
        <span style={{ position: 'absolute', left: 10, fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--ink-4)', pointerEvents: 'none', zIndex: 1 }}>
          {prefix}
        </span>
      )}
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          border: `1px solid ${focused ? 'var(--accent)' : 'var(--rule)'}`,
          background: focused ? 'var(--paper-3)' : 'var(--paper)',
          padding: `9px 12px 9px ${prefix ? 22 : 12}px`,
          fontFamily: "'DM Mono', monospace",
          fontSize: 14,
          color: 'var(--ink)',
          outline: 'none',
          transition: 'border-color 0.15s, background 0.15s',
          MozAppearance: 'textfield',
          WebkitAppearance: 'none',
          ...extraStyle,
        }}
      />
    </div>
  );
}

function CalcPitchTextarea({ value, onChange }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={6}
      style={{
        width: '100%',
        background: 'var(--paper-2)',
        border: '1px solid var(--accent)',
        padding: '12px 14px',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
        color: 'var(--ink-2)',
        lineHeight: 1.75,
        resize: 'vertical',
        outline: 'none',
      }}
    />
  );
}

const CalculatorScreen = ({ audit, checkedIds, onBack, onViewReport }) => {
  const { useState, useMemo } = React;

  const items = window.AUDIT_ITEMS;
  const clientInfo = audit.client_info || {};
  const auditItems = audit.items || {};

  const failItems = useMemo(() => items.filter(item => auditItems[item.id]?.status === 'fail'), [items, auditItems]);
  const checkedItems = useMemo(() => failItems.filter(f => checkedIds[f.id]), [failItems, checkedIds]);

  const [implFee, setImplFee] = useState(audit.pricing?.implementation_fee || '');
  const [hourlyRate, setHourlyRate] = useState(audit.pricing?.hourly_rate || '');
  const [hours, setHours] = useState(audit.pricing?.estimated_hours || '');
  const [pitchOverride, setPitchOverride] = useState(audit.pitch_override || null);
  const [editingPitch, setEditingPitch] = useState(false);
  const [pitchDraft, setPitchDraft] = useState('');

  const LIFT_CAP_MIN = 3.0, LIFT_CAP_MAX = 6.0;

  const cvr = (parseFloat(clientInfo.cvr) || 0) / 100;
  const revenue = parseFloat(clientInfo.monthly_revenue) || 0;
  const aov = parseFloat(clientInfo.aov) || 0;
  const auditFee = parseFloat(clientInfo.audit_fee) || 0;
  const sessions = revenue > 0 && aov > 0 && cvr > 0 ? revenue / (aov * cvr) : 0;

  let totalMid = 0, totalMin = 0, totalMax = 0;
  checkedItems.forEach(f => {
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

  const highCount = checkedItems.filter(f => f.impact === 'High').length;
  const highRatio = checkedItems.length > 0 ? highCount / checkedItems.length : 0;
  const feePercent = highRatio >= 0.5 ? 0.20 : highRatio >= 0.25 ? 0.15 : 0.10;
  const suggestedFee = Math.round(annualRecovery * feePercent);
  const resolvedImpl = parseFloat(implFee) || suggestedFee;
  const totalInvestment = auditFee + resolvedImpl;
  const trueROI = totalInvestment > 0 && annualRecovery > 0 ? annualRecovery / totalInvestment : 0;
  const payback = totalInvestment > 0 && monthlyRecovery > 0 ? totalInvestment / monthlyRecovery : 0;

  // Hourly sanity
  const hr = parseFloat(hourlyRate), hrs = parseFloat(hours);
  let sanityState = 'neutral', sanityMsg = 'Enter your hourly rate and estimated hours to check.';
  if (hr > 0 && hrs > 0 && resolvedImpl > 0) {
    const hourlyTotal = hr * hrs;
    const diff = resolvedImpl - hourlyTotal;
    if (resolvedImpl >= hourlyTotal) {
      sanityState = 'pass';
      sanityMsg = `Your fee of ${fmt(resolvedImpl)} beats your hourly estimate of ${fmt(hourlyTotal)} by ${fmt(diff)} (+${Math.round((diff / hourlyTotal) * 100)}%). You're ahead.`;
    } else {
      sanityState = 'fail';
      sanityMsg = `Your fee of ${fmt(resolvedImpl)} is ${fmt(Math.abs(diff))} below your hourly estimate of ${fmt(hourlyTotal)}. Consider adjusting your fee or scope.`;
    }
  }

  const hasMetrics = revenue > 0 && aov > 0 && cvr > 0;

  // Pitch
  const generatedPitch = checkedItems.length > 0 && hasMetrics
    ? `Our audit of ${clientInfo.client_name || 'your store'} identified ${checkedItems.length} conversion issue${checkedItems.length !== 1 ? 's' : ''} across the purchase funnel. Based on your current monthly revenue of ${fmt(revenue)} and conversion rate of ${(cvr * 100).toFixed(2)}%, addressing these findings is projected to recover ${fmt(annualRecovery)} in annual revenue — a ${cappedMin.toFixed(1)}–${cappedMax.toFixed(1)}% lift in conversion rate. At a total engagement cost of ${fmt(totalInvestment)}, this represents a ${trueROI.toFixed(1)}× return on investment, paying back in approximately ${payback.toFixed(1)} months.`
    : null;

  const displayPitch = pitchOverride !== null ? pitchOverride : generatedPitch;

  const startEditing = () => { setPitchDraft(displayPitch || ''); setEditingPitch(true); };
  const savePitch = () => { setPitchOverride(pitchDraft); setEditingPitch(false); };
  const resetPitch = () => { setPitchOverride(null); setEditingPitch(false); };

  const labelStyle = { fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 8 };

  const MetricBox = ({ label, value, sub, green, large, span2 }) => (
    <div style={{ background: 'var(--paper-2)', padding: '16px 18px', gridColumn: span2 ? 'span 2' : undefined }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: large ? 36 : 24, color: green ? 'var(--accent-positive)' : 'var(--ink)', lineHeight: 1, letterSpacing: large ? '-1px' : '-0.3px' }}>{value}</div>
      {sub && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--ink-4)', marginTop: 5, lineHeight: 1.4 }}>{sub}</div>}
    </div>
  );

  // No metrics prompt
  const metricsGate = !hasMetrics && (
    <div style={{ background: 'var(--paper-3)', border: '1px solid var(--rule)', padding: '16px 18px', marginBottom: 2, fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--ink-4)', lineHeight: 1.7, letterSpacing: '0.02em' }}>
      Store metrics (revenue, AOV, CVR) are needed to calculate revenue impact.{' '}
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontFamily: 'inherit', fontSize: 'inherit', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
        Add them now →
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: 1060, margin: '0 auto', padding: '32px 20px 80px' }}>
      {/* Back */}
      <div style={{ marginBottom: 24 }}>
        <button onClick={onBack}
          style={{ background: 'none', border: 'none', color: 'var(--ink-4)', fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-4)'}
        >← Back to findings</button>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-5)', marginBottom: 8 }}>Step 4 of 4</div>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, fontWeight: 400, color: 'var(--ink)', letterSpacing: '-0.5px' }}>ROI Calculator</h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--ink-4)', marginTop: 6 }}>
          {checkedItems.length} finding{checkedItems.length !== 1 ? 's' : ''} included &nbsp;·&nbsp; {failItems.length} total failures
        </p>
      </div>

      {metricsGate}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 340px) 1fr', gap: 2, alignItems: 'start' }} className="calculator-grid">

        {/* LEFT: Your Pricing */}
        <div style={{ background: 'var(--paper-2)', border: '1px solid var(--rule)' }}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--rule)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ background: 'var(--paper-3)', color: 'var(--ink-4)', fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 8px', border: '1px solid var(--rule)' }}>PRIVATE</span>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 15, color: 'var(--ink)', letterSpacing: '-0.2px' }}>Your Pricing</span>
          </div>

          {/* Suggested fee */}
          <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--rule)' }}>
            <div style={labelStyle}>Suggested Implementation Fee</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
              <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 30, color: 'var(--accent-positive)', letterSpacing: '-1px', lineHeight: 1 }}>
                {annualRecovery > 0 ? fmt(suggestedFee) : '—'}
              </span>
              {annualRecovery > 0 && (
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--ink-4)' }}>{Math.round(feePercent * 100)}% of annual</span>
              )}
            </div>
            {annualRecovery > 0 && (
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--ink-5)', marginBottom: 14, lineHeight: 1.6 }}>
                Range: {fmt(annualRecovery * 0.10)} – {fmt(annualRecovery * 0.20)} · {highCount} high-impact
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--ink-4)', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Your fee</label>
              <CalcNumberInput value={implFee} onChange={setImplFee} placeholder={suggestedFee > 0 ? String(suggestedFee) : '0'} prefix="$" />
            </div>
          </div>

          {/* True ROI */}
          <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--rule)' }}>
            <div style={labelStyle}>True Client ROI</div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: trueROI > 0 ? 'var(--accent-positive)' : 'var(--ink-4)', letterSpacing: '-0.5px', marginBottom: 5 }}>
              {trueROI > 0 ? `${trueROI.toFixed(1)}×` : '—'}
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--ink-5)', lineHeight: 1.6 }}>
              {trueROI > 0
                ? `${fmt(annualRecovery)} annual ÷ (${fmt(auditFee)} audit + ${fmt(resolvedImpl)} impl.)`
                : 'Set implementation fee and store metrics above'}
            </div>
          </div>

          {/* Hourly sanity */}
          <div style={{ padding: '16px 18px' }}>
            <div style={labelStyle}>Hourly Rate Sanity Check</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--ink-5)', marginBottom: 5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Min hourly ($)</div>
                <CalcNumberInput value={hourlyRate} onChange={setHourlyRate} placeholder="75" />
              </div>
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--ink-5)', marginBottom: 5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Est. hours</div>
                <CalcNumberInput value={hours} onChange={setHours} placeholder="20" />
              </div>
            </div>
            <div style={{
              padding: '10px 12px',
              background: sanityState === 'pass' ? 'rgba(134,239,172,0.08)' : sanityState === 'fail' ? 'rgba(252,165,165,0.08)' : 'var(--paper-3)',
              border: `1px solid ${sanityState === 'pass' ? 'rgba(134,239,172,0.2)' : sanityState === 'fail' ? 'rgba(252,165,165,0.2)' : 'var(--rule)'}`,
              fontFamily: "'DM Mono', monospace", fontSize: 11,
              color: sanityState === 'pass' ? 'var(--state-pass)' : sanityState === 'fail' ? 'var(--state-fail)' : 'var(--ink-5)',
              lineHeight: 1.6, letterSpacing: '0.02em',
            }}>
              {sanityMsg}
            </div>
          </div>
        </div>

        {/* RIGHT: Revenue Impact Summary */}
        <div style={{ background: 'var(--paper-2)', border: '1px solid var(--rule)' }}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--rule)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ background: 'var(--accent)', color: '#fff', fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.06em', padding: '3px 8px' }}>04</span>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 15, color: 'var(--ink)', letterSpacing: '-0.2px' }}>Revenue Impact Summary</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, background: 'var(--rule)' }} className="metric-grid-3">
            <MetricBox label="Monthly Sessions" value={sessions > 0 ? fmtNum(sessions) : '—'} sub="estimated" />
            <MetricBox label="Current CVR" value={cvr > 0 ? `${(cvr * 100).toFixed(2)}%` : '—'} sub="baseline" />
            <MetricBox label="Projected CVR" value={newCVR > 0 && hasMetrics ? `${(newCVR * 100).toFixed(2)}%` : '—'} sub={hasMetrics ? `+${cappedMin.toFixed(1)}–${cappedMax.toFixed(1)}%` : null} green />
            <MetricBox label="Monthly Recovery" value={monthlyRecovery > 0 ? fmt(monthlyRecovery) : '—'} sub="per month" green />
            <MetricBox
              label="Annual Revenue at Risk"
              value={annualRecovery > 0 ? fmt(annualRecovery) : '—'}
              sub={trueROI > 0 ? `${trueROI.toFixed(1)}× return · pays back in ${payback.toFixed(1)} months` : null}
              green large span2
            />
          </div>

          {/* Structured Proposal Block */}
          <div style={{ padding: '18px 20px', background: 'var(--paper)', borderTop: '1px solid var(--rule)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 8 }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-5)' }}>Proposal Summary</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {pitchOverride !== null && !editingPitch && (
                  <button onClick={resetPitch} style={{ background: 'none', border: '1px solid var(--rule)', color: 'var(--ink-5)', fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', padding: '4px 10px' }}>Reset</button>
                )}
                {!editingPitch ? (
                  <button onClick={startEditing} style={{ background: 'var(--paper-3)', border: '1px solid var(--rule)', color: 'var(--ink-3)', fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', padding: '4px 10px' }}>Edit text</button>
                ) : (
                  <button onClick={savePitch} style={{ background: 'var(--accent)', border: 'none', color: '#fff', fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', padding: '4px 10px' }}>Save</button>
                )}
              </div>
            </div>

            {editingPitch ? (
              <CalcPitchTextarea value={pitchDraft} onChange={setPitchDraft} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--rule)' }}>
                {[
                  {
                    label: 'Scope',
                    value: checkedItems.length > 0
                      ? `${checkedItems.length} conversion issue${checkedItems.length !== 1 ? 's' : ''} identified across ${[...new Set(checkedItems.map(i => i.section))].length} sections of ${clientInfo.client_name || 'your store'}`
                      : '—',
                  },
                  {
                    label: 'Projected Lift',
                    value: hasMetrics && checkedItems.length > 0
                      ? `${cappedMin.toFixed(1)}–${cappedMax.toFixed(1)}% CVR improvement · ${fmt(monthlyRecovery)}/mo recovered`
                      : checkedItems.length > 0 ? `${cappedMin.toFixed(1)}–${cappedMax.toFixed(1)}% CVR lift (add metrics for $ amounts)` : '—',
                    green: hasMetrics && checkedItems.length > 0,
                  },
                  {
                    label: 'Annual Impact',
                    value: annualRecovery > 0 ? fmt(annualRecovery) : '—',
                    green: annualRecovery > 0,
                    large: true,
                  },
                  {
                    label: 'Investment',
                    value: totalInvestment > 0
                      ? `${fmt(auditFee)} audit + ${fmt(resolvedImpl)} implementation = ${fmt(totalInvestment)}`
                      : `${fmt(auditFee)} audit + set implementation fee`,
                  },
                  {
                    label: 'Client ROI',
                    value: trueROI > 0 ? `${trueROI.toFixed(1)}× return · pays back in ${payback.toFixed(1)} months` : '—',
                    green: trueROI > 0,
                  },
                ].map(row => (
                  <div key={row.label} style={{ background: 'var(--paper-2)', padding: '10px 14px', display: 'flex', alignItems: 'baseline', gap: 14 }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-5)', minWidth: 90, flexShrink: 0 }}>{row.label}</span>
                    <span style={{ fontFamily: row.large ? "'DM Serif Display', serif" : "'DM Sans', sans-serif", fontSize: row.large ? 22 : 13, color: row.green ? 'var(--accent-positive)' : 'var(--ink-3)', lineHeight: 1.3, letterSpacing: row.large ? '-0.5px' : 'normal' }}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ padding: '14px 20px', borderTop: '1px solid var(--rule)' }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--ink-5)', letterSpacing: '0.04em' }}>
              Report generates from checked findings above
            </div>
          </div>
        </div>
      </div>

      {/* ── STICKY BOTTOM CTA BAR ── */}
      <div style={{ height: 64 }}></div>
      <div className="no-print" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200, background: 'var(--paper-2)', borderTop: '1px solid var(--rule)', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--ink-5)', letterSpacing: '0.04em' }}>
          {checkedItems.length} finding{checkedItems.length !== 1 ? 's' : ''} · {annualRecovery > 0 ? fmt(annualRecovery) + ' annual recovery' : 'add metrics for $ figures'}
        </span>
        <button
          onClick={onViewReport}
          style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '11px 28px', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer' }}
        >
          View PDF Report →
        </button>
      </div>
    </div>
  );
};

function fmt(n) {
  const num = Math.round(n);
  if (num >= 1000000) return '$' + (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return '$' + (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return '$' + num.toLocaleString('en-US');
}
function fmtNum(n) { return Math.round(n).toLocaleString('en-US'); }

Object.assign(window, { CalculatorScreen, CalcNumberInput, CalcPitchTextarea });

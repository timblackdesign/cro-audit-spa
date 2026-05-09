// Screen: Client Info Form
// v2: Minimal upfront (client name + auditor), metrics deferred until calculator step.
// Store metrics live in a collapsible panel — freelancer can start auditing immediately.

// ── Lifted outside component to prevent focus loss ──
function CIInput({ value, onChange, placeholder, type = 'text', prefix, suffix, hint }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {prefix && (
          <span style={{ position: 'absolute', left: 12, fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--ink-4)', pointerEvents: 'none', zIndex: 1 }}>
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value ?? ''}
          onChange={e => onChange(type === 'number' ? (parseFloat(e.target.value) || '') : e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            border: `1px solid ${focused ? 'var(--accent)' : 'var(--rule)'}`,
            background: focused ? 'var(--paper-3)' : 'var(--paper)',
            padding: `11px ${suffix ? 30 : 14}px 11px ${prefix ? 26 : 14}px`,
            fontFamily: "'DM Mono', monospace",
            fontSize: 14,
            color: 'var(--ink)',
            outline: 'none',
            transition: 'border-color 0.15s, background 0.15s',
            MozAppearance: 'textfield',
            WebkitAppearance: 'none',
          }}
        />
        {suffix && (
          <span style={{ position: 'absolute', right: 12, fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--ink-4)', pointerEvents: 'none' }}>
            {suffix}
          </span>
        )}
      </div>
      {hint && (
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--ink-5)', marginTop: 5, letterSpacing: '0.04em' }}>
          {hint}
        </div>
      )}
    </div>
  );
}

function CIFieldLabel({ children, required }) {
  return (
    <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 7 }}>
      {children}
      {required && <span style={{ color: 'var(--accent)', marginLeft: 4 }}>*</span>}
    </label>
  );
}

const ClientInfoScreen = ({ clientInfo, onChange, onStart, onBack, demoMode, isEditing }) => {
  const { useState } = React;
  const [metricsOpen, setMetricsOpen] = useState(false);

  const set = (key, val) => onChange({ ...clientInfo, [key]: val });
  const isReady = clientInfo.client_name?.trim();

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px 100px' }}>
      {/* Back nav */}
      <button
        onClick={onBack}
        style={{ background: 'none', border: 'none', color: 'var(--ink-4)', fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', padding: 0, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 6 }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-4)'}
      >
        ← Back
      </button>

      {/* Page title */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-5)', marginBottom: 10 }}>
          {isEditing ? 'Edit audit' : 'New audit'}
        </div>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, fontWeight: 400, color: 'var(--ink)', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
          Client details
        </h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--ink-4)', marginTop: 10, lineHeight: 1.6 }}>
          Store metrics (revenue, AOV, CVR) are needed to calculate ROI. Audit fee is private and won't appear in the client report.
        </p>
      </div>

      {/* ── ESSENTIAL FIELDS ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 2 }}>
        <div style={{ background: 'var(--paper-2)', border: '1px solid var(--rule)', padding: '20px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div>
              <CIFieldLabel required>Client Name</CIFieldLabel>
              <CIInput value={clientInfo.client_name} onChange={v => set('client_name', v)} placeholder="Acme Boards Co." />
            </div>
            <div>
              <CIFieldLabel>Auditor Name</CIFieldLabel>
              <CIInput value={clientInfo.auditor_name} onChange={v => set('auditor_name', v)} placeholder="Your name" />
            </div>
            <div>
              <CIFieldLabel>Store URL</CIFieldLabel>
              <CIInput value={clientInfo.store_url} onChange={v => set('store_url', v)} placeholder="acmeboards.com" />
            </div>
            <div>
              <CIFieldLabel>Audit Date</CIFieldLabel>
              <CIInput value={clientInfo.audit_date} onChange={v => set('audit_date', v)} type="date" />
            </div>
          </div>
        </div>

        {/* ── OPTIONAL / COLLAPSIBLE: Store Metrics + Pricing ── */}
        <div style={{ background: 'var(--paper-2)', border: '1px solid var(--rule)' }}>
          <button
            onClick={() => setMetricsOpen(o => !o)}
            style={{ width: '100%', background: 'none', border: 'none', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', gap: 12 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 15, color: metricsOpen ? 'var(--ink)' : 'var(--ink-4)', letterSpacing: '-0.2px' }}>
                Store metrics &amp; pricing
              </span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--ink-5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                optional — needed for ROI calculator
              </span>
            </div>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--ink-5)', transform: metricsOpen ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>▼</span>
          </button>

          {metricsOpen && (
            <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--rule)' }}>
              <div style={{ paddingTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
                <div>
                  <CIFieldLabel>Monthly Revenue</CIFieldLabel>
                  <CIInput value={clientInfo.monthly_revenue} onChange={v => set('monthly_revenue', v)} type="number" placeholder="50000" prefix="$" />
                </div>
                <div>
                  <CIFieldLabel>Avg Order Value</CIFieldLabel>
                  <CIInput value={clientInfo.aov} onChange={v => set('aov', v)} type="number" placeholder="85" prefix="$" />
                </div>
                <div>
                  <CIFieldLabel>Conversion Rate</CIFieldLabel>
                  <CIInput value={clientInfo.cvr} onChange={v => set('cvr', v)} type="number" placeholder="1.8" suffix="%" hint="Shopify avg: 1.8%" />
                </div>
                <div>
                  <CIFieldLabel>Audit Fee</CIFieldLabel>
                  <CIInput value={clientInfo.audit_fee} onChange={v => set('audit_fee', v)} type="number" placeholder="500" prefix="$" hint="Private — not in report" />
                </div>
                <div>
                  <CIFieldLabel>Shopify Theme</CIFieldLabel>
                  <CIInput value={clientInfo.shopify_theme} onChange={v => set('shopify_theme', v)} placeholder="Dawn 12.0" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky footer CTA */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--paper)', borderTop: '1px solid var(--rule)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16, zIndex: 90 }}>
        {!isReady && (
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--ink-4)', letterSpacing: '0.04em' }}>
            Enter a client name to continue
          </span>
        )}
        <button
          onClick={onStart}
          disabled={!isReady}
          style={{ background: isReady ? 'var(--accent)' : 'var(--paper-3)', color: isReady ? '#fff' : 'var(--ink-5)', border: 'none', padding: '12px 28px', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: isReady ? 'pointer' : 'not-allowed', opacity: isReady ? 1 : 0.6 }}
        >
          {isEditing ? 'Save & Return →' : 'Start Audit →'}
        </button>
      </div>
    </div>
  );
};

Object.assign(window, { ClientInfoScreen, CIInput, CIFieldLabel });

// CRO Audit System — Shared Components
// Exported to window for use across screen files

const { useState, useCallback } = React;

// ── PRIMITIVES ──

function Card({ children, style }) {
  return (
    <div style={{
      background: 'var(--paper-2)',
      border: '1px solid var(--rule)',
      boxShadow: 'var(--shadow)',
      ...style
    }}>
      {children}
    </div>
  );
}

function CardTitle({ step, children }) {
  return (
    <div style={{
      fontFamily: "'DM Serif Display', serif",
      fontSize: 17,
      fontWeight: 400,
      padding: '14px 20px',
      borderBottom: '1px solid var(--rule)',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      color: 'var(--ink)',
    }}>
      {step && (
        <span style={{
          background: 'var(--accent)',
          color: '#fff',
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          letterSpacing: '0.06em',
          padding: '3px 8px',
          flexShrink: 0,
        }}>{step}</span>
      )}
      {children}
    </div>
  );
}

function Field({ label, hint, children, style }) {
  return (
    <div style={{ marginBottom: 0, ...style }}>
      {label && (
        <label style={{
          display: 'block',
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--ink-3)',
          marginBottom: 6,
        }}>{label}</label>
      )}
      {children}
      {hint && (
        <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 5 }}>{hint}</div>
      )}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = 'text', prefix, suffix, focused }) {
  const [isFocused, setFocused] = useState(false);
  const active = isFocused || focused;
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {prefix && (
        <span style={{ position: 'absolute', left: 14, fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--ink-4)', pointerEvents: 'none' }}>{prefix}</span>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(type === 'number' ? parseFloat(e.target.value) || '' : e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          border: `1px solid ${active ? 'var(--accent)' : 'var(--rule)'}`,
          background: active ? 'var(--paper-3)' : 'var(--paper)',
          padding: `10px ${suffix ? 32 : 14}px 10px ${prefix ? 30 : 14}px`,
          fontFamily: "'DM Mono', monospace",
          fontSize: 14,
          color: 'var(--ink)',
          outline: 'none',
          transition: 'border-color 0.15s, background 0.15s',
          MozAppearance: 'textfield',
        }}
      />
      {suffix && (
        <span style={{ position: 'absolute', right: 14, fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--ink-4)', pointerEvents: 'none' }}>{suffix}</span>
      )}
    </div>
  );
}

function BtnPrimary({ children, onClick, disabled, style }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'var(--accent)',
        color: '#fff',
        border: 'none',
        padding: '14px 36px',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.28 : hov ? 0.85 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        transition: 'opacity 0.15s',
        ...style,
      }}
    >{children}</button>
  );
}

function BtnBack({ onClick, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'none',
        border: 'none',
        color: hov ? 'var(--ink)' : 'var(--ink-4)',
        fontFamily: "'DM Mono', monospace",
        fontSize: 11,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        padding: 0,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        transition: 'color 0.15s',
      }}
    >{children || '← Back'}</button>
  );
}

function ImpactPill({ impact }) {
  const styles = {
    High:   { background: 'var(--red-bg)',   color: 'var(--red)'   },
    Medium: { background: 'var(--amber-bg)', color: 'var(--amber)' },
    Low:    { background: 'var(--paper-2)',  color: 'var(--ink-3)' },
  };
  const s = styles[impact] || styles.Low;
  return (
    <span style={{
      display: 'inline-block',
      fontFamily: "'DM Mono', monospace",
      fontSize: 10,
      fontWeight: 500,
      letterSpacing: '0.04em',
      padding: '3px 8px',
      textTransform: 'uppercase',
      ...s,
    }}>{impact}</span>
  );
}

function SectionKicker({ children }) {
  return (
    <div style={{
      fontFamily: "'DM Mono', monospace",
      fontSize: 10,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--ink-5)',
      marginBottom: 20,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    }}>
      <span style={{ display: 'block', width: 20, height: 1, background: 'var(--rule)' }}></span>
      {children}
    </div>
  );
}

function MetricCell({ label, value, sub, green, large, span }) {
  return (
    <div style={{
      background: 'var(--paper-2)',
      padding: 20,
      gridColumn: span ? '1 / -1' : undefined,
    }}>
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--ink-3)',
        marginBottom: 6,
      }}>{label}</div>
      <div style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: large ? 36 : 28,
        color: green ? 'var(--green)' : 'var(--ink)',
        lineHeight: 1,
      }}>{value}</div>
      {sub && (
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: 'var(--ink-3)',
          marginTop: 4,
        }}>{sub}</div>
      )}
    </div>
  );
}

function WizardFooter({ hint, onContinue, continueLabel, disabled }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16, paddingTop: 4 }}>
      {hint && (
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--ink-4)', letterSpacing: '0.04em' }}>{hint}</span>
      )}
      <BtnPrimary onClick={onContinue} disabled={disabled}>
        {continueLabel || 'Continue'} &nbsp;→
      </BtnPrimary>
    </div>
  );
}

function fmt(n) {
  const num = Math.round(n);
  if (num >= 1000000) return '$' + (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000)    return '$' + (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return '$' + num.toLocaleString('en-US');
}

function fmtNum(n) { return Math.round(n).toLocaleString('en-US'); }

// Export all to window
Object.assign(window, {
  Card, CardTitle, Field, TextInput,
  BtnPrimary, BtnBack, ImpactPill,
  SectionKicker, MetricCell, WizardFooter,
  fmt, fmtNum,
});

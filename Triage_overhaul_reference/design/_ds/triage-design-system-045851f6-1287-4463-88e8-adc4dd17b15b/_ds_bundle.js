/* @ds-bundle: {"format":4,"namespace":"TriageDesignSystem_045851","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"Wordmark","sourcePath":"components/brand/Wordmark.jsx"},{"name":"CodeToken","sourcePath":"components/code/CodeToken.jsx"},{"name":"InlineCode","sourcePath":"components/code/InlineCode.jsx"},{"name":"InstallChip","sourcePath":"components/code/InstallChip.jsx"},{"name":"Terminal","sourcePath":"components/code/Terminal.jsx"},{"name":"MetricPanel","sourcePath":"components/data/MetricPanel.jsx"},{"name":"FindingRow","sourcePath":"components/findings/FindingRow.jsx"},{"name":"PriorityTag","sourcePath":"components/findings/PriorityTag.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"SectionHeader","sourcePath":"components/layout/SectionHeader.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"d46db1bb0215","components/brand/Wordmark.jsx":"8c43a3404043","components/code/CodeToken.jsx":"91e5fb82c778","components/code/InlineCode.jsx":"441af870c913","components/code/InstallChip.jsx":"565ef0ca36f5","components/code/Terminal.jsx":"7da6922f70d5","components/data/MetricPanel.jsx":"b5a327e90046","components/findings/FindingRow.jsx":"65b8e061570c","components/findings/PriorityTag.jsx":"71713dc30aff","components/forms/Checkbox.jsx":"38a65cd34b75","components/forms/Input.jsx":"d8b431ff2581","components/forms/Select.jsx":"a69341b1a73c","components/layout/SectionHeader.jsx":"1e51d1f5de9b","components/navigation/NavBar.jsx":"6fd0adb199ef","ui_kits/site/AuditSetup.jsx":"262308779955","ui_kits/site/Landing.jsx":"597fe38d7d48","ui_kits/site/Report.jsx":"b8f64d907c90","ui_kits/site/data.js":"52c0e27528d7"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.TriageDesignSystem_045851 = window.TriageDesignSystem_045851 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/Button.jsx
try { (() => {
function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  onClick,
  style,
  type = 'button'
}) {
  const [h, setH] = React.useState(false);
  const pad = size === 'sm' ? '10px 16px' : '15px 22px';
  const fs = size === 'sm' ? 11 : 12;
  const base = {
    whiteSpace: 'nowrap',
    flexShrink: 0,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    fontSize: fs,
    letterSpacing: 'var(--tracking-button)',
    textTransform: 'uppercase',
    padding: pad,
    borderRadius: 0,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'opacity 120ms ease',
    opacity: disabled ? 0.4 : h ? 0.85 : 1,
    lineHeight: 1.2
  };
  const v = {
    primary: {
      background: 'var(--btn-bg)',
      color: 'var(--btn-ink)',
      border: '1px solid var(--btn-bg)'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--ink)',
      border: '1px solid var(--rule)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--ink)',
      border: '1px solid transparent',
      padding: size === 'sm' ? '10px 0' : '15px 0'
    }
  }[variant];
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      ...base,
      ...v,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/brand/Wordmark.jsx
try { (() => {
function Wordmark({
  variant = 'cursor',
  size = 44,
  color,
  style
}) {
  const isU = variant === 'underscore';
  return /*#__PURE__*/React.createElement("span", {
    "aria-label": "triage",
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: size,
      lineHeight: 1,
      letterSpacing: 'var(--tracking-wordmark)',
      color: color || 'var(--ink)',
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: isU ? '.05em' : '.06em',
      ...style
    }
  }, "triage", isU ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'inline-block',
      width: '.46em',
      height: '.11em',
      background: 'var(--wordmark-accent)'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'inline-block',
      width: '.42em',
      height: '.74em',
      background: 'var(--wordmark-accent)',
      transform: 'translateY(.06em)'
    }
  }));
}
Object.assign(__ds_scope, { Wordmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Wordmark.jsx", error: String((e && e.message) || e) }); }

// components/code/CodeToken.jsx
try { (() => {
const MAP = {
  prompt: {
    color: 'var(--accent-text)'
  },
  flag: {
    color: 'var(--accent-text)'
  },
  string: {
    color: 'var(--code-string)'
  },
  meta: {
    color: 'var(--mute)'
  },
  path: {
    color: 'var(--mute)'
  },
  loss: {
    color: 'var(--loss)'
  },
  gain: {
    color: 'var(--gain)'
  },
  tag: {
    background: 'var(--accent)',
    color: 'var(--on-accent)',
    padding: '0 3px'
  }
};
function CodeToken({
  kind = 'meta',
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: MAP[kind] || {}
  }, children);
}
Object.assign(__ds_scope, { CodeToken });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/code/CodeToken.jsx", error: String((e && e.message) || e) }); }

// components/code/InlineCode.jsx
try { (() => {
function InlineCode({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: '.88em',
      color: 'var(--ink)',
      background: 'var(--surface)',
      border: '1px solid var(--rule)',
      padding: '1px 6px',
      borderRadius: 0,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { InlineCode });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/code/InlineCode.jsx", error: String((e && e.message) || e) }); }

// components/code/InstallChip.jsx
try { (() => {
function InstallChip({
  command = 'npm i -g @triage/cli',
  prompt = '$',
  copyable = true,
  style
}) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    if (!copyable) return;
    try {
      navigator.clipboard && navigator.clipboard.writeText(command);
    } catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return /*#__PURE__*/React.createElement("span", {
    onClick: copy,
    title: copyable ? 'Copy' : undefined,
    style: {
      whiteSpace: 'nowrap',
      flexShrink: 0,
      display: 'inline-flex',
      gap: 8,
      alignItems: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      lineHeight: 1.2,
      padding: '14px 16px',
      border: '1px solid var(--rule)',
      borderRadius: 0,
      color: 'var(--ink)',
      cursor: copyable ? 'pointer' : 'default',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--mute)'
    }
  }, prompt), command, copyable && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 8,
      fontWeight: 600,
      fontSize: 11,
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: copied ? 'var(--accent-text)' : 'var(--mute)'
    }
  }, copied ? 'copied' : 'copy'));
}
Object.assign(__ds_scope, { InstallChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/code/InstallChip.jsx", error: String((e && e.message) || e) }); }

// components/code/Terminal.jsx
try { (() => {
function Terminal({
  title = '~/themes/acme-supply',
  shell = 'zsh',
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-code)',
      border: '1px solid var(--rule)',
      borderRadius: 0,
      overflow: 'hidden',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 16px',
      borderBottom: '1px solid var(--rule)',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '.06em',
      color: 'var(--mute)',
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", null, title), /*#__PURE__*/React.createElement("span", null, shell)), /*#__PURE__*/React.createElement("pre", {
    style: {
      margin: 0,
      padding: '18px 20px',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-code)',
      lineHeight: 'var(--leading-code)',
      color: 'var(--ink)',
      whiteSpace: 'pre',
      overflowX: 'auto'
    }
  }, children));
}
Object.assign(__ds_scope, { Terminal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/code/Terminal.jsx", error: String((e && e.message) || e) }); }

// components/data/MetricPanel.jsx
try { (() => {
const TONE = {
  ink: 'var(--ink)',
  loss: 'var(--loss)',
  gain: 'var(--gain)',
  mute: 'var(--mute)'
};
function MetricPanel({
  items = [],
  columns,
  style
}) {
  const n = columns || items.length || 1;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(' + n + ', minmax(0,1fr))',
      border: '1px solid var(--rule)',
      background: 'var(--surface)',
      borderRadius: 0,
      ...style
    }
  }, items.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: '18px 20px',
      borderLeft: i % n ? '1px solid var(--rule)' : 'none',
      borderTop: i >= n ? '1px solid var(--rule)' : 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      fontSize: 11,
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      color: 'var(--mute)'
    }
  }, m.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 'var(--text-figure-lg)',
      lineHeight: 1,
      letterSpacing: 'var(--tracking-heading)',
      color: TONE[m.tone || 'ink'],
      whiteSpace: 'nowrap'
    }
  }, m.value, m.unit && /*#__PURE__*/React.createElement("small", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      fontSize: 11,
      letterSpacing: '.06em',
      color: 'var(--mute)',
      marginLeft: 4
    }
  }, m.unit)), m.note && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--mute)'
    }
  }, m.note))));
}
Object.assign(__ds_scope, { MetricPanel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/MetricPanel.jsx", error: String((e && e.message) || e) }); }

// components/findings/PriorityTag.jsx
try { (() => {
function PriorityTag({
  level = 'P0',
  muted = false,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      fontFamily: 'var(--font-mono)',
      fontWeight: 600,
      fontSize: 11,
      lineHeight: 1.2,
      letterSpacing: 'var(--tracking-tag)',
      padding: '5px 8px',
      background: muted ? 'transparent' : 'var(--accent)',
      color: muted ? 'var(--mute)' : 'var(--on-accent)',
      border: muted ? '1px solid var(--rule)' : '1px solid var(--accent)',
      borderRadius: 0,
      ...style
    }
  }, level);
}
Object.assign(__ds_scope, { PriorityTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/findings/PriorityTag.jsx", error: String((e && e.message) || e) }); }

// components/findings/FindingRow.jsx
try { (() => {
function FindingRow({
  level = 'P0',
  title,
  path,
  amount,
  unit = '/MO',
  muted = false,
  onClick,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--rule)',
      borderRadius: 0,
      padding: '18px 20px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px 18px',
      alignItems: 'center',
      cursor: onClick ? 'pointer' : 'default',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.PriorityTag, {
    level: level,
    muted: muted
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 240px',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 500,
      color: 'var(--ink)',
      lineHeight: 1.35
    }
  }, title), path && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--mute)',
      marginTop: 4,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, path)), amount != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 30,
      lineHeight: 1,
      color: muted ? 'var(--mute)' : 'var(--loss)',
      whiteSpace: 'nowrap',
      letterSpacing: '-.02em',
      marginLeft: 'auto'
    }
  }, amount, /*#__PURE__*/React.createElement("small", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      fontSize: 11,
      letterSpacing: '.06em',
      color: 'var(--mute)',
      marginLeft: 4
    }
  }, unit)));
}
Object.assign(__ds_scope, { FindingRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/findings/FindingRow.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  style
}) {
  const [inner, setInner] = React.useState(defaultChecked);
  const on = checked != null ? checked : inner;
  const toggle = () => {
    if (disabled) return;
    if (checked == null) setInner(!on);
    onChange && onChange(!on);
  };
  return /*#__PURE__*/React.createElement("span", {
    role: "checkbox",
    "aria-checked": on,
    tabIndex: 0,
    onClick: toggle,
    onKeyDown: e => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggle();
      }
    },
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      fontSize: 15,
      color: 'var(--ink)',
      outline: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 16,
      flexShrink: 0,
      border: '1px solid ' + (on ? 'var(--accent)' : 'var(--rule)'),
      background: on ? 'var(--accent)' : 'var(--bg)',
      color: 'var(--on-accent)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      fontWeight: 600,
      lineHeight: 1
    }
  }, on ? '✓' : ''), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function Input({
  label,
  prefix,
  placeholder,
  value,
  defaultValue,
  onChange,
  mono = true,
  error,
  hint,
  disabled = false,
  style
}) {
  const [f, setF] = React.useState(false);
  const bc = error ? 'var(--loss)' : f ? 'var(--ink)' : 'var(--rule)';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      fontSize: 11,
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      color: 'var(--mute)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      border: '1px solid ' + bc,
      background: 'var(--bg)',
      padding: '0 14px',
      boxShadow: f && !error ? 'inset 0 -2px 0 var(--accent)' : 'none'
    }
  }, prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'var(--mute)'
    }
  }, prefix), /*#__PURE__*/React.createElement("input", {
    disabled: disabled,
    placeholder: placeholder,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    onFocus: () => setF(true),
    onBlur: () => setF(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: 0,
      outline: 0,
      background: 'transparent',
      padding: '13px 0',
      fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)',
      fontSize: mono ? 13 : 15,
      color: 'var(--ink)'
    }
  })), (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: error ? 'var(--loss)' : 'var(--mute)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function Select({
  label,
  options = [],
  value,
  defaultValue,
  onChange,
  disabled = false,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      fontSize: 11,
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      color: 'var(--mute)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'flex',
      border: '1px solid var(--rule)',
      background: 'var(--bg)'
    }
  }, /*#__PURE__*/React.createElement("select", {
    disabled: disabled,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      flex: 1,
      border: 0,
      outline: 0,
      background: 'transparent',
      padding: '13px 40px 13px 14px',
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'var(--ink)',
      borderRadius: 0,
      cursor: 'pointer'
    }
  }, options.map(o => {
    const v = typeof o === 'string' ? o : o.value;
    const l = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      right: 14,
      top: '50%',
      transform: 'translateY(-50%)',
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--mute)',
      pointerEvents: 'none'
    }
  }, "\u25BE")));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/layout/SectionHeader.jsx
try { (() => {
function SectionHeader({
  num,
  title,
  note,
  aside,
  style
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'auto minmax(0,1fr) auto',
      gap: 40,
      alignItems: 'end',
      padding: '32px 0',
      borderBottom: '1px solid var(--rule)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", null, num && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      fontSize: 12,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'var(--mute)',
      marginBottom: 6
    }
  }, num), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 40,
      lineHeight: 1,
      letterSpacing: '-.04em',
      color: 'var(--ink)'
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      lineHeight: 1.5,
      color: 'var(--mute)',
      maxWidth: 620,
      textWrap: 'pretty'
    }
  }, note), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      fontSize: 11,
      lineHeight: 1.8,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: 'var(--mute)',
      textAlign: 'right'
    }
  }, aside));
}
Object.assign(__ds_scope, { SectionHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/SectionHeader.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
function NavBar({
  links = ['Checks', 'CLI', 'Pricing', 'Docs'],
  active,
  cta = 'Run an audit →',
  onCta,
  onLink,
  wordmarkVariant = 'cursor',
  right,
  style
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 32,
      padding: '18px 48px',
      borderBottom: '1px solid var(--rule)',
      background: 'var(--bg)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Wordmark, {
    size: 24,
    variant: wordmarkVariant
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      marginLeft: 16
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    onClick: e => {
      e.preventDefault();
      onLink && onLink(l);
    },
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      fontSize: 11,
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      color: active === l ? 'var(--ink)' : 'var(--mute)',
      borderBottom: active === l ? '1px solid var(--accent)' : '1px solid transparent',
      paddingBottom: 2
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, right, cta && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "sm",
    onClick: onCta
  }, cta)));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/AuditSetup.jsx
try { (() => {
function AuditSetup({
  onDone
}) {
  const {
    Input,
    Select,
    Checkbox,
    Button,
    Terminal,
    CodeToken: T,
    SectionHeader
  } = window.TriageDesignSystem_045851;
  const [store, setStore] = React.useState('acme-supply.myshopify.com');
  const [step, setStep] = React.useState(-1);
  const lines = [/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(T, {
    kind: "prompt"
  }, "$"), " triage audit ", /*#__PURE__*/React.createElement(T, {
    kind: "flag"
  }, "--store"), " ", /*#__PURE__*/React.createElement(T, {
    kind: "string"
  }, store), " ", /*#__PURE__*/React.createElement(T, {
    kind: "flag"
  }, "--theme"), " ", /*#__PURE__*/React.createElement(T, {
    kind: "string"
  }, "1420")), /*#__PURE__*/React.createElement(T, {
    kind: "meta"
  }, "  fetching theme \xB7 6 templates"), /*#__PURE__*/React.createElement(T, {
    kind: "meta"
  }, "  running 60 checks"), /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(T, {
    kind: "meta"
  }, "  11 findings \xB7 "), /*#__PURE__*/React.createElement(T, {
    kind: "gain"
  }, "\u2713 49 passed"), /*#__PURE__*/React.createElement(T, {
    kind: "meta"
  }, " \xB7 2.1s"))];
  React.useEffect(() => {
    if (step < 0) return;
    if (step >= lines.length) {
      const t = setTimeout(onDone, 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep(s => s + 1), 520);
    return () => clearTimeout(t);
  }, [step]);
  return /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 1180,
      margin: '0 auto',
      padding: '0 48px 96px'
    }
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    num: "New audit",
    title: "Point triage at a store",
    note: "Connect a theme. Triage pulls the Liquid, runs 60 checks and prices every failure against benchmark conversion data.",
    aside: /*#__PURE__*/React.createElement(React.Fragment, null, "CLI equivalent", /*#__PURE__*/React.createElement("br", null), "triage audit")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 520px), 1fr))',
      gap: 64,
      paddingTop: 48
    }
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setStep(0);
    },
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Store",
    prefix: "https://",
    value: store,
    onChange: e => setStore(e.target.value)
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Theme",
    options: ['Dawn · #1420 (live)', 'Refresh · #1388']
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Templates",
    options: ['All templates', 'Product', 'Collection', 'Cart']
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    label: "Include passed checks",
    defaultChecked: true
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Export PDF"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    disabled: step >= 0
  }, step >= 0 ? 'Running…' : 'Run audit →'))), /*#__PURE__*/React.createElement(Terminal, {
    title: '~/themes/' + store.split('.')[0]
  }, step < 0 ? /*#__PURE__*/React.createElement(T, {
    kind: "meta"
  }, "  waiting for input") : lines.slice(0, step + 1).map((l, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, l, '\n')))));
}
Object.assign(window, {
  AuditSetup
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/AuditSetup.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/Landing.jsx
try { (() => {
function Landing({
  onRun
}) {
  const {
    Button,
    InstallChip,
    InlineCode,
    FindingRow,
    Terminal,
    Wordmark
  } = window.TriageDesignSystem_045851;
  return /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 1180,
      margin: '0 auto',
      padding: '72px 48px 96px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 520px), 1fr))',
      gap: 64,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 44
  }), /*#__PURE__*/React.createElement("span", {
    className: "t-label"
  }, "The CRO Audit System for Shopify Devs")), /*#__PURE__*/React.createElement("h1", {
    className: "t-display"
  }, "Ship the fix that costs the ", /*#__PURE__*/React.createElement("em", null, "most.")), /*#__PURE__*/React.createElement("p", {
    className: "t-body",
    style: {
      maxWidth: 540
    }
  }, "Triage scans your Shopify theme against 60 conversion checks and ranks every failure by monthly revenue. Run ", /*#__PURE__*/React.createElement(InlineCode, null, "triage audit"), " from the terminal. Hand the client a number."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: onRun
  }, "Run an audit \u2192"), /*#__PURE__*/React.createElement(InstallChip, {
    command: "npm i -g @triage/cli"
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement(FindingRow, window.TRIAGE_FINDINGS[0]), /*#__PURE__*/React.createElement(Terminal, null, /*#__PURE__*/React.createElement(CliSample, null))));
}
function CliSample() {
  const T = window.TriageDesignSystem_045851.CodeToken;
  const pad = (s, n) => s.padEnd(n, ' ');
  const row = (f, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, ' ', /*#__PURE__*/React.createElement(T, {
    kind: "tag"
  }, f.level), '  ', /*#__PURE__*/React.createElement(T, {
    kind: "path"
  }, pad(f.path, 32)), pad(f.short, 28), /*#__PURE__*/React.createElement(T, {
    kind: "loss"
  }, f.amount.padStart(7, ' '), "/mo"), '\n');
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(T, {
    kind: "prompt"
  }, "$"), " triage audit ", /*#__PURE__*/React.createElement(T, {
    kind: "flag"
  }, "--store"), " ", /*#__PURE__*/React.createElement(T, {
    kind: "string"
  }, "acme-supply.myshopify.com"), " ", /*#__PURE__*/React.createElement(T, {
    kind: "flag"
  }, "--theme"), " ", /*#__PURE__*/React.createElement(T, {
    kind: "string"
  }, "1420"), '\n', /*#__PURE__*/React.createElement(T, {
    kind: "meta"
  }, "  60 checks \xB7 6 templates \xB7 2.1s"), '\n\n', window.TRIAGE_FINDINGS.map(row), /*#__PURE__*/React.createElement(T, {
    kind: "meta"
  }, "  + 8 more  \xB7  "), /*#__PURE__*/React.createElement(T, {
    kind: "gain"
  }, "\u2713 49 passed"), '\n\n', "  Recoverable  ", /*#__PURE__*/React.createElement(T, {
    kind: "gain"
  }, "$8,940/mo"), "   ", /*#__PURE__*/React.createElement(T, {
    kind: "meta"
  }, "\u2192 triage report --pdf"));
}
Object.assign(window, {
  Landing,
  CliSample
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/Landing.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/Report.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Report({
  onNew
}) {
  const {
    SectionHeader,
    MetricPanel,
    FindingRow,
    Button,
    Terminal,
    CodeToken: T
  } = window.TriageDesignSystem_045851;
  const [open, setOpen] = React.useState(0);
  const F = window.TRIAGE_FINDINGS;
  return /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 1180,
      margin: '0 auto',
      padding: '0 48px 96px'
    }
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    num: "Report \xB7 acme-supply",
    title: "11 findings",
    note: "Ranked by estimated monthly revenue. Figures use published CRO benchmarks applied to this store's traffic.",
    aside: /*#__PURE__*/React.createElement(React.Fragment, null, "Theme #1420", /*#__PURE__*/React.createElement("br", null), "60 checks \xB7 2.1s")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 40,
      display: 'flex',
      flexDirection: 'column',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement(MetricPanel, {
    items: [{
      label: 'Recoverable',
      value: '$8,940',
      unit: '/MO',
      tone: 'gain'
    }, {
      label: 'Top finding',
      value: '−$3,120',
      unit: '/MO',
      tone: 'loss'
    }, {
      label: 'Findings',
      value: '11'
    }, {
      label: 'Passed',
      value: '49',
      note: 'of 60 checks'
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, F.map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement(FindingRow, _extends({}, f, {
    onClick: () => setOpen(open === i ? -1 : i)
  })), open === i && /*#__PURE__*/React.createElement(Terminal, {
    title: f.path,
    shell: "diff",
    style: {
      borderTop: 0
    }
  }, /*#__PURE__*/React.createElement(T, {
    kind: "meta"
  }, "  ", f.short, " \xB7 ", f.level), '\n', /*#__PURE__*/React.createElement(T, {
    kind: "prompt"
  }, "$"), " triage explain ", /*#__PURE__*/React.createElement(T, {
    kind: "string"
  }, f.path), '\n', /*#__PURE__*/React.createElement(T, {
    kind: "meta"
  }, "  see full context in the PDF report")))), /*#__PURE__*/React.createElement("div", {
    className: "t-label",
    style: {
      padding: '6px 0'
    }
  }, "+ 8 more \xB7 \u2713 49 passed")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, null, "Export PDF \u2192"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: onNew
  }, "New audit"))));
}
Object.assign(window, {
  Report
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/Report.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/data.js
try { (() => {
window.TRIAGE_FINDINGS = [{
  level: 'P0',
  title: 'Add to cart sits below the fold on mobile',
  path: 'sections/main-product.liquid:88',
  amount: '−$3,120',
  short: 'ATC below fold on mobile'
}, {
  level: 'P1',
  title: 'No free-shipping threshold in the cart drawer',
  path: 'snippets/cart-drawer.liquid:142',
  amount: '−$1,940',
  short: 'No free-shipping threshold'
}, {
  level: 'P2',
  title: 'Filters reset on back navigation',
  path: 'templates/collection.json',
  amount: '−$860',
  short: 'Filters reset on back nav'
}];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Wordmark = __ds_scope.Wordmark;

__ds_ns.CodeToken = __ds_scope.CodeToken;

__ds_ns.InlineCode = __ds_scope.InlineCode;

__ds_ns.InstallChip = __ds_scope.InstallChip;

__ds_ns.Terminal = __ds_scope.Terminal;

__ds_ns.MetricPanel = __ds_scope.MetricPanel;

__ds_ns.FindingRow = __ds_scope.FindingRow;

__ds_ns.PriorityTag = __ds_scope.PriorityTag;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.SectionHeader = __ds_scope.SectionHeader;

__ds_ns.NavBar = __ds_scope.NavBar;

})();

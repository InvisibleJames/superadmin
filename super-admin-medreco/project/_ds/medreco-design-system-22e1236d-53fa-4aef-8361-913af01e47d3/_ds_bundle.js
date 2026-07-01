/* @ds-bundle: {"format":3,"namespace":"MedRecoDesignSystem_22e123","components":[{"name":"Avatar","sourcePath":"components/data-display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/data-display/Badge.jsx"},{"name":"StatCard","sourcePath":"components/data-display/StatCard.jsx"},{"name":"ProgressBar","sourcePath":"components/feedback/ProgressBar.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"}],"sourceHashes":{"components/data-display/Avatar.jsx":"ceeb31e46dea","components/data-display/Badge.jsx":"f4a7469ca06d","components/data-display/StatCard.jsx":"ff5fb379c06d","components/feedback/ProgressBar.jsx":"2bfe5f832ebd","components/forms/Button.jsx":"edec33b4fd0f","components/forms/Checkbox.jsx":"c3c3a07fc699","components/forms/IconButton.jsx":"b316a14ffd33","components/forms/Input.jsx":"2ddb5855dbef","components/forms/Select.jsx":"118f6e30efac","ui_kits/medreco-admin/ImportDrawer.jsx":"2306133b704c","ui_kits/medreco-admin/Sidebar.jsx":"0cdb0553bea8","ui_kits/medreco-admin/Topbar.jsx":"4b1cb5a02acf","ui_kits/medreco-admin/UsersScreen.jsx":"60773d53dad6","ui_kits/medreco-admin/data.js":"82f7d3467e32","ui_kits/medreco-admin/icons.jsx":"006a66e7095e"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MedRecoDesignSystem_22e123 = window.MedRecoDesignSystem_22e123 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/data-display/Avatar.jsx
try { (() => {
/**
 * MedReco Avatar — user image with initials fallback and optional status ring.
 * Deterministic tint per name when no image is provided.
 */
const TINTS = [['#2D7FF9', '#1857BC'], ['#18C7B5', '#0E8678'], ['#8B5CF6', '#6D3FD4'], ['#F5A524', '#C97E10'], ['#29D391', '#1593A0'], ['#EC6A9C', '#B43A6E']];
function hashName(s = '') {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = h * 31 + s.charCodeAt(i) >>> 0;
  return h;
}
function initials(name = '') {
  const parts = name.replace(/[^\p{L}\s.]/gu, '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
function Avatar({
  name = '',
  src,
  size = 36,
  status,
  style = {}
}) {
  const [g1, g2] = TINTS[hashName(name) % TINTS.length];
  const statusColor = status === 'active' ? 'var(--success-500)' : status === 'inactive' ? 'var(--danger-500)' : null;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      flex: 'none',
      width: size,
      height: size,
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    width: size,
    height: size,
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      objectFit: 'cover',
      border: '1px solid var(--border-default)'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${g1}, ${g2})`,
      color: '#fff',
      fontFamily: 'var(--font-sans)',
      fontWeight: 600,
      fontSize: Math.round(size * 0.38),
      letterSpacing: '0.01em'
    }
  }, initials(name)), statusColor && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: -1,
      bottom: -1,
      width: Math.max(8, size * 0.28),
      height: Math.max(8, size * 0.28),
      borderRadius: '50%',
      background: statusColor,
      border: '2px solid var(--surface-card)'
    }
  }));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Badge.jsx
try { (() => {
/**
 * MedReco Badge — compact status / role / count pill.
 * `tone` picks the color family; `dot` adds a leading status dot;
 * `role` is a convenience shorthand mapping a MedReco role to its hue.
 */
const TONES = {
  neutral: {
    fg: 'var(--text-secondary)',
    bg: 'var(--tint-neutral)',
    bd: 'rgba(138,151,166,.26)',
    dot: 'var(--neutral-300)'
  },
  teal: {
    fg: 'var(--teal-300)',
    bg: 'var(--tint-teal)',
    bd: 'rgba(24,199,181,.3)',
    dot: 'var(--teal-400)'
  },
  blue: {
    fg: 'var(--blue-300)',
    bg: 'var(--tint-blue)',
    bd: 'rgba(45,127,249,.3)',
    dot: 'var(--blue-400)'
  },
  violet: {
    fg: '#B9A3FB',
    bg: 'var(--tint-violet)',
    bd: 'rgba(139,92,246,.32)',
    dot: 'var(--role-manager)'
  },
  amber: {
    fg: '#FFC65C',
    bg: 'var(--tint-amber)',
    bd: 'rgba(245,165,36,.3)',
    dot: 'var(--role-owner)'
  },
  success: {
    fg: 'var(--success-500)',
    bg: 'var(--tint-success)',
    bd: 'rgba(41,211,145,.3)',
    dot: 'var(--success-500)'
  },
  danger: {
    fg: 'var(--danger-500)',
    bg: 'var(--tint-danger)',
    bd: 'rgba(244,71,90,.3)',
    dot: 'var(--danger-500)'
  }
};
const ROLE_TONE = {
  'Business Owner': 'amber',
  'Business Director': 'teal',
  'Doctor': 'teal',
  'Manager': 'violet',
  'Staff': 'blue'
};
function Badge({
  children,
  tone = 'neutral',
  role,
  dot = false,
  solid = false,
  size = 'md',
  style = {}
}) {
  const t = TONES[role ? ROLE_TONE[role] || 'neutral' : tone];
  const pads = size === 'sm' ? '3px 8px' : '4px 11px';
  const fs = size === 'sm' ? 11 : 12;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: pads,
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--font-sans)',
      fontSize: fs,
      fontWeight: 600,
      lineHeight: 1.2,
      whiteSpace: 'nowrap',
      color: solid ? '#06241F' : t.fg,
      background: solid ? t.dot : t.bg,
      border: `1px solid ${solid ? 'transparent' : t.bd}`,
      ...style
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      flex: 'none',
      background: solid ? '#06241F' : t.dot
    }
  }), role || children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/data-display/StatCard.jsx
try { (() => {
/**
 * MedReco StatCard — KPI tile for dashboard headers (Total Users, Active, etc).
 * Big value, label, optional icon chip and trend/sublabel.
 */
function StatCard({
  label,
  value,
  icon = null,
  accent = 'teal',
  delta = null,
  deltaDirection = 'up',
  sublabel = null,
  style = {}
}) {
  const [hover, setHover] = React.useState(false);
  const accents = {
    teal: 'var(--teal-400)',
    blue: 'var(--blue-400)',
    success: 'var(--success-500)',
    danger: 'var(--danger-500)',
    amber: 'var(--warning-500)',
    neutral: 'var(--text-secondary)'
  };
  const tints = {
    teal: 'var(--tint-teal)',
    blue: 'var(--tint-blue)',
    success: 'var(--tint-success)',
    danger: 'var(--tint-danger)',
    amber: 'var(--tint-amber)',
    neutral: 'var(--tint-neutral)'
  };
  const valueColor = accent === 'success' || accent === 'danger' ? accents[accent] : 'var(--text-primary)';
  const up = deltaDirection === 'up';
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      padding: '18px 20px',
      background: 'var(--surface-card)',
      border: '1px solid',
      borderColor: hover ? 'var(--border-default)' : 'var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-xs)',
      transition: 'border-color var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out)',
      minWidth: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body-med)',
      fontSize: 13,
      color: 'var(--text-tertiary)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, label), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      flex: 'none',
      borderRadius: 'var(--radius-md)',
      background: tints[accent],
      color: accents[accent]
    }
  }, icon)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 9,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: 30,
      letterSpacing: '-0.02em',
      color: valueColor,
      fontVariantNumeric: 'tabular-nums',
      lineHeight: 1
    }
  }, value), delta != null && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3,
      fontSize: 12.5,
      fontWeight: 600,
      color: up ? 'var(--success-500)' : 'var(--danger-500)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    style: {
      transform: up ? 'none' : 'rotate(180deg)'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 19V5M5 12l7-7 7 7",
    stroke: "currentColor",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), delta), sublabel && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-tertiary)'
    }
  }, sublabel)));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressBar.jsx
try { (() => {
/**
 * MedReco ProgressBar — determinate progress for imports/exports.
 * Optional striped animation and inline percentage label.
 */
function ProgressBar({
  value = 0,
  tone = 'teal',
  height = 10,
  animated = true,
  showLabel = false,
  style = {}
}) {
  const pct = Math.max(0, Math.min(100, value));
  const fills = {
    teal: 'var(--grad-cta)',
    blue: 'linear-gradient(90deg, var(--blue-500), var(--blue-400))',
    success: 'linear-gradient(90deg, var(--success-600), var(--success-500))',
    danger: 'linear-gradient(90deg, var(--danger-600), var(--danger-500))'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      flex: 1,
      height,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--surface-sunken)',
      overflow: 'hidden',
      border: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      width: `${pct}%`,
      background: fills[tone],
      backgroundSize: animated ? '28px 28px' : undefined,
      borderRadius: 'var(--radius-pill)',
      transition: 'width var(--dur-slow) var(--ease-out)',
      boxShadow: '0 0 12px rgba(24,199,181,0.35)'
    }
  }, animated && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'repeating-linear-gradient(45deg, rgba(255,255,255,.16) 0 8px, transparent 8px 16px)',
      animation: 'medreco-stripe 0.7s linear infinite'
    }
  }))), showLabel && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-primary)',
      fontVariantNumeric: 'tabular-nums',
      minWidth: 42,
      textAlign: 'right'
    }
  }, Math.round(pct), "%"), /*#__PURE__*/React.createElement("style", null, `@keyframes medreco-stripe { to { background-position: 28px 0; } }`));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * MedReco Button — primary action control.
 * Variants: primary (teal/green gradient CTA), secondary (charcoal surface),
 * ghost (transparent), danger (destructive). Sizes: sm | md | lg.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft = null,
  iconRight = null,
  disabled = false,
  full = false,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const heights = {
    sm: 32,
    md: 38,
    lg: 44
  };
  const pads = {
    sm: '0 12px',
    md: '0 16px',
    lg: '0 20px'
  };
  const fontSizes = {
    sm: 13,
    md: 14,
    lg: 14
  };
  const base = {
    display: full ? 'flex' : 'inline-flex',
    width: full ? '100%' : undefined,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: heights[size],
    padding: pads[size],
    fontFamily: 'var(--font-sans)',
    fontSize: fontSizes[size],
    fontWeight: 'var(--fw-semibold)',
    letterSpacing: '-0.005em',
    borderRadius: 'var(--radius-md)',
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    whiteSpace: 'nowrap',
    transition: 'background var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
    transform: active && !disabled ? 'translateY(0.5px) scale(0.99)' : 'none',
    userSelect: 'none'
  };
  const variants = {
    primary: {
      background: 'var(--grad-cta)',
      color: '#06241F',
      boxShadow: hover && !disabled ? 'var(--glow-teal)' : 'var(--shadow-xs)'
    },
    secondary: {
      background: hover && !disabled ? 'var(--surface-active)' : 'var(--surface-raised)',
      color: 'var(--text-primary)',
      borderColor: hover && !disabled ? 'var(--border-strong)' : 'var(--border-default)',
      boxShadow: 'var(--inset-top)'
    },
    ghost: {
      background: hover && !disabled ? 'var(--surface-hover)' : 'transparent',
      color: 'var(--text-secondary)'
    },
    danger: {
      background: hover && !disabled ? 'var(--danger-600)' : 'var(--danger-500)',
      color: '#fff',
      boxShadow: 'var(--shadow-xs)'
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: {
      ...base,
      ...variants[variant],
      ...style
    }
  }, rest), iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      flex: 'none'
    }
  }, iconLeft), children, iconRight && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      flex: 'none'
    }
  }, iconRight));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
/**
 * MedReco Checkbox — used for row selection and form toggles.
 * Supports checked, unchecked, and indeterminate (header "select all").
 */
function Checkbox({
  checked = false,
  indeterminate = false,
  onChange,
  disabled = false,
  size = 18,
  style = {}
}) {
  const on = checked || indeterminate;
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "checkbox",
    "aria-checked": indeterminate ? 'mixed' : checked,
    disabled: disabled,
    onClick: () => onChange && onChange(!checked),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      flex: 'none',
      padding: 0,
      borderRadius: 'var(--radius-xs)',
      border: '1.5px solid',
      borderColor: on ? 'transparent' : 'var(--border-strong)',
      background: on ? 'var(--accent-primary)' : 'var(--surface-input)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
      boxShadow: on ? '0 1px 4px rgba(24,199,181,0.35)' : 'none',
      ...style
    }
  }, indeterminate ? /*#__PURE__*/React.createElement("svg", {
    width: size - 6,
    height: size - 6,
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14",
    stroke: "#06241F",
    strokeWidth: "3",
    strokeLinecap: "round"
  })) : checked ? /*#__PURE__*/React.createElement("svg", {
    width: size - 5,
    height: size - 5,
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6L9 17l-5-5",
    stroke: "#06241F",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })) : null);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * MedReco IconButton — square control for a single icon (table actions,
 * topbar utilities, toolbar buttons). Variants mirror Button.
 */
function IconButton({
  children,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  active = false,
  title,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const dims = {
    sm: 30,
    md: 36,
    lg: 40
  };
  const d = dims[size];
  const variants = {
    ghost: {
      background: active ? 'var(--surface-active)' : hover && !disabled ? 'var(--surface-hover)' : 'transparent',
      color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
      borderColor: 'transparent'
    },
    secondary: {
      background: hover && !disabled ? 'var(--surface-active)' : 'var(--surface-raised)',
      color: 'var(--text-secondary)',
      borderColor: 'var(--border-default)'
    },
    danger: {
      background: hover && !disabled ? 'var(--tint-danger)' : 'transparent',
      color: 'var(--danger-500)',
      borderColor: 'transparent'
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    title: title,
    "aria-label": title,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: d,
      height: d,
      flex: 'none',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transition: 'background var(--dur) var(--ease-out), color var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out)',
      ...variants[variant],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * MedReco Input — text field with optional leading/trailing adornments.
 * Used for global search, filter inputs, and form fields.
 */
function Input({
  value,
  onChange,
  placeholder,
  iconLeft = null,
  iconRight = null,
  size = 'md',
  disabled = false,
  full = false,
  style = {},
  inputStyle = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const heights = {
    sm: 32,
    md: 38,
    lg: 44
  };
  const h = heights[size];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: full ? 'flex' : 'inline-flex',
      width: full ? '100%' : undefined,
      alignItems: 'center',
      gap: 9,
      height: h,
      padding: `0 ${size === 'lg' ? 14 : 12}px`,
      background: 'var(--surface-input)',
      border: '1px solid',
      borderColor: focus ? 'var(--border-focus)' : 'var(--border-default)',
      borderRadius: 'var(--radius-md)',
      boxShadow: focus ? 'var(--ring-accent)' : 'var(--inset-top)',
      transition: 'border-color var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out)',
      opacity: disabled ? 0.55 : 1,
      ...style
    }
  }, iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      flex: 'none',
      color: focus ? 'var(--text-secondary)' : 'var(--text-tertiary)'
    }
  }, iconLeft), /*#__PURE__*/React.createElement("input", _extends({
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      height: '100%',
      border: 'none',
      outline: 'none',
      background: 'transparent',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-sans)',
      fontSize: size === 'sm' ? 13 : 14,
      ...inputStyle
    }
  }, rest)), iconRight && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      flex: 'none',
      color: 'var(--text-tertiary)'
    }
  }, iconRight));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
/**
 * MedReco Select — filter / form dropdown. Renders a labeled trigger
 * ("Role: All") and an anchored option menu. Controlled via value/onChange.
 */
function Select({
  label,
  value,
  options = [],
  onChange,
  size = 'md',
  placeholder = 'Select',
  full = false,
  style = {}
}) {
  const [open, setOpen] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const ref = React.useRef(null);
  const heights = {
    sm: 32,
    md: 38,
    lg: 44
  };
  const h = heights[size];
  React.useEffect(() => {
    const onDoc = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  const selected = options.find(o => (typeof o === 'string' ? o : o.value) === value);
  const selectedLabel = selected ? typeof selected === 'string' ? selected : selected.label : null;
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      position: 'relative',
      display: full ? 'block' : 'inline-block',
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setOpen(o => !o),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      width: full ? '100%' : undefined,
      height: h,
      padding: '0 12px',
      background: hover || open ? 'var(--surface-active)' : 'var(--surface-input)',
      border: '1px solid',
      borderColor: open ? 'var(--border-focus)' : 'var(--border-default)',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: size === 'sm' ? 13 : 14,
      color: 'var(--text-primary)',
      whiteSpace: 'nowrap',
      boxShadow: open ? 'var(--ring-accent)' : 'var(--inset-top)',
      transition: 'background var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out)'
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-tertiary)',
      fontWeight: 500
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      color: selectedLabel ? 'var(--text-primary)' : 'var(--text-tertiary)',
      fontWeight: 500
    }
  }, selectedLabel || placeholder), /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    style: {
      marginLeft: 'auto',
      flex: 'none',
      transform: open ? 'rotate(180deg)' : 'none',
      transition: 'transform var(--dur) var(--ease-out)',
      color: 'var(--text-tertiary)'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6 6-6",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: h + 6,
      left: 0,
      minWidth: full ? '100%' : 200,
      zIndex: 40,
      background: 'var(--surface-raised)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--elev-popover)',
      padding: 6,
      maxHeight: 280,
      overflowY: 'auto'
    }
  }, options.map(o => {
    const val = typeof o === 'string' ? o : o.value;
    const lab = typeof o === 'string' ? o : o.label;
    const isSel = val === value;
    return /*#__PURE__*/React.createElement(OptionRow, {
      key: val,
      selected: isSel,
      onClick: () => {
        onChange && onChange(val);
        setOpen(false);
      }
    }, lab);
  })));
}
function OptionRow({
  children,
  selected,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      padding: '8px 10px',
      borderRadius: 'var(--radius-sm)',
      cursor: 'pointer',
      background: hover ? 'var(--surface-hover)' : 'transparent',
      color: selected ? 'var(--text-accent)' : 'var(--text-secondary)',
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      fontWeight: selected ? 600 : 400
    }
  }, children, selected && /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    style: {
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6L9 17l-5-5",
    stroke: "currentColor",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// ui_kits/medreco-admin/ImportDrawer.jsx
try { (() => {
/* MedReco Admin — Import drawer (5-step CSV import with progress). window.MedImportDrawer */
function ImportDrawer({
  open,
  onClose
}) {
  const I = window.MedIcons;
  const {
    Button,
    ProgressBar,
    Badge
  } = window.DS;
  // step: 0 upload, 1 validate, 2 preview, 3 importing, 4 done
  const [step, setStep] = React.useState(0);
  const [pct, setPct] = React.useState(0);
  const timer = React.useRef(null);
  React.useEffect(() => {
    if (!open) {
      setStep(0);
      setPct(0);
      clearInterval(timer.current);
    }
  }, [open]);
  React.useEffect(() => {
    if (step === 3) {
      setPct(0);
      timer.current = setInterval(() => {
        setPct(p => {
          if (p >= 100) {
            clearInterval(timer.current);
            setTimeout(() => setStep(4), 350);
            return 100;
          }
          return Math.min(100, p + Math.random() * 7 + 2);
        });
      }, 220);
    }
    return () => clearInterval(timer.current);
  }, [step]);
  if (!open) return null;
  const total = 1200;
  const processed = Math.round(pct / 100 * total);
  const failed = Math.min(12, Math.round(pct / 100 * 12));
  const success = Math.max(0, processed - failed);
  const eta = pct >= 100 ? '0s' : `${Math.max(1, Math.round((100 - pct) / 6))}s`;
  const steps = ['Upload', 'Validate', 'Preview', 'Import'];
  const activeStepIdx = Math.min(step, 3);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--overlay-scrim)',
      backdropFilter: 'blur(2px)',
      animation: 'med-fade 0.2s ease'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 'min(560px, 94vw)',
      height: '100%',
      background: 'var(--surface-card)',
      borderLeft: '1px solid var(--border-default)',
      boxShadow: 'var(--shadow-xl)',
      display: 'flex',
      flexDirection: 'column',
      animation: 'med-slide-in 0.26s var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '18px 22px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 38,
      height: 38,
      borderRadius: 'var(--radius-md)',
      background: 'var(--tint-teal)',
      color: 'var(--teal-400)'
    }
  }, /*#__PURE__*/React.createElement(I.importIn, {
    size: 19
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, "Import Users"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-tertiary)'
    }
  }, "Bulk-create users from a CSV file")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      display: 'inline-flex',
      width: 34,
      height: 34,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-sm)',
      border: 'none',
      background: 'transparent',
      color: 'var(--text-tertiary)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(I.x, {
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 0,
      padding: '16px 22px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, steps.map((s, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: s
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 24,
      height: 24,
      borderRadius: '50%',
      background: i < activeStepIdx || step === 4 ? 'var(--accent-primary)' : i === activeStepIdx ? 'var(--tint-teal)' : 'var(--surface-raised)',
      border: '1px solid',
      borderColor: i <= activeStepIdx || step === 4 ? 'transparent' : 'var(--border-default)',
      color: i < activeStepIdx || step === 4 ? '#06241F' : i === activeStepIdx ? 'var(--teal-400)' : 'var(--text-tertiary)',
      fontSize: 11.5,
      fontWeight: 700
    }
  }, i < activeStepIdx || step === 4 ? /*#__PURE__*/React.createElement(I.check, {
    size: 13
  }) : i + 1), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      fontWeight: i === activeStepIdx ? 600 : 500,
      color: i === activeStepIdx ? 'var(--text-primary)' : 'var(--text-tertiary)'
    }
  }, s)), i < steps.length - 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: i < activeStepIdx ? 'var(--accent-primary)' : 'var(--border-default)',
      margin: '0 10px'
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: 22
    }
  }, step === 0 && /*#__PURE__*/React.createElement(UploadStep, {
    I: I
  }), step === 1 && /*#__PURE__*/React.createElement(ValidateStep, {
    I: I,
    Badge: Badge
  }), step === 2 && /*#__PURE__*/React.createElement(PreviewStep, {
    I: I,
    Badge: Badge
  }), (step === 3 || step === 4) && /*#__PURE__*/React.createElement(ProgressStep, {
    I: I,
    ProgressBar: ProgressBar,
    pct: pct,
    processed: processed,
    total: total,
    success: success,
    failed: failed,
    eta: eta,
    done: step === 4
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '16px 22px',
      borderTop: '1px solid var(--border-subtle)'
    }
  }, step === 3 ? /*#__PURE__*/React.createElement(Button, {
    variant: "danger",
    iconLeft: /*#__PURE__*/React.createElement(I.x, {
      size: 15
    }),
    onClick: onClose
  }, "Cancel Import") : /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: onClose
  }, step === 4 ? 'Close' : 'Cancel'), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      gap: 10
    }
  }, step === 4 && /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    iconLeft: /*#__PURE__*/React.createElement(I.download, {
      size: 15
    })
  }, "Error report"), step < 3 && /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    iconRight: /*#__PURE__*/React.createElement(I.chevronRight, {
      size: 15
    }),
    onClick: () => setStep(step + 1)
  }, step === 0 ? 'Validate' : step === 1 ? 'Preview' : 'Start Import'), step === 4 && /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    iconLeft: /*#__PURE__*/React.createElement(I.check, {
      size: 15
    }),
    onClick: onClose
  }, "Done")))), /*#__PURE__*/React.createElement("style", null, `
        @keyframes med-slide-in { from { transform: translateX(24px); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes med-fade { from { opacity: 0; } to { opacity: 1; } }
      `));
}
function UploadStep({
  I
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1.5px dashed var(--border-strong)',
      borderRadius: 'var(--radius-lg)',
      padding: '40px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
      textAlign: 'center',
      background: 'var(--surface-sunken)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 52,
      height: 52,
      borderRadius: 'var(--radius-lg)',
      background: 'var(--tint-teal)',
      color: 'var(--teal-400)'
    }
  }, /*#__PURE__*/React.createElement(I.upload, {
    size: 24
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14.5,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, "Drop your CSV here, or browse"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-tertiary)'
    }
  }, "Up to 5,000 rows \xB7 .csv \xB7 max 10 MB")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 14px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-raised)',
      border: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--success-500)'
    }
  }, /*#__PURE__*/React.createElement(I.fileCsv, {
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, "users.csv"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--text-tertiary)',
      fontFamily: 'var(--font-mono)'
    }
  }, "1,200 rows \xB7 248 KB")), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-tertiary)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(I.x, {
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-tertiary)',
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--blue-400)'
    }
  }, /*#__PURE__*/React.createElement(I.download, {
    size: 15
  })), "Need the format? ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'var(--text-link)'
    }
  }, "Download the sample template")));
}
function ValidateStep({
  I,
  Badge
}) {
  const rows = [['Required columns present', 'ok', '9 / 9 columns matched'], ['Email format', 'ok', 'All 1,200 valid'], ['Duplicate usernames', 'warn', '3 duplicates will be skipped'], ['Role values', 'err', '12 rows have unknown roles']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-tertiary)',
      marginBottom: 4
    }
  }, "Validation complete \u2014 review issues before importing."), rows.map(([label, st, note]) => /*#__PURE__*/React.createElement("div", {
    key: label,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 14px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-raised)',
      border: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: st === 'ok' ? 'var(--success-500)' : st === 'warn' ? 'var(--warning-500)' : 'var(--danger-500)'
    }
  }, st === 'ok' ? /*#__PURE__*/React.createElement(I.check, {
    size: 18
  }) : /*#__PURE__*/React.createElement(I.alert, {
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      fontWeight: 500,
      color: 'var(--text-primary)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-tertiary)'
    }
  }, note)), /*#__PURE__*/React.createElement(Badge, {
    tone: st === 'ok' ? 'success' : st === 'warn' ? 'amber' : 'danger',
    size: "sm"
  }, st === 'ok' ? 'Passed' : st === 'warn' ? 'Warning' : 'Error'))));
}
function PreviewStep({
  I,
  Badge
}) {
  const sample = [['Naphat Boonmee', 'naphat.b', 'Doctor', 'active'], ['Kanya Phongam', 'kanya.p', 'Staff', 'active'], ['Wichai Tongdee', 'wichai.t', 'Manager', 'active'], ['Pranee Suksawat', 'pranee.s', 'Doctor', 'inactive']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-tertiary)'
    }
  }, "Previewing first 4 of ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--text-secondary)'
    }
  }, "1,185"), " importable records."), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: 'var(--surface-sunken)'
    }
  }, ['Name', 'Username', 'Role', 'Status'].map(h => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: {
      textAlign: 'left',
      padding: '9px 12px',
      font: 'var(--fw-semibold) 11px var(--font-sans)',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      color: 'var(--text-tertiary)',
      borderBottom: '1px solid var(--border-default)'
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, sample.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", {
    style: previewTd
  }, r[0]), /*#__PURE__*/React.createElement("td", {
    style: {
      ...previewTd,
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--text-secondary)'
    }
  }, r[1]), /*#__PURE__*/React.createElement("td", {
    style: previewTd
  }, /*#__PURE__*/React.createElement(Badge, {
    role: r[2],
    size: "sm"
  })), /*#__PURE__*/React.createElement("td", {
    style: previewTd
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: r[3] === 'active' ? 'success' : 'danger',
    dot: true,
    size: "sm"
  }, r[3] === 'active' ? 'Active' : 'Inactive'))))))));
}
const previewTd = {
  padding: '10px 12px',
  borderBottom: '1px solid var(--border-subtle)',
  color: 'var(--text-primary)',
  whiteSpace: 'nowrap'
};
function ProgressStep({
  I,
  ProgressBar,
  pct,
  processed,
  total,
  success,
  failed,
  eta,
  done
}) {
  const fmt = n => n.toLocaleString('en-US');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: done ? 'var(--success-500)' : 'var(--teal-400)'
    }
  }, done ? /*#__PURE__*/React.createElement(I.check, {
    size: 20
  }) : /*#__PURE__*/React.createElement(I.fileCsv, {
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, done ? 'Import complete' : 'Importing users.csv'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-tertiary)',
      fontFamily: 'var(--font-mono)'
    }
  }, done ? 'Finished in 24s' : `Estimated ${eta} remaining`)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 22,
      fontWeight: 700,
      color: done ? 'var(--success-500)' : 'var(--text-primary)'
    }
  }, Math.round(pct), "%")), /*#__PURE__*/React.createElement(ProgressBar, {
    value: pct,
    tone: done ? 'success' : 'teal',
    height: 12,
    animated: !done
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-tertiary)',
      fontFamily: 'var(--font-mono)'
    }
  }, "Processed ", fmt(processed), " / ", fmt(total), " records"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    label: "Processed",
    value: fmt(processed),
    color: "var(--text-primary)"
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Success",
    value: fmt(success),
    color: "var(--success-500)"
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Failed",
    value: fmt(failed),
    color: "var(--danger-500)"
  })), done && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 14px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--tint-danger)',
      border: '1px solid rgba(244,71,90,.25)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--danger-500)'
    }
  }, /*#__PURE__*/React.createElement(I.alert, {
    size: 17
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--text-primary)'
    }
  }, "12 records failed"), " \u2014 download the error report to review and re-upload.")));
}
function Stat({
  label,
  value,
  color
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 14px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-raised)',
      border: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--text-tertiary)',
      marginBottom: 5
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 19,
      fontWeight: 700,
      color
    }
  }, value));
}
window.MedImportDrawer = ImportDrawer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/medreco-admin/ImportDrawer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/medreco-admin/Sidebar.jsx
try { (() => {
/* MedReco Admin — collapsible left sidebar. window.MedSidebar */
function Sidebar({
  active,
  onNavigate,
  collapsed,
  onToggle
}) {
  const I = window.MedIcons;
  const {
    nav
  } = window.MedData;
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: collapsed ? 'var(--sidebar-w-collapsed)' : 'var(--sidebar-w)',
      flex: 'none',
      height: '100%',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width var(--dur) var(--ease-out)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 'var(--topbar-h)',
      flex: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      padding: collapsed ? '0' : '0 18px',
      justifyContent: collapsed ? 'center' : 'space-between',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/medreco-mark.png",
    alt: "MedReco",
    style: {
      width: 30,
      height: 30,
      flex: 'none',
      objectFit: 'contain'
    }
  }), !collapsed && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      lineHeight: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: 17,
      letterSpacing: '-0.02em'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-primary)'
    }
  }, "Med"), /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'var(--grad-brand)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent'
    }
  }, "Reco")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--text-tertiary)',
      marginTop: 3
    }
  }, "Super Admin"))), !collapsed && /*#__PURE__*/React.createElement("button", {
    onClick: onToggle,
    title: "Collapse",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 28,
      height: 28,
      borderRadius: 'var(--radius-sm)',
      border: 'none',
      background: 'transparent',
      color: 'var(--text-tertiary)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(I.chevronsLeft, {
    size: 16
  }))), /*#__PURE__*/React.createElement("nav", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: collapsed ? '12px 10px' : '14px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, nav.map(group => /*#__PURE__*/React.createElement("div", {
    key: group.section,
    style: {
      marginBottom: 10
    }
  }, !collapsed && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fw-semibold) 10.5px var(--font-sans)',
      letterSpacing: '0.09em',
      textTransform: 'uppercase',
      color: 'var(--text-tertiary)',
      padding: '8px 12px 7px'
    }
  }, group.section), collapsed && /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--border-subtle)',
      margin: '8px 6px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, group.items.map(item => /*#__PURE__*/React.createElement(NavItem, {
    key: item.id,
    item: item,
    active: active === item.id,
    collapsed: collapsed,
    onClick: () => onNavigate(item.id),
    Icon: I[item.icon]
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'none',
      borderTop: '1px solid var(--border-subtle)',
      padding: collapsed ? 10 : 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: collapsed ? 0 : '8px 10px',
      borderRadius: 'var(--radius-md)',
      justifyContent: collapsed ? 'center' : 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 34,
      borderRadius: '50%',
      background: 'var(--grad-brand)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontWeight: 700,
      fontSize: 13
    }
  }, "SA"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: -1,
      bottom: -1,
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: 'var(--success-500)',
      border: '2px solid var(--bg-sidebar)'
    }
  })), !collapsed && /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, "Super Admin"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--success-500)',
      display: 'flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'var(--success-500)'
    }
  }), "Online")), !collapsed && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-tertiary)'
    }
  }, /*#__PURE__*/React.createElement(window.MedIcons.chevronDown, {
    size: 15
  })))));
}
function NavItem({
  item,
  active,
  collapsed,
  onClick,
  Icon
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    title: collapsed ? item.label : undefined,
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      width: '100%',
      height: 40,
      padding: collapsed ? 0 : '0 12px',
      justifyContent: collapsed ? 'center' : 'flex-start',
      background: active ? 'var(--tint-teal)' : hover ? 'var(--surface-hover)' : 'transparent',
      border: 'none',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      color: active ? 'var(--text-primary)' : hover ? 'var(--text-secondary)' : 'var(--text-tertiary)',
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      fontWeight: active ? 600 : 500,
      transition: 'background var(--dur) var(--ease-out), color var(--dur) var(--ease-out)',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 3,
      height: active ? 22 : hover ? 16 : 0,
      borderRadius: '0 3px 3px 0',
      background: 'var(--accent-primary)',
      transition: 'height var(--dur) var(--ease-out)',
      opacity: active ? 1 : hover ? 0.6 : 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      color: active ? 'var(--accent-primary)' : 'inherit',
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    size: 18
  })), !collapsed && /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, item.label));
}
window.MedSidebar = Sidebar;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/medreco-admin/Sidebar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/medreco-admin/Topbar.jsx
try { (() => {
/* MedReco Admin — top navigation bar. window.MedTopbar */
function Topbar({
  breadcrumb,
  onToggleSidebar,
  collapsed
}) {
  const I = window.MedIcons;
  return /*#__PURE__*/React.createElement("header", {
    style: {
      height: 'var(--topbar-h)',
      flex: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '0 22px',
      background: 'var(--bg-topbar)',
      borderBottom: '1px solid var(--border-subtle)',
      backdropFilter: 'blur(8px)',
      position: 'sticky',
      top: 0,
      zIndex: 20
    }
  }, collapsed && /*#__PURE__*/React.createElement("button", {
    onClick: onToggleSidebar,
    title: "Expand menu",
    style: iconBtn
  }, /*#__PURE__*/React.createElement(I.dashboard, {
    size: 18
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      minWidth: 0
    }
  }, breadcrumb.map((c, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: c
  }, i > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-tertiary)',
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement(I.chevronRight, {
    size: 14
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      whiteSpace: 'nowrap',
      color: i === breadcrumb.length - 1 ? 'var(--text-primary)' : 'var(--text-tertiary)',
      fontWeight: i === breadcrumb.length - 1 ? 600 : 500
    }
  }, c)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      maxWidth: 460,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      width: '100%',
      height: 38,
      padding: '0 13px',
      background: 'var(--surface-input)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      color: 'var(--text-tertiary)'
    }
  }, /*#__PURE__*/React.createElement(I.search, {
    size: 16
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search anything\u2026",
    style: {
      flex: 1,
      minWidth: 0,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5
    }
  }), /*#__PURE__*/React.createElement("kbd", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-tertiary)',
      border: '1px solid var(--border-default)',
      borderRadius: 4,
      padding: '1px 6px'
    }
  }, "\u2318K"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement("button", {
    title: "Apps",
    style: iconBtn
  }, /*#__PURE__*/React.createElement(I.grid, {
    size: 18
  })), /*#__PURE__*/React.createElement("button", {
    title: "Help",
    style: iconBtn
  }, /*#__PURE__*/React.createElement(I.help, {
    size: 18
  })), /*#__PURE__*/React.createElement("button", {
    title: "Notifications",
    style: {
      ...iconBtn,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(I.bell, {
    size: 18
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 7,
      right: 8,
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'var(--teal-400)',
      border: '2px solid var(--bg-sidebar)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 26,
      background: 'var(--border-default)',
      margin: '0 6px'
    }
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      height: 40,
      padding: '0 8px 0 6px',
      background: 'transparent',
      border: 'none',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: '50%',
      background: 'var(--grad-brand)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontWeight: 700,
      fontSize: 12.5
    }
  }, "SA"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      lineHeight: 1.25
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, "Super Admin"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--text-tertiary)'
    }
  }, "admin@medreco.com")), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-tertiary)'
    }
  }, /*#__PURE__*/React.createElement(I.chevronDown, {
    size: 15
  })))));
}
const iconBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 38,
  height: 38,
  borderRadius: 'var(--radius-md)',
  border: 'none',
  background: 'transparent',
  color: 'var(--text-tertiary)',
  cursor: 'pointer'
};
window.MedTopbar = Topbar;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/medreco-admin/Topbar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/medreco-admin/UsersScreen.jsx
try { (() => {
/* MedReco Admin — Users Management screen. window.MedUsersScreen */
function UsersScreen({
  onOpenImport
}) {
  const I = window.MedIcons;
  const {
    Button,
    IconButton,
    Input,
    Select,
    Checkbox,
    Badge,
    Avatar,
    StatCard
  } = window.DS;
  const {
    users,
    stats
  } = window.MedData;
  const [query, setQuery] = React.useState('');
  const [role, setRole] = React.useState('All');
  const [status, setStatus] = React.useState('All');
  const [branch, setBranch] = React.useState('All');
  const [selected, setSelected] = React.useState(() => new Set());
  const [sortKey, setSortKey] = React.useState('created');
  const [sortDir, setSortDir] = React.useState('desc');
  const [perPage, setPerPage] = React.useState(10);
  const filtered = React.useMemo(() => {
    let r = users.filter(u => {
      if (query) {
        const q = query.toLowerCase();
        if (![u.name, u.email, u.username, u.id].some(f => f.toLowerCase().includes(q))) return false;
      }
      if (role !== 'All' && u.role !== role) return false;
      if (status !== 'All' && u.status !== status.toLowerCase()) return false;
      if (branch !== 'All' && u.branch !== branch) return false;
      return true;
    });
    r = [...r].sort((a, b) => {
      const av = a[sortKey],
        bv = b[sortKey];
      return (av < bv ? -1 : av > bv ? 1 : 0) * (sortDir === 'asc' ? 1 : -1);
    });
    return r;
  }, [users, query, role, status, branch, sortKey, sortDir]);
  const page = filtered.slice(0, perPage);
  const allOnPage = page.length > 0 && page.every(u => selected.has(u.id));
  const someOnPage = page.some(u => selected.has(u.id)) && !allOnPage;
  const toggleAll = () => {
    const next = new Set(selected);
    if (allOnPage) page.forEach(u => next.delete(u.id));else page.forEach(u => next.add(u.id));
    setSelected(next);
  };
  const toggleOne = id => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };
  const setSort = key => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');else {
      setSortKey(key);
      setSortDir('asc');
    }
  };
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--content-pad)',
      maxWidth: 'var(--content-max)',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      font: 'var(--text-h1)',
      letterSpacing: '-0.01em',
      color: 'var(--text-primary)'
    }
  }, "Users Management"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      fontSize: 13.5,
      color: 'var(--text-tertiary)'
    }
  }, "Manage system users, roles, and access across all clinics & branches.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    iconLeft: /*#__PURE__*/React.createElement(I.upload, {
      size: 16
    }),
    onClick: onOpenImport
  }, "Import CSV"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    iconLeft: /*#__PURE__*/React.createElement(I.download, {
      size: 16
    })
  }, "Export CSV"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    iconLeft: /*#__PURE__*/React.createElement(I.plus, {
      size: 16
    }),
    iconRight: /*#__PURE__*/React.createElement(I.chevronDown, {
      size: 15
    })
  }, "Add User"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Total Users",
    value: "1,248",
    accent: "teal",
    icon: /*#__PURE__*/React.createElement(I.users, {
      size: 18
    }),
    delta: "+4.2%",
    sublabel: "this month"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Active Users",
    value: "1,102",
    accent: "success",
    icon: /*#__PURE__*/React.createElement(I.userCheck, {
      size: 18
    }),
    delta: "+2.1%"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Inactive Users",
    value: "146",
    accent: "danger",
    icon: /*#__PURE__*/React.createElement(I.userX, {
      size: 18
    }),
    delta: "-0.8%",
    deltaDirection: "down"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Total Roles",
    value: "5",
    accent: "blue",
    icon: /*#__PURE__*/React.createElement(I.shieldCheck, {
      size: 18
    }),
    sublabel: "Owner \u2192 Staff"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 360px',
      minWidth: 280
    }
  }, /*#__PURE__*/React.createElement(Input, {
    full: true,
    size: "lg",
    iconLeft: /*#__PURE__*/React.createElement(I.search, {
      size: 18
    }),
    value: query,
    onChange: e => setQuery(e.target.value),
    placeholder: "Search by name, email, phone, username..."
  })), /*#__PURE__*/React.createElement(Select, {
    label: "Role",
    value: role,
    onChange: setRole,
    options: ['All', ...window.MedData.ROLES]
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Status",
    value: status,
    onChange: setStatus,
    options: ['All', 'Active', 'Inactive']
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Clinic",
    value: "All",
    onChange: () => {},
    options: ['All', 'MedReco Clinic']
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Branch",
    value: branch,
    onChange: setBranch,
    options: ['All', ...window.MedData.BRANCHES]
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    iconLeft: /*#__PURE__*/React.createElement(I.filter, {
      size: 15
    })
  }, "Filters"), /*#__PURE__*/React.createElement(IconButton, {
    title: "Refresh",
    variant: "secondary"
  }, /*#__PURE__*/React.createElement(I.refresh, {
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-xs)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 16px',
      borderBottom: '1px solid var(--border-subtle)',
      minHeight: 58
    }
  }, selected.size > 0 ? /*#__PURE__*/React.createElement(BulkToolbar, {
    count: selected.size,
    onClear: () => setSelected(new Set()),
    I: I,
    Button: Button,
    Badge: Badge
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--text-primary)',
      fontWeight: 600
    }
  }, filtered.length), " users", (role !== 'All' || status !== 'All' || branch !== 'All' || query) && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-tertiary)'
    }
  }, " \xB7 filtered")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-tertiary)'
    }
  }, "Rows"), /*#__PURE__*/React.createElement(Select, {
    value: String(perPage),
    onChange: v => setPerPage(Number(v)),
    size: "sm",
    options: ['10', '20', '50']
  })), /*#__PURE__*/React.createElement(IconButton, {
    title: "Sort"
  }, /*#__PURE__*/React.createElement(I.sort, {
    size: 16
  })), /*#__PURE__*/React.createElement(IconButton, {
    title: "Columns"
  }, /*#__PURE__*/React.createElement(I.columns, {
    size: 16
  })), /*#__PURE__*/React.createElement(IconButton, {
    title: "Settings"
  }, /*#__PURE__*/React.createElement(I.settings, {
    size: 16
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: 1080
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      position: 'sticky',
      top: 0
    }
  }, /*#__PURE__*/React.createElement(Th, {
    style: {
      width: 44,
      paddingLeft: 16
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: allOnPage,
    indeterminate: someOnPage,
    onChange: toggleAll
  })), /*#__PURE__*/React.createElement(Th, {
    sortable: true,
    sorted: sortKey === 'name',
    dir: sortDir,
    onClick: () => setSort('name'),
    I: I
  }, "Name"), /*#__PURE__*/React.createElement(Th, null, "Username"), /*#__PURE__*/React.createElement(Th, null, "Role"), /*#__PURE__*/React.createElement(Th, null, "Clinic / Branch"), /*#__PURE__*/React.createElement(Th, null, "Email"), /*#__PURE__*/React.createElement(Th, {
    sortable: true,
    sorted: sortKey === 'status',
    dir: sortDir,
    onClick: () => setSort('status'),
    I: I
  }, "Status"), /*#__PURE__*/React.createElement(Th, {
    sortable: true,
    sorted: sortKey === 'created',
    dir: sortDir,
    onClick: () => setSort('created'),
    I: I
  }, "Created"), /*#__PURE__*/React.createElement(Th, null, "Last Login"), /*#__PURE__*/React.createElement(Th, {
    style: {
      textAlign: 'right',
      paddingRight: 16
    }
  }, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, page.map(u => /*#__PURE__*/React.createElement(Row, {
    key: u.id,
    u: u,
    selected: selected.has(u.id),
    onToggle: () => toggleOne(u.id),
    I: I,
    Badge: Badge,
    Avatar: Avatar,
    IconButton: IconButton,
    cap: cap
  })))), page.length === 0 && /*#__PURE__*/React.createElement(EmptyState, {
    I: I
  })), /*#__PURE__*/React.createElement(Pagination, {
    total: filtered.length,
    perPage: perPage,
    I: I
  })));
}
function Th({
  children,
  sortable,
  sorted,
  dir,
  onClick,
  I,
  style
}) {
  const {
    Checkbox
  } = window.DS;
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("th", {
    onClick: sortable ? onClick : undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      textAlign: 'left',
      padding: '12px 14px',
      background: 'var(--surface-sunken)',
      borderBottom: '1px solid var(--border-default)',
      position: 'sticky',
      top: 0,
      zIndex: 1,
      font: 'var(--fw-semibold) 11.5px var(--font-sans)',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      color: sorted ? 'var(--text-secondary)' : 'var(--text-tertiary)',
      whiteSpace: 'nowrap',
      cursor: sortable ? 'pointer' : 'default',
      userSelect: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5
    }
  }, children, sortable && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      opacity: sorted ? 1 : hover ? 0.5 : 0.25,
      color: sorted ? 'var(--teal-400)' : 'inherit',
      transform: sorted && dir === 'desc' ? 'rotate(180deg)' : 'none',
      transition: 'opacity var(--dur)'
    }
  }, /*#__PURE__*/React.createElement(I.chevronDown, {
    size: 13
  }))));
}
function Row({
  u,
  selected,
  onToggle,
  I,
  Badge,
  Avatar,
  IconButton,
  cap
}) {
  const {
    Checkbox
  } = window.DS;
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("tr", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: selected ? 'var(--tint-teal)' : hover ? 'var(--surface-hover)' : 'transparent',
      transition: 'background var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      paddingLeft: 16
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: selected,
    onChange: onToggle
  })), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: u.name,
    status: u.status,
    size: 36
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      fontWeight: 600,
      color: 'var(--text-primary)',
      whiteSpace: 'nowrap'
    }
  }, u.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11.5,
      color: 'var(--text-tertiary)'
    }
  }, u.id)))), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      fontFamily: 'var(--font-mono)',
      fontSize: 12.5,
      color: 'var(--text-secondary)'
    }
  }, u.username), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement(Badge, {
    role: u.role,
    size: "sm"
  })), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)',
      whiteSpace: 'nowrap'
    }
  }, u.clinic), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--text-tertiary)'
    }
  }, u.branch)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      fontSize: 13,
      color: 'var(--text-secondary)',
      whiteSpace: 'nowrap'
    }
  }, u.email), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: u.status === 'active' ? 'success' : 'danger',
    dot: true,
    size: "sm"
  }, cap(u.status))), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)',
      fontVariantNumeric: 'tabular-nums',
      whiteSpace: 'nowrap'
    }
  }, u.created), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11.5,
      color: 'var(--text-tertiary)'
    }
  }, u.createdTime)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      fontSize: 12.5,
      color: u.lastLogin === '—' ? 'var(--text-disabled)' : 'var(--text-secondary)',
      fontVariantNumeric: 'tabular-nums',
      whiteSpace: 'nowrap'
    }
  }, u.lastLogin), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      paddingRight: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      justifyContent: 'flex-end',
      opacity: hover ? 1 : 0.55,
      transition: 'opacity var(--dur)'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    title: "Edit",
    size: "sm"
  }, /*#__PURE__*/React.createElement(I.edit, {
    size: 15
  })), /*#__PURE__*/React.createElement(IconButton, {
    title: "View",
    size: "sm"
  }, /*#__PURE__*/React.createElement(I.eye, {
    size: 15
  })), /*#__PURE__*/React.createElement(IconButton, {
    title: u.status === 'active' ? 'Deactivate' : 'Activate',
    size: "sm"
  }, /*#__PURE__*/React.createElement(I.power, {
    size: 15
  })), /*#__PURE__*/React.createElement(IconButton, {
    title: "More",
    size: "sm"
  }, /*#__PURE__*/React.createElement(I.more, {
    size: 15
  })))));
}
const td = {
  padding: '11px 14px',
  borderBottom: '1px solid var(--border-subtle)',
  verticalAlign: 'middle'
};
function BulkToolbar({
  count,
  onClear,
  I,
  Button,
  Badge
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      animation: 'med-bulk-in 0.18s var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 13.5,
      color: 'var(--text-primary)',
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 24,
      height: 22,
      padding: '0 7px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--accent-primary)',
      color: '#06241F',
      fontSize: 12,
      fontWeight: 700
    }
  }, count), "selected"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 22,
      background: 'var(--border-default)'
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "danger",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(I.trash, {
      size: 15
    })
  }, "Bulk Delete"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(I.userCheck, {
      size: 15
    })
  }, "Activate"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(I.userX, {
      size: 15
    })
  }, "Deactivate"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(I.download, {
      size: 15
    })
  }, "Export Selected"), /*#__PURE__*/React.createElement("button", {
    onClick: onClear,
    style: {
      background: 'none',
      border: 'none',
      color: 'var(--text-tertiary)',
      cursor: 'pointer',
      fontSize: 13,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(I.x, {
    size: 14
  }), "Clear"), /*#__PURE__*/React.createElement("style", null, `@keyframes med-bulk-in { from { opacity:0; transform: translateY(-4px);} to {opacity:1; transform:none;} }`));
}
function EmptyState({
  I
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
      padding: '56px 20px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: 'var(--radius-lg)',
      background: 'var(--surface-raised)',
      border: '1px solid var(--border-default)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-tertiary)'
    }
  }, /*#__PURE__*/React.createElement(I.search, {
    size: 24
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, "No users found"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-tertiary)',
      maxWidth: 320
    }
  }, "Try adjusting your search or filters to find what you\u2019re looking for."));
}
function Pagination({
  total,
  perPage,
  I
}) {
  const pages = Math.ceil(1248 / perPage);
  const shown = Math.min(perPage, total);
  const Btn = ({
    children,
    active,
    disabled,
    title
  }) => /*#__PURE__*/React.createElement("button", {
    title: title,
    disabled: disabled,
    style: {
      minWidth: 34,
      height: 34,
      padding: '0 10px',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid',
      borderColor: active ? 'transparent' : 'var(--border-default)',
      background: active ? 'var(--accent-primary)' : 'transparent',
      color: active ? '#06241F' : disabled ? 'var(--text-disabled)' : 'var(--text-secondary)',
      fontWeight: active ? 700 : 500,
      fontSize: 13,
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'var(--font-sans)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, children);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      padding: '14px 16px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-tertiary)'
    }
  }, "Showing ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--text-secondary)'
    }
  }, "1\u2013", shown), " of ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--text-secondary)'
    }
  }, "1,248"), " users"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    disabled: true,
    title: "First"
  }, "\xAB"), /*#__PURE__*/React.createElement(Btn, {
    disabled: true,
    title: "Prev"
  }, "\u2039"), /*#__PURE__*/React.createElement(Btn, {
    active: true
  }, "1"), /*#__PURE__*/React.createElement(Btn, null, "2"), /*#__PURE__*/React.createElement(Btn, null, "3"), /*#__PURE__*/React.createElement(Btn, null, "4"), /*#__PURE__*/React.createElement(Btn, null, "5"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-tertiary)',
      padding: '0 4px'
    }
  }, "\u2026"), /*#__PURE__*/React.createElement(Btn, null, pages), /*#__PURE__*/React.createElement(Btn, {
    title: "Next"
  }, "\u203A"), /*#__PURE__*/React.createElement(Btn, {
    title: "Last"
  }, "\xBB")));
}
window.MedUsersScreen = UsersScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/medreco-admin/UsersScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/medreco-admin/data.js
try { (() => {
/* MedReco Admin — mock data (assigned to window.MedData). */
window.MedData = function () {
  const ROLES = ['Business Owner', 'Business Director', 'Doctor', 'Manager', 'Staff'];
  const BRANCHES = ['HQ Office', 'Phra Ram 9', 'Chiang Mai', 'Sukhumvit', 'Phuket', 'Khon Kaen', 'Rama 4'];
  const NAMES = ['Thanawat Srisombat', 'Oranee Wattana', 'Pichit Chaikij', 'Supanut Janthasiri', 'Somchai Jaidee', 'Naphat Boonmee', 'Kanya Phongam', 'Wichai Tongdee', 'Pranee Suksawat', 'Anan Rattana', 'Malee Chinnawong', 'Decha Pakdee', 'Sasithorn Meechai', 'Krit Wongsawang', 'Benjawan Sukhum', 'Narin Aphai', 'Ploy Charoen', 'Anucha Ruangrit', 'Wanida Klaharn', 'Teerapat Noppakun'];
  function username(name) {
    const p = name.toLowerCase().split(' ');
    return p[0] + '.' + (p[1] ? p[1][0] : 'x');
  }
  const ROLE_FOR = ['Doctor', 'Manager', 'Business Owner', 'Staff', 'Business Director', 'Doctor', 'Staff', 'Manager', 'Doctor', 'Staff', 'Business Director', 'Doctor', 'Manager', 'Staff', 'Doctor', 'Business Owner', 'Staff', 'Manager', 'Doctor', 'Staff'];
  const STATUS_FOR = ['active', 'active', 'active', 'inactive', 'active', 'active', 'active', 'inactive', 'active', 'active', 'active', 'inactive', 'active', 'active', 'active', 'active', 'inactive', 'active', 'active', 'active'];
  const users = NAMES.map((name, i) => {
    const role = ROLE_FOR[i];
    const branch = BRANCHES[i % BRANCHES.length];
    const day = String(i * 3 % 28 + 1).padStart(2, '0');
    const hr = String(i * 7 % 12 + 8).padStart(2, '0');
    const mn = String(i * 13 % 60).padStart(2, '0');
    return {
      id: 'USR-' + String(40821 + i * 137),
      name,
      username: username(name),
      email: username(name) + '@medreco.com',
      role,
      clinic: 'MedReco Clinic',
      branch,
      status: STATUS_FOR[i],
      created: `${day}/05/2025`,
      createdTime: `${hr}:${mn}`,
      lastLogin: STATUS_FOR[i] === 'active' ? `${day}/06/2025 ${hr}:${mn}` : '—'
    };
  });
  const stats = {
    total: 1248,
    active: 1102,
    inactive: 146,
    roles: 5,
    lastImport: '12/05/2025 14:35'
  };
  const nav = [{
    section: 'Master Data',
    items: [{
      id: 'clinics',
      label: 'Clinics',
      icon: 'clinic'
    }, {
      id: 'branches',
      label: 'Clinic Branches',
      icon: 'branch'
    }, {
      id: 'users',
      label: 'Users',
      icon: 'users'
    }, {
      id: 'patients',
      label: 'Patients',
      icon: 'patient'
    }]
  }, {
    section: 'Activity Logs',
    items: [{
      id: 'user-logs',
      label: 'User Logs',
      icon: 'userLog'
    }, {
      id: 'patient-logs',
      label: 'Patient Logs',
      icon: 'patientLog'
    }]
  }, {
    section: 'Import / Export',
    items: [{
      id: 'import',
      label: 'Import Center',
      icon: 'importIn'
    }, {
      id: 'export',
      label: 'Export Center',
      icon: 'exportOut'
    }]
  }, {
    section: 'System',
    items: [{
      id: 'roles',
      label: 'Roles & Permissions',
      icon: 'roles'
    }, {
      id: 'settings',
      label: 'Settings',
      icon: 'settings'
    }, {
      id: 'audit',
      label: 'Audit Logs',
      icon: 'audit'
    }, {
      id: 'maintenance',
      label: 'Maintenance',
      icon: 'maintenance'
    }]
  }];
  return {
    users,
    stats,
    nav,
    ROLES,
    BRANCHES
  };
}();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/medreco-admin/data.js", error: String((e && e.message) || e) }); }

// ui_kits/medreco-admin/icons.jsx
try { (() => {
/* MedReco Admin — shared icon set (Lucide-style line icons, 24px grid).
   Stroke icons inherit currentColor. Assigned to window for cross-file use. */
const Icon = ({
  d,
  size = 18,
  fill = 'none',
  stroke = 'currentColor',
  sw = 1.8,
  children,
  style
}) => /*#__PURE__*/React.createElement("svg", {
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: fill,
  stroke: stroke,
  strokeWidth: sw,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  style: style
}, d ? /*#__PURE__*/React.createElement("path", {
  d: d
}) : children);
const Icons = {
  dashboard: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "7",
    height: "9",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "3",
    width: "7",
    height: "5",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "12",
    width: "7",
    height: "9",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "16",
    width: "7",
    height: "5",
    rx: "1.5"
  })),
  clinic: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M3 21h18M5 21V7l7-4 7 4v14M9 9h6M9 13h6M9 17h6"
  })),
  branch: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M3 21h18M6 21V8h6V21M12 21V4h6v17M9 11h0M9 14h0M9 17h0M15 8h0M15 11h0M15 14h0"
  })),
  users: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
  })),
  user: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
  })),
  patient: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M12 11a4 4 0 100-8 4 4 0 000 8zM20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 6v3M10.5 7.5h3"
  })),
  activity: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M22 12h-4l-3 9L9 3l-3 9H2"
  })),
  userLog: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M9 11a4 4 0 100-8 4 4 0 000 8zM3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2M16 11l2 2 4-4"
  })),
  patientLog: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M12 11v6M9 14h6"
  })),
  importExport: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M12 3v12M8 11l4 4 4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"
  })),
  importIn: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"
  })),
  exportOut: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
  })),
  roles: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4"
  })),
  settings: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M12 15a3 3 0 100-6 3 3 0 000 6z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
  })),
  audit: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M9 13l2 2 4-4"
  })),
  maintenance: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M14.7 6.3a4 4 0 00-5.4 5.3L3 18l3 3 6.4-6.3a4 4 0 005.3-5.4l-2.9 2.9-2.1-2.1z"
  })),
  search: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3"
  })),
  bell: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0"
  })),
  help: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3M12 17h0"
  })),
  grid: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("circle", {
    cx: "5",
    cy: "5",
    r: "1.3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "5",
    r: "1.3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "19",
    cy: "5",
    r: "1.3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "5",
    cy: "12",
    r: "1.3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "1.3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "19",
    cy: "12",
    r: "1.3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "5",
    cy: "19",
    r: "1.3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "19",
    r: "1.3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "19",
    cy: "19",
    r: "1.3"
  })),
  chevronDown: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6 6-6"
  })),
  chevronRight: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  })),
  chevronsLeft: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M11 17l-5-5 5-5M18 17l-5-5 5-5"
  })),
  plus: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M12 5v14M5 12h14"
  })),
  upload: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
  })),
  download: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"
  })),
  trash: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6"
  })),
  edit: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4z"
  })),
  eye: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  })),
  more: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "5",
    r: "1.4"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "1.4"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "19",
    r: "1.4"
  })),
  filter: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M22 3H2l8 9.46V19l4 2v-8.54z"
  })),
  refresh: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M3 12a9 9 0 0115-6.7L21 8M21 3v5h-5M21 12a9 9 0 01-15 6.7L3 16M3 21v-5h5"
  })),
  columns: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "18",
    height: "18",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 3v18M15 3v18"
  })),
  sort: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 18V4"
  })),
  check: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M20 6L9 17l-5-5"
  })),
  x: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M18 6L6 18M6 6l12 12"
  })),
  power: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M12 2v10M18.4 6.6a9 9 0 11-12.8 0"
  })),
  fileCsv: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M8 13h1M8 17h1M15 13h1M15 17h1M11.5 13v4"
  })),
  alert: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L14.7 3.9a2 2 0 00-3.4 0zM12 9v4M12 17h0"
  })),
  clock: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 7v5l3 2"
  })),
  shieldCheck: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4"
  })),
  userCheck: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM16 11l2 2 4-4"
  })),
  userX: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM17 8l5 5M22 8l-5 5"
  })),
  logout: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
    d: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
  })),
  mail: p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "4",
    width: "20",
    height: "16",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M22 7l-10 6L2 7"
  }))
};
window.MedIcons = Icons;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/medreco-admin/icons.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

})();

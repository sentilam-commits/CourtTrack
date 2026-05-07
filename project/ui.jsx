// Shared UI atoms for CourtTrack

const CT = {
  green: 'oklch(0.62 0.14 152)',
  greenSoft: 'oklch(0.95 0.04 152)',
  greenDeep: 'oklch(0.42 0.12 152)',
  ink: '#0E1311',
  ink2: '#3A4441',
  ink3: '#6B746F',
  ink4: '#9AA29D',
  line: '#E8EAE7',
  card: '#F4F5F2',
  card2: '#FAFAF8',
  bg: '#FFFFFF',
  danger: 'oklch(0.62 0.16 28)',
};

// Generic icon (stroke)
function Icon({ d, size = 22, stroke = 'currentColor', fill = 'none', sw = 1.8, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
         strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {d ? <path d={d} /> : children}
    </svg>
  );
}

const Icons = {
  plus: <Icon><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Icon>,
  back: <Icon><polyline points="15 18 9 12 15 6"/></Icon>,
  chevR: <Icon size={18}><polyline points="9 6 15 12 9 18"/></Icon>,
  chevD: <Icon size={18}><polyline points="6 9 12 15 18 9"/></Icon>,
  check: <Icon><polyline points="20 6 9 17 4 12"/></Icon>,
  share: <Icon><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></Icon>,
  link: <Icon><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></Icon>,
  copy: <Icon><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></Icon>,
  edit: <Icon><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></Icon>,
  user: <Icon><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Icon>,
  search: <Icon><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Icon>,
  flag: <Icon><path d="M4 22V4a1 1 0 0 1 1-1h13l-2 5 2 5H5"/></Icon>,
  arrow: <Icon><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></Icon>,
  sparkle: <Icon><path d="M12 2l1.8 5.5L19 9l-5.2 1.5L12 16l-1.8-5.5L5 9l5.2-1.5z"/><path d="M19 16l.7 2 2 .7-2 .7L19 22l-.7-2-2-.7 2-.7z"/></Icon>,
  ball: <Icon><circle cx="12" cy="12" r="9"/><path d="M3.5 9c4 1 9-1 13.5-3"/><path d="M20.5 15c-4-1-9 1-13.5 3"/></Icon>,
  calendar: <Icon><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Icon>,
};

// Pill / chip
function Chip({ children, active, onClick, color = CT.green, style = {} }) {
  return (
    <button onClick={onClick} style={{
      padding: '9px 14px', borderRadius: 999,
      border: `1px solid ${active ? color : CT.line}`,
      background: active ? color : '#fff',
      color: active ? '#fff' : CT.ink,
      fontSize: 14, fontWeight: 500, cursor: 'pointer',
      whiteSpace: 'nowrap', transition: 'all 0.15s', fontFamily: 'inherit',
      ...style,
    }}>{children}</button>
  );
}

// Level badge
function LevelBadge({ level, small }) {
  const map = {
    Beginner:    { bg: '#FEF3E7', fg: '#B86A1A' },
    Intermediate:{ bg: CT.greenSoft, fg: CT.greenDeep },
    Advanced:    { bg: '#E9EDFB', fg: '#3850B8' },
  };
  const c = map[level] || map.Intermediate;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: small ? '3px 8px' : '4px 10px', borderRadius: 999,
      background: c.bg, color: c.fg,
      fontSize: small ? 11 : 12, fontWeight: 600, letterSpacing: 0.1,
    }}>{level}</span>
  );
}

// Big primary CTA
function PrimaryButton({ children, onClick, disabled, style = {}, icon }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', height: 54, borderRadius: 16, border: 'none',
      background: disabled ? '#C7CCC9' : CT.ink,
      color: '#fff', fontSize: 16, fontWeight: 600, fontFamily: 'inherit',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'transform 0.08s, background 0.15s',
      ...style,
    }}
    onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = 'scale(0.98)')}
    onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {icon}{children}
    </button>
  );
}

function GhostButton({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      height: 44, padding: '0 16px', borderRadius: 12,
      border: `1px solid ${CT.line}`, background: '#fff',
      color: CT.ink, fontSize: 14, fontWeight: 500, fontFamily: 'inherit',
      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
      ...style,
    }}>{children}</button>
  );
}

// Section title
function SectionLabel({ children, action, style = {} }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontSize: 12, fontWeight: 600, color: CT.ink3, textTransform: 'uppercase',
      letterSpacing: 0.6, marginBottom: 10, ...style,
    }}>
      <span>{children}</span>
      {action}
    </div>
  );
}

// Card
function Card({ children, style = {}, onClick, soft }) {
  return (
    <div onClick={onClick} style={{
      background: soft ? CT.card2 : CT.card,
      border: `1px solid ${CT.line}`,
      borderRadius: 18, padding: 16,
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>{children}</div>
  );
}

// Field label
function Label({ children, style = {} }) {
  return <div style={{ fontSize: 13, fontWeight: 600, color: CT.ink2, marginBottom: 8, ...style }}>{children}</div>;
}

function TextInput({ value, onChange, placeholder, type = 'text', style = {} }) {
  return (
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      style={{
        width: '100%', height: 50, padding: '0 16px', borderRadius: 14,
        border: `1px solid ${CT.line}`, background: '#fff', fontSize: 16,
        fontFamily: 'inherit', color: CT.ink, outline: 'none', boxSizing: 'border-box',
        ...style,
      }}
      onFocus={(e) => e.target.style.borderColor = CT.green}
      onBlur={(e) => e.target.style.borderColor = CT.line}
    />
  );
}

// Score bar (1–5 dots)
function ScoreBar({ value, max = 5, color = CT.green, size = 8, gap = 5 }) {
  return (
    <div style={{ display: 'flex', gap }}>
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} style={{
          width: size, height: size, borderRadius: 999,
          background: i < value ? color : '#E1E4E0',
        }} />
      ))}
    </div>
  );
}

// Header bar (in-screen, below status bar)
function ScreenHeader({ title, onBack, right }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '6px 6px 14px', minHeight: 44,
    }}>
      <div style={{ width: 56, display: 'flex' }}>
        {onBack ? (
          <button onClick={onBack} style={{
            width: 40, height: 40, borderRadius: 12, border: 'none',
            background: 'transparent', cursor: 'pointer', color: CT.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{Icons.back}</button>
        ) : null}
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, color: CT.ink, flex: 1, textAlign: 'center' }}>{title}</div>
      <div style={{ width: 56, display: 'flex', justifyContent: 'flex-end' }}>{right}</div>
    </div>
  );
}

Object.assign(window, {
  CT, Icon, Icons, Chip, LevelBadge, PrimaryButton, GhostButton,
  SectionLabel, Card, Label, TextInput, ScoreBar, ScreenHeader,
});

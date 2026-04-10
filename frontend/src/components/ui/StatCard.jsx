export default function StatCard({ label, value, sub, color = 'accent', icon }) {
  const colorMap = {
    accent: { bg: 'var(--accent-glow)', color: 'var(--accent)' },
    green:  { bg: 'var(--green-soft)',  color: 'var(--green)' },
    red:    { bg: 'var(--red-soft)',    color: 'var(--red)' },
    amber:  { bg: 'var(--amber-soft)',  color: 'var(--amber)' },
    purple: { bg: 'var(--purple-soft)', color: 'var(--purple)' },
  }
  const { bg, color: iconColor } = colorMap[color] || colorMap.accent

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', letterSpacing: '0.01em' }}>
          {label}
        </span>
        {icon && (
          <div style={{
            width: 36, height: 36,
            borderRadius: 10,
            background: bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: iconColor,
          }}>
            {icon}
          </div>
        )}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', fontFamily: 'var(--font-mono)', color: iconColor }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub}</div>
      )}
    </div>
  )
}

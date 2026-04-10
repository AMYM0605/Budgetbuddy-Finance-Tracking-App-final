export default function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 28,
      flexWrap: 'wrap',
      gap: 12,
    }}>
      <div>
        <h1 style={{
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)',
          lineHeight: 1.2,
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

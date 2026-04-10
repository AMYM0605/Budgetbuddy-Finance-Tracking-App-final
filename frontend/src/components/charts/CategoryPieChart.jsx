import {
  ResponsiveContainer, PieChart, Pie,
  Cell, Tooltip, Legend,
} from 'recharts'

const COLORS = [
  '#5b8ef0', '#3ecf8e', '#f06060', '#f0b04e',
  '#9d7ef0', '#4ec9f0', '#f07a5b', '#7ef07a',
  '#f04eb0', '#a0a0f0',
]

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-light)',
      borderRadius: 10,
      padding: '10px 14px',
      fontSize: 13,
    }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{name.replace(/_/g, ' ')}</div>
      <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
        {Number(value).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
      </div>
    </div>
  )
}

function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.05) return null
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function CategoryPieChart({ data = {}, title = 'By Category' }) {
  const chartData = Object.entries(data)
    .map(([name, value]) => ({ name, value: Number(value) || 0 }))
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value)

  if (!chartData.length) {
    return (
      <div className="card">
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em' }}>{title}</h3>
        </div>
        <div className="empty-state" style={{ padding: '30px 0' }}>
          <p>No data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em' }}>{title}</h3>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
          Distribution across categories
        </p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            dataKey="value"
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="var(--bg-surface)" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={v => v.replace(/_/g, ' ')}
            wrapperStyle={{ fontSize: 11, color: 'var(--text-secondary)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

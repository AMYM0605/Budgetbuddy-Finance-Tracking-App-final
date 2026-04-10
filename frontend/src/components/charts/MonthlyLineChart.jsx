import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-light)',
      borderRadius: 10,
      padding: '10px 14px',
      fontSize: 13,
    }}>
      <div style={{ marginBottom: 6, fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color, display: 'flex', gap: 8, justifyContent: 'space-between' }}>
          <span style={{ textTransform: 'capitalize' }}>{p.name}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
            {Number(p.value).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function MonthlyLineChart({ data = [] }) {
  const chartData = data.map(d => ({
    ...d,
    income:  Number(d.income)  || 0,
    expense: Number(d.expense) || 0,
    balance: Number(d.balance) || 0,
  }))

  return (
    <div className="card" style={{ gridColumn: '1 / -1' }}>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em' }}>
          Income vs Expenses
        </h3>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
          Last 12 months overview
        </p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 12, color: 'var(--text-secondary)' }}
          />
          <Line
            type="monotone"
            dataKey="income"
            name="Income"
            stroke="#3ecf8e"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#3ecf8e' }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="expense"
            name="Expenses"
            stroke="#f06060"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#f06060' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

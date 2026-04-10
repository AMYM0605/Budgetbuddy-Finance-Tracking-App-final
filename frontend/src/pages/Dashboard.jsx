import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { dashboardAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import Spinner from '../components/ui/Spinner'
import MonthlyLineChart from '../components/charts/MonthlyLineChart'
import CategoryPieChart from '../components/charts/CategoryPieChart'
import { formatCurrency, formatDate, getCategoryLabel } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardAPI.get()
      .then(res => setData(res.data.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  const currency = user?.currency || 'USD'
  const fmt = v => formatCurrency(v, currency)

  if (loading) return (
    <div style={{ padding: 32 }}>
      <Spinner />
    </div>
  )

  return (
    <div style={{ padding: '32px 32px 48px' }}>
      <PageHeader
        title={`Good day, ${user?.fullName?.split(' ')[0]} 👋`}
        subtitle="Here's your financial snapshot"
        action={
          <Link to="/transactions/new" className="btn btn-primary btn-sm">
            + Add Transaction
          </Link>
        }
      />

      {/* KPI Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 24,
      }}>
        <StatCard
          label="Total Balance"
          value={fmt(data?.balance)}
          sub="All-time net"
          color={Number(data?.balance) >= 0 ? 'accent' : 'red'}
          icon={<WalletIcon />}
        />
        <StatCard
          label="Total Income"
          value={fmt(data?.totalIncome)}
          sub="All-time earnings"
          color="green"
          icon={<ArrowDownIcon />}
        />
        <StatCard
          label="Total Expenses"
          value={fmt(data?.totalExpense)}
          sub="All-time spending"
          color="red"
          icon={<ArrowUpIcon />}
        />
        <StatCard
          label="Savings Rate"
          value={`${data?.savingsRate ?? 0}%`}
          sub="Of total income saved"
          color="purple"
          icon={<TrendIcon />}
        />
      </div>

      {/* Charts row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 16,
        marginBottom: 24,
      }}>
        <MonthlyLineChart data={data?.monthlySummaries || []} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 16,
        marginBottom: 28,
      }}>
        <CategoryPieChart data={data?.expenseByCategory || {}} title="Expenses by Category" />
        <CategoryPieChart data={data?.incomeByCategory  || {}} title="Income by Category" />
      </div>

      {/* Recent transactions */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Recent Transactions</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Last 5 transactions</p>
          </div>
          <Link to="/transactions" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>
            View all →
          </Link>
        </div>

        {!data?.recentTransactions?.length ? (
          <div className="empty-state">
            <p>No transactions yet</p>
            <Link to="/transactions/new" className="btn btn-ghost btn-sm">Add your first one</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {data.recentTransactions.map(tx => (
              <div key={tx.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '12px 0',
                borderBottom: '1px solid var(--border)',
              }}>
                <div style={{
                  width: 38, height: 38,
                  borderRadius: 10,
                  background: tx.type === 'INCOME' ? 'var(--green-soft)' : 'var(--red-soft)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 17, flexShrink: 0,
                }}>
                  {CATEGORY_EMOJI[tx.category] || '💳'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {tx.title}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>
                    {getCategoryLabel(tx.category)} · {formatDate(tx.transactionDate)}
                  </div>
                </div>
                <div className={tx.type === 'INCOME' ? 'amount-income' : 'amount-expense'} style={{ fontSize: 14 }}>
                  {tx.type === 'INCOME' ? '+' : '-'}{fmt(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const CATEGORY_EMOJI = {
  SALARY: '💼', FREELANCE: '💻', INVESTMENT: '📈', GIFT: '🎁', OTHER_INCOME: '💰',
  FOOD: '🍔', TRANSPORT: '🚗', SHOPPING: '🛍️', HOUSING: '🏠', HEALTHCARE: '🏥',
  ENTERTAINMENT: '🎮', EDUCATION: '📚', UTILITIES: '💡', TRAVEL: '✈️', OTHER_EXPENSE: '💸',
}

function WalletIcon()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M16 10h2"/></svg> }
function ArrowDownIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg> }
function ArrowUpIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg> }
function TrendIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> }

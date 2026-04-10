import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { transactionAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/ui/PageHeader'
import Spinner from '../components/ui/Spinner'
import { formatCurrency, formatDate, getCategoryLabel, CATEGORIES } from '../utils/helpers'
import toast from 'react-hot-toast'

const PAGE_SIZE = 10

export default function Transactions() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [transactions, setTransactions] = useState([])
  const [loading, setLoading]     = useState(true)
  const [page, setPage]           = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [deleting, setDeleting]   = useState(null)

  // Filters
  const [search, setSearch]     = useState('')
  const [typeFilter, setType]   = useState('')
  const [catFilter,  setCat]    = useState('')

  const currency = user?.currency || 'USD'

  const load = useCallback(async (p = 0) => {
    setLoading(true)
    try {
      const res = await transactionAPI.getPaged(p, PAGE_SIZE)
      const paged = res.data.data
      setTransactions(paged.content)
      setTotalPages(paged.totalPages)
      setTotalElements(paged.totalElements)
      setPage(p)
    } catch {
      toast.error('Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(0) }, [load])

  async function handleDelete(id) {
    if (!confirm('Delete this transaction?')) return
    setDeleting(id)
    try {
      await transactionAPI.delete(id)
      toast.success('Transaction deleted')
      load(page)
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  // Client-side filter on current page
  const visible = transactions.filter(tx => {
    if (typeFilter && tx.type !== typeFilter) return false
    if (catFilter  && tx.category !== catFilter) return false
    if (search) {
      const q = search.toLowerCase()
      if (!tx.title.toLowerCase().includes(q) &&
          !getCategoryLabel(tx.category).toLowerCase().includes(q)) return false
    }
    return true
  })

  const allCats = [...CATEGORIES.INCOME, ...CATEGORIES.EXPENSE]

  return (
    <div style={{ padding: '32px 32px 48px' }}>
      <PageHeader
        title="Transactions"
        subtitle={`${totalElements} total transaction${totalElements !== 1 ? 's' : ''}`}
        action={
          <Link to="/transactions/new" className="btn btn-primary btn-sm">
            + Add Transaction
          </Link>
        }
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          className="form-input"
          style={{ maxWidth: 260, flex: '1 1 180px' }}
          placeholder="Search transactions…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="form-select" style={{ maxWidth: 140, flex: '0 0 auto' }}
          value={typeFilter} onChange={e => setType(e.target.value)}>
          <option value="">All Types</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>
        <select className="form-select" style={{ maxWidth: 180, flex: '0 0 auto' }}
          value={catFilter} onChange={e => setCat(e.target.value)}>
          <option value="">All Categories</option>
          {allCats.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        {(search || typeFilter || catFilter) && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setType(''); setCat('') }}>
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? <Spinner /> : !visible.length ? (
          <div className="empty-state">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M8 7h8M8 12h5"/></svg>
            <p>No transactions found</p>
            <Link to="/transactions/new" className="btn btn-ghost btn-sm">Add one</Link>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Date', 'Title', 'Category', 'Type', 'Amount', 'Actions'].map(h => (
                      <th key={h} style={{
                        padding: '12px 20px',
                        textAlign: h === 'Amount' || h === 'Actions' ? 'right' : 'left',
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        whiteSpace: 'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((tx, i) => (
                    <tr key={tx.id} style={{
                      borderBottom: i < visible.length - 1 ? '1px solid var(--border)' : 'none',
                      transition: 'background var(--transition)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {formatDate(tx.transactionDate)}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{tx.title}</div>
                        {tx.description && (
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{tx.description}</div>
                        )}
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                        {getCategoryLabel(tx.category)}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span className={`badge badge-${tx.type.toLowerCase()}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <span className={tx.type === 'INCOME' ? 'amount-income' : 'amount-expense'}>
                          {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => navigate(`/transactions/${tx.id}/edit`)}
                          >Edit</button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(tx.id)}
                            disabled={deleting === tx.id}
                          >
                            {deleting === tx.id ? '…' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                borderTop: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  Page {page + 1} of {totalPages}
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-ghost btn-sm"
                    disabled={page === 0} onClick={() => load(page - 1)}>← Prev</button>
                  <button className="btn btn-ghost btn-sm"
                    disabled={page >= totalPages - 1} onClick={() => load(page + 1)}>Next →</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { transactionAPI } from '../services/api'
import PageHeader from '../components/ui/PageHeader'
import { CATEGORIES, formatDateForInput } from '../utils/helpers'
import toast from 'react-hot-toast'

const EMPTY = {
  title: '',
  amount: '',
  type: 'EXPENSE',
  category: 'FOOD',
  description: '',
  transactionDate: new Date().toISOString().split('T')[0],
}

export default function TransactionForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isEdit   = Boolean(id)

  const [form, setForm]       = useState(EMPTY)
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  // Load existing transaction for edit
  useEffect(() => {
    if (!isEdit) return
    transactionAPI.getAll({ all: true })
      .then(res => {
        const tx = res.data.data.find(t => String(t.id) === String(id))
        if (!tx) { toast.error('Transaction not found'); navigate('/transactions'); return }
        setForm({
          title:           tx.title,
          amount:          String(tx.amount),
          type:            tx.type,
          category:        tx.category,
          description:     tx.description || '',
          transactionDate: formatDateForInput(tx.transactionDate),
        })
      })
      .catch(() => { toast.error('Failed to load transaction'); navigate('/transactions') })
      .finally(() => setFetching(false))
  }, [id, isEdit, navigate])

  // When type changes, reset category to first valid option
  function handleTypeChange(e) {
    const type = e.target.value
    const defaultCat = CATEGORIES[type][0].value
    setForm(f => ({ ...f, type, category: defaultCat }))
  }

  function validate() {
    const errs = {}
    if (!form.title.trim())       errs.title  = 'Title is required'
    if (!form.amount)             errs.amount = 'Amount is required'
    else if (isNaN(Number(form.amount)) || Number(form.amount) <= 0)
                                  errs.amount = 'Must be a positive number'
    if (!form.transactionDate)    errs.transactionDate = 'Date is required'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)

    // const payload = {
    //   ...form,
    //   amount: parseFloat(form.amount),
    // }
    const payload = {
  title: form.title,
  amount: parseFloat(form.amount),
  type: form.type,
  category: form.category,
  transactionDate: form.transactionDate,
}

    try {
      if (isEdit) {
        await transactionAPI.update(id, payload)
        toast.success('Transaction updated')
      } else {
        await transactionAPI.create(payload)
        toast.success('Transaction added')
      }
      navigate('/transactions')
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }))
  const cats = CATEGORIES[form.type] || []

  if (fetching) {
    return (
      <div style={{ padding: 32, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
        <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Loading…</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '32px 32px 48px', maxWidth: 640 }}>
      <PageHeader
        title={isEdit ? 'Edit Transaction' : 'New Transaction'}
        subtitle={isEdit ? 'Update the transaction details' : 'Record an income or expense'}
      />

      <div className="card" style={{ padding: 32 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Type toggle */}
          <div className="form-group">
            <label className="form-label">Transaction Type</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['INCOME', 'EXPENSE'].map(t => (
                <button
                  type="button"
                  key={t}
                  onClick={() => handleTypeChange({ target: { value: t } })}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${form.type === t
                      ? (t === 'INCOME' ? 'var(--green)' : 'var(--red)')
                      : 'var(--border-light)'}`,
                    background: form.type === t
                      ? (t === 'INCOME' ? 'var(--green-soft)' : 'var(--red-soft)')
                      : 'var(--bg-elevated)',
                    color: form.type === t
                      ? (t === 'INCOME' ? 'var(--green)' : 'var(--red)')
                      : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: 13,
                    transition: 'all var(--transition)',
                    cursor: 'pointer',
                  }}
                >
                  {t === 'INCOME' ? '↓ Income' : '↑ Expense'}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input className="form-input" type="text"
              placeholder="e.g. Monthly Salary, Grocery Run"
              value={form.title} onChange={set('title')} />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          {/* Amount + Date row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Amount *</label>
              <input className="form-input" type="number" step="0.01" min="0.01"
                placeholder="0.00"
                value={form.amount} onChange={set('amount')} />
              {errors.amount && <span className="form-error">{errors.amount}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Date *</label>
              <input className="form-input" type="date"
                value={form.transactionDate} onChange={set('transactionDate')} />
              {errors.transactionDate && <span className="form-error">{errors.transactionDate}</span>}
            </div>
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select className="form-select" value={form.category} onChange={set('category')}>
              {cats.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description <span style={{ color: 'var(--text-muted)' }}>(optional)</span></label>
            <textarea className="form-textarea"
              rows={3}
              placeholder="Add a note about this transaction…"
              value={form.description} onChange={set('description')}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" className="btn btn-ghost"
              onClick={() => navigate('/transactions')} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2 }}>
              {loading
                ? (isEdit ? 'Saving…' : 'Adding…')
                : (isEdit ? 'Save Changes' : 'Add Transaction')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

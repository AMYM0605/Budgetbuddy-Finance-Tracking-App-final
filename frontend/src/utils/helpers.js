import { format, parseISO } from 'date-fns'

export function formatCurrency(value, currency = 'USD') {
  return Number(value || 0).toLocaleString('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr
    return format(date, 'MMM d, yyyy')
  } catch {
    return dateStr
  }
}

export function formatDateForInput(dateStr) {
  if (!dateStr) return ''
  return typeof dateStr === 'string' ? dateStr.split('T')[0] : dateStr
}

export const CATEGORIES = {
  INCOME: [
    { value: 'SALARY',       label: 'Salary' },
    { value: 'FREELANCE',    label: 'Freelance' },
    { value: 'INVESTMENT',   label: 'Investment' },
    { value: 'GIFT',         label: 'Gift' },
    { value: 'OTHER_INCOME', label: 'Other Income' },
  ],
  EXPENSE: [
    { value: 'FOOD',          label: 'Food & Dining' },
    { value: 'TRANSPORT',     label: 'Transport' },
    { value: 'SHOPPING',      label: 'Shopping' },
    { value: 'HOUSING',       label: 'Housing & Rent' },
    { value: 'HEALTHCARE',    label: 'Healthcare' },
    { value: 'ENTERTAINMENT', label: 'Entertainment' },
    { value: 'EDUCATION',     label: 'Education' },
    { value: 'UTILITIES',     label: 'Utilities' },
    { value: 'TRAVEL',        label: 'Travel' },
    { value: 'OTHER_EXPENSE', label: 'Other Expense' },
  ],
}

export function getCategoryLabel(value) {
  const all = [...CATEGORIES.INCOME, ...CATEGORIES.EXPENSE]
  return all.find(c => c.value === value)?.label || value.replace(/_/g, ' ')
}

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD']

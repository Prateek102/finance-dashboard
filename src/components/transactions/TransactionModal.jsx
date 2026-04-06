import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import { CATEGORIES } from '../../data/transactions'

const EMPTY = {
  date: new Date().toISOString().slice(0, 10),
  description: '',
  category: CATEGORIES[0],
  amount: '',
  type: 'expense',
}

export default function TransactionModal({ tx, onClose }) {
  const { addTransaction, updateTransaction } = useFinance()
  const [form, setForm] = useState(tx ? { ...tx, amount: String(tx.amount) } : EMPTY)
  const [errors, setErrors] = useState({})
  const firstRef = useRef()

  const isEdit = !!tx

  useEffect(() => {
    firstRef.current?.focus()
    // trap scroll
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }))
  }

  const validate = () => {
  const e = {}
  if (!form.description.trim()) e.description = 'Required'
  const amt = parseFloat(form.amount)
  if (!form.amount || isNaN(amt) || amt <= 0) e.amount = 'Enter a valid amount'
  if (!form.date) e.date = 'Required'
  return e
}

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    const payload = { ...form, amount: parseFloat(form.amount) }
    if (isEdit) updateTransaction(payload)
    else addTransaction(payload)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-[2px]" />

      {/* Modal */}
      <div className="relative w-full max-w-md card p-6 shadow-modal animate-[scaleIn_.15s_ease]">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              {isEdit ? 'Edit Transaction' : 'New Transaction'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isEdit ? 'Update the details below' : 'Add a new income or expense entry'}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Type toggle */}
        <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 p-1 mb-4 bg-slate-50 dark:bg-slate-800/50">
          {['expense', 'income'].map(t => (
            <button
              key={t}
              onClick={() => set('type', t)}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all capitalize ${
                form.type === t
                  ? t === 'income'
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'bg-white dark:bg-slate-700 text-rose-500 dark:text-rose-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {/* Description */}
          <div>
            <label className="label">Description</label>
            <input
              ref={firstRef}
              type="text"
              className={`input ${errors.description ? 'border-red-400 focus:ring-red-400' : ''}`}
              placeholder="e.g. Swiggy order, Monthly salary…"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
          </div>

          {/* Amount + Date row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">₹</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  className={`input pl-7 ${errors.amount ? 'border-red-400 focus:ring-red-400' : ''}`}
                  placeholder="0"
                  value={form.amount}
                  onChange={e => set('amount', e.target.value)}
                />
              </div>
              {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
            </div>
            <div>
              <label className="label">Date</label>
              <input
                type="date"
                className={`input ${errors.date ? 'border-red-400 focus:ring-red-400' : ''}`}
                value={form.date}
                onChange={e => set('date', e.target.value)}
              />
              {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="label">Category</label>
            <select
              className="input"
              value={form.category}
              onChange={e => set('category', e.target.value)}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary">
            {isEdit ? 'Save changes' : 'Add transaction'}
          </button>
        </div>
      </div>
    </div>
  )
}

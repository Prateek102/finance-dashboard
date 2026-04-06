import { useState } from 'react'
import { Plus, Search, Filter, Download, Pencil, Trash2, ChevronDown } from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import { useFilteredTransactions } from '../../hooks/useStats'
import { formatCurrency, formatDate, exportCSV, exportJSON } from '../../utils'
import { CATEGORIES, CATEGORY_COLORS } from '../../data/transactions'
import TransactionModal from './TransactionModal'
import DeleteConfirm from './DeleteConfirm'

function EmptyState({ hasFilters, onAdd, isAdmin }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <Filter size={22} className="text-slate-400" />
      </div>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        {hasFilters ? 'No matching transactions' : 'No transactions yet'}
      </p>
      <p className="text-xs text-slate-400 mb-4">
        {hasFilters ? 'Try adjusting your filters' : isAdmin ? 'Add your first transaction to get started' : 'Transactions will appear here'}
      </p>
      {!hasFilters && isAdmin && (
        <button onClick={onAdd} className="btn-primary">
          <Plus size={14} /> Add transaction
        </button>
      )}
    </div>
  )
}

export default function TransactionsView() {
  const { filters, setFilters, isAdmin } = useFinance()
  const transactions = useFilteredTransactions()
  const [addOpen, setAddOpen] = useState(false)
  const [editTx, setEditTx] = useState(null)
  const [deleteTx, setDeleteTx] = useState(null)
  const [exportOpen, setExportOpen] = useState(false)

  const hasFilters = !!(filters.category || filters.type || filters.search)

  const clearFilters = () => setFilters({ category: '', type: '', search: '' })

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Transactions</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {transactions.length} record{transactions.length !== 1 ? 's' : ''}
            {hasFilters && ' (filtered)'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Export */}
          <div className="relative">
            <button
              onClick={() => setExportOpen(o => !o)}
              className="btn-secondary text-xs"
            >
              <Download size={13} /> Export <ChevronDown size={11} className="text-slate-400" />
            </button>
            {exportOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 card py-1 z-10 shadow-lg animate-[fadeIn_.1s_ease]">
                {[
                  { label: 'Export CSV', action: () => { exportCSV(transactions); setExportOpen(false) } },
                  { label: 'Export JSON', action: () => { exportJSON(transactions); setExportOpen(false) } },
                ].map(({ label, action }) => (
                  <button key={label} onClick={action} className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isAdmin && (
            <button onClick={() => setAddOpen(true)} className="btn-primary text-xs">
              <Plus size={14} /> Add
            </button>
          )}
        </div>
      </div>

      {/* Filters bar */}
      <div className="card p-3 flex flex-wrap gap-2.5 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions…"
            className="input pl-8 py-1.5 text-xs"
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
          />
        </div>

        {/* Category filter */}
        <select
          className="input w-auto py-1.5 text-xs pr-8"
          value={filters.category}
          onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
        >
          <option value="">All categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Type filter */}
        <select
          className="input w-auto py-1.5 text-xs pr-8"
          value={filters.type}
          onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
        >
          <option value="">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {hasFilters && (
          <button onClick={clearFilters} className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-medium">
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {transactions.length === 0 ? (
          <EmptyState hasFilters={hasFilters} onAdd={() => setAddOpen(true)} isAdmin={isAdmin} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  {['Date', 'Description', 'Category', 'Type', 'Amount', isAdmin ? 'Actions' : ''].filter(Boolean).map(h => (
                    <th key={h} className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 ${h === 'Amount' ? 'text-right' : ''} ${h === 'Actions' ? 'text-right' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                {transactions.map(tx => (
                  <tr
                    key={tx.id}
                    className="group hover:bg-slate-50 dark:hover:bg-white/[.02] transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap font-mono">
                      {formatDate(tx.date)}
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold"
                          style={{ background: CATEGORY_COLORS[tx.category] || '#94a3b8' }}
                        >
                          {tx.category[0]}
                        </div>
                        <span className="text-slate-800 dark:text-slate-200 truncate text-xs font-medium">{tx.description}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{tx.category}</td>
                    <td className="px-4 py-3">
                      <span className={tx.type === 'income' ? 'badge-income' : 'badge-expense'}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-right text-sm font-semibold whitespace-nowrap ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {tx.type === 'income' ? '+' : '−'}{formatCurrency(tx.amount)}
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditTx(tx)}
                            className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={() => setDeleteTx(tx)}
                            className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {addOpen && <TransactionModal onClose={() => setAddOpen(false)} />}
      {editTx && <TransactionModal tx={editTx} onClose={() => setEditTx(null)} />}
      {deleteTx && <DeleteConfirm tx={deleteTx} onClose={() => setDeleteTx(null)} />}
    </div>
  )
}

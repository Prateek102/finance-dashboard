import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Download, FileJson, PackageOpen } from 'lucide-react';
import { useApp } from '../../context/useApp';
import { applyFilters, fmtDate, fmt, exportCSV, exportJSON } from '../../utils/finance';
import { TypeBadge, CategoryDot } from '../ui/Badge';
import FilterBar from './FilterBar';
import TransactionModal from './TransactionModal';
import DeleteModal from './DeleteModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function Transactions() {
  const { transactions, deleteTransaction, isAdmin, filters } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const filtered = useMemo(() => applyFilters(transactions, filters), [transactions, filters]);
  const sorted = useMemo(() => [...filtered].sort((a, b) => b.date.localeCompare(a.date)), [filtered]);

  function openAdd() { setEditing(null); setModalOpen(true); }
  function openEdit(t) { setEditing(t); setModalOpen(true); }
  function openDelete(t) { setDeleting(t); }

  return (
    <div className="p-4 lg:p-6 flex flex-col gap-5 max-w-7xl mx-auto">
      {/* Header row */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Transactions</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {sorted.length} of {transactions.length} records
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Export buttons */}
          <button
            onClick={() => exportCSV(sorted)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
            title="Export CSV"
          >
            <Download size={13} />
            CSV
          </button>
          <button
            onClick={() => exportJSON(sorted)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
            title="Export JSON"
          >
            <FileJson size={13} />
            JSON
          </button>
          {isAdmin && (
            <button
              onClick={openAdd}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-opacity hover:opacity-90"
              style={{ background: 'var(--accent-blue)', color: '#fff' }}
            >
              <Plus size={13} />
              Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <FilterBar />

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3" style={{ color: 'var(--text-muted)' }}>
            <PackageOpen size={36} strokeWidth={1.5} />
            <div className="text-center">
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>No transactions found</p>
              <p className="text-xs mt-1">Try adjusting your filters or add a new transaction</p>
            </div>
            {isAdmin && (
              <button
                onClick={openAdd}
                className="mt-1 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold"
                style={{ background: 'var(--accent-blue)', color: '#fff' }}
              >
                <Plus size={13} /> Add Transaction
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Date', 'Description', 'Category', 'Type', 'Amount', ...(isAdmin ? [''] : [])].map(h => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-medium"
                      style={{ color: 'var(--text-muted)', background: 'var(--bg-elevated)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {sorted.map((t, i) => (
                    <motion.tr
                      key={t.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: Math.min(i * 0.02, 0.3) }}
                      style={{ borderBottom: '1px solid var(--border-light)' }}
                      className="group"
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td className="px-4 py-3 text-xs mono whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                        {fmtDate(t.date)}
                      </td>
                      <td className="px-4 py-3 text-xs max-w-[200px]" style={{ color: 'var(--text-primary)' }}>
                        <span className="truncate block">{t.description || '—'}</span>
                      </td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                        <CategoryDot category={t.category} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <TypeBadge type={t.type} />
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold mono whitespace-nowrap"
                        style={{ color: t.type === 'income' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                        {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                      </td>
                      {isAdmin && (
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEdit(t)}
                              className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
                              style={{ color: 'var(--text-muted)', background: 'var(--bg-elevated)' }}
                              title="Edit"
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              onClick={() => openDelete(t)}
                              className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
                              style={{ color: 'var(--accent-red)', background: 'var(--accent-red-dim)' }}
                              title="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} editingTransaction={editing} />
      <DeleteModal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        transaction={deleting}
        onConfirm={() => deleteTransaction(deleting?.id)}
      />
    </div>
  );
}

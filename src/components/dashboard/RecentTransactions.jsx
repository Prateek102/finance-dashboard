import { ArrowUpRight } from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import { formatCurrency, formatDate } from '../../utils'
import { CATEGORY_COLORS } from '../../data/transactions'

export default function RecentTransactions() {
  const { transactions, setActiveView } = useFinance()
  const recent = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6)

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Transactions</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Latest activity</p>
        </div>
        <button
          onClick={() => setActiveView('transactions')}
          className="flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors"
        >
          View all <ArrowUpRight size={12} />
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="py-10 text-center text-sm text-slate-400">No transactions yet</div>
      ) : (
        <div className="space-y-1">
          {recent.map(tx => (
            <div
              key={tx.id}
              className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-white/[.03] transition-colors"
            >
              {/* Category dot */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: CATEGORY_COLORS[tx.category] || '#94a3b8' }}
              >
                {tx.category[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{tx.description}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{tx.category} · {formatDate(tx.date)}</p>
              </div>
              <span className={`text-sm font-semibold flex-shrink-0 ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                {tx.type === 'income' ? '+' : '−'}{formatCurrency(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

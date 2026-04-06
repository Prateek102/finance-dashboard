import SummaryCards from './SummaryCards'
import Charts from './Charts'
import RecentTransactions from './RecentTransactions'
import { useFinance } from '../../context/FinanceContext'

export default function DashboardView() {
  const { role } = useFinance()
  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-base font-semibold text-slate-900 dark:text-white">
            {greeting} 👋
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Here's your financial snapshot for {now.toLocaleString('en-IN', { month: 'long', year: 'numeric' })}.
            {role === 'viewer' && <span className="ml-1 text-amber-600 dark:text-amber-400 font-medium">· Read-only mode</span>}
          </p>
        </div>
        <div className="text-right text-xs text-slate-400 hidden sm:block">
          {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      <SummaryCards />
      <Charts />

      <div className="grid grid-cols-1 gap-4">
        <RecentTransactions />
      </div>
    </div>
  )
}

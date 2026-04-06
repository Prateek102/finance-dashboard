import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useStats } from '../../hooks/useStats'
import { formatCurrency } from '../../utils'

function StatCard({ title, value, sub, icon: Icon, iconBg, trend, trendValue }) {
  const positive = trendValue >= 0
  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">{value}</p>
        </div>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <Icon size={16} className="text-white" strokeWidth={2.5} />
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {trend && (
          <>
            {positive
              ? <ArrowUpRight size={13} className="text-emerald-500" />
              : <ArrowDownRight size={13} className="text-red-500" />
            }
            <span className={`text-xs font-medium ${positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {Math.abs(trendValue)}%
            </span>
          </>
        )}
        <span className="text-xs text-slate-400">{sub}</span>
      </div>
    </div>
  )
}

export default function SummaryCards() {
  const { balance, totalIncome, totalExpense, expenseChange, incomeChange } = useStats()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        title="Total Balance"
        value={formatCurrency(balance)}
        sub="All time net"
        icon={Wallet}
        iconBg="bg-slate-700 dark:bg-slate-600"
        trend={false}
        trendValue={0}
      />
      <StatCard
        title="Total Income"
        value={formatCurrency(totalIncome)}
        sub="vs last month"
        icon={TrendingUp}
        iconBg="bg-brand-600"
        trend={true}
        trendValue={incomeChange}
      />
      <StatCard
        title="Total Expenses"
        value={formatCurrency(totalExpense)}
        sub="vs last month"
        icon={TrendingDown}
        iconBg="bg-rose-500"
        trend={true}
        trendValue={expenseChange}
      />
    </div>
  )
}

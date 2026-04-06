import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Lightbulb, Target } from 'lucide-react'
import { useStats } from '../../hooks/useStats'
import { useFinance } from '../../context/FinanceContext'
import { formatCurrency } from '../../utils'

function InsightCard({ icon: Icon, iconColor, iconBg, title, subtitle, value, tag, tagColor }) {
  return (
    <div className="card p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <Icon size={16} className={iconColor} />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{title}</p>
          {value && <p className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight mt-0.5">{value}</p>}
        </div>
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">{subtitle}</p>
      {tag && (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${tagColor}`}>
          {tag}
        </span>
      )}
    </div>
  )
}

function Observation({ text, type = 'neutral' }) {
  const config = {
    good:    { icon: CheckCircle,   color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' },
    warning: { icon: AlertCircle,  color: 'text-amber-500',   bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' },
    bad:     { icon: TrendingDown, color: 'text-red-500',     bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' },
    neutral: { icon: Lightbulb,    color: 'text-slate-500',   bg: 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700' },
  }
  const { icon: Icon, color, bg } = config[type]
  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-xl border ${bg}`}>
      <Icon size={15} className={`${color} mt-0.5 flex-shrink-0`} />
      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{text}</p>
    </div>
  )
}

export default function InsightsView() {
  const { transactions } = useFinance()
  const {
    balance, totalIncome, totalExpense,
    thisIncome, thisExpense, lastIncome, lastExpense,
    expenseChange, incomeChange,
    topCategory, pieData,
    thisMonthCount,
  } = useStats()

  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0
  const avgTx = transactions.length > 0 ? Math.round(totalExpense / transactions.filter(t => t.type === 'expense').length) : 0

  const observations = []

  if (expenseChange > 20) {
    observations.push({ text: `Your spending jumped by ${expenseChange}% compared to last month. The biggest contributor was ${topCategory?.name || 'various categories'} — consider reviewing discretionary spend.`, type: 'bad' })
  } else if (expenseChange < -10) {
    observations.push({ text: `Great discipline! Expenses dropped by ${Math.abs(expenseChange)}% vs last month. You're building a healthier spending habit.`, type: 'good' })
  } else if (expenseChange >= 0) {
    observations.push({ text: `Spending is relatively stable — up just ${expenseChange}% from last month. Minor fluctuations are normal.`, type: 'neutral' })
  }

  if (incomeChange > 0) {
    observations.push({ text: `Income grew by ${incomeChange}% this month. A consistent income trend helps you plan savings and investments more effectively.`, type: 'good' })
  } else if (incomeChange < 0) {
    observations.push({ text: `Income dipped ${Math.abs(incomeChange)}% this month. If this continues, consider building a buffer from past months' surplus.`, type: 'warning' })
  }

  if (savingsRate >= 30) {
    observations.push({ text: `You're saving ${savingsRate}% of your income — excellent! Most financial planners recommend 20%+. Consider channeling surplus into a SIP or emergency fund.`, type: 'good' })
  } else if (savingsRate >= 10) {
    observations.push({ text: `Savings rate is ${savingsRate}% — decent but there's room to improve. Targeting 25–30% gives you a solid financial cushion.`, type: 'neutral' })
  } else if (savingsRate >= 0) {
    observations.push({ text: `Savings rate is only ${savingsRate}%. Try identifying your top 2–3 spending categories and cutting 10% from each to meaningfully boost savings.`, type: 'warning' })
  } else {
    observations.push({ text: `You're spending more than you earn (savings rate: ${savingsRate}%). Immediate action is needed — review fixed costs and reduce variable expenses.`, type: 'bad' })
  }

  if (topCategory) {
    const pct = Math.round((topCategory.value / totalExpense) * 100)
    if (pct > 40) {
      observations.push({ text: `"${topCategory.name}" accounts for ${pct}% of all your expenses — a high concentration. Diversifying spend or negotiating costs here can have a big impact.`, type: 'warning' })
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Insights</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Smart analysis of your financial patterns</p>
      </div>

      {/* Key metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <InsightCard
          icon={Target}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-50 dark:bg-blue-900/30"
          title="Savings Rate"
          value={`${savingsRate}%`}
          subtitle="Of total income retained after all expenses."
          tag={savingsRate >= 20 ? 'Healthy' : savingsRate >= 10 ? 'Fair' : 'Low'}
          tagColor={savingsRate >= 20 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : savingsRate >= 10 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}
        />
        <InsightCard
          icon={TrendingDown}
          iconColor="text-rose-600 dark:text-rose-400"
          iconBg="bg-rose-50 dark:bg-rose-900/30"
          title="Top Spend Category"
          value={topCategory?.name?.split(' ')[0] || '—'}
          subtitle={topCategory ? `${formatCurrency(topCategory.value)} total across all time.` : 'No expense data yet.'}
          tag={topCategory ? `${Math.round((topCategory.value / totalExpense) * 100)}% of expenses` : null}
          tagColor="bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400"
        />
        <InsightCard
          icon={TrendingUp}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-900/30"
          title="This Month Spend"
          value={formatCurrency(thisExpense)}
          subtitle={`${expenseChange >= 0 ? '+' : ''}${expenseChange}% vs last month (${formatCurrency(lastExpense)}).`}
          tag={expenseChange >= 0 ? `↑ ${expenseChange}%` : `↓ ${Math.abs(expenseChange)}%`}
          tagColor={expenseChange > 0 ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'}
        />
        <InsightCard
          icon={Lightbulb}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50 dark:bg-amber-900/30"
          title="Avg. Expense"
          value={formatCurrency(avgTx)}
          subtitle={`Per expense transaction. ${thisMonthCount} transactions this month.`}
          tag="Per transaction"
          tagColor="bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
        />
      </div>

      {/* Category breakdown table */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Category Breakdown</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">All-time expense distribution by category</p>
        {pieData.length === 0 ? (
          <p className="text-sm text-slate-400 py-6 text-center">No expense data</p>
        ) : (
          <div className="space-y-2.5">
            {pieData.map(({ name, value, color }) => {
              const pct = Math.round((value / totalExpense) * 100)
              return (
                <div key={name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                      <span className="text-xs text-slate-700 dark:text-slate-300">{name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{formatCurrency(value)}</span>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white w-8 text-right">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Observations */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">AI Observations</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Human-readable insights based on your data</p>
        <div className="space-y-2.5">
          {observations.length > 0
            ? observations.map((o, i) => <Observation key={i} text={o.text} type={o.type} />)
            : <Observation text="Add more transactions to generate meaningful insights." type="neutral" />
          }
        </div>
      </div>
    </div>
  )
}

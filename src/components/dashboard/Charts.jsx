import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { useStats } from '../../hooks/useStats'
import { formatCurrency } from '../../utils'
import { useFinance } from '../../context/FinanceContext'

const CustomPieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const { name, value, color } = payload[0].payload
  return (
    <div className="card px-3 py-2 text-xs shadow-lg">
      <div className="flex items-center gap-2 mb-0.5">
        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
        <span className="font-medium text-slate-700 dark:text-slate-300">{name}</span>
      </div>
      <div className="text-slate-900 dark:text-white font-semibold">{formatCurrency(value)}</div>
    </div>
  )
}

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="card px-3 py-2 text-xs shadow-lg space-y-1">
      <div className="font-medium text-slate-600 dark:text-slate-400 mb-1">{label}</div>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-sm" style={{ background: p.fill }} />
          <span className="text-slate-500 dark:text-slate-400 capitalize">{p.name}:</span>
          <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function Charts() {
  const { pieData, barData } = useStats()
  const { dark } = useFinance()

  const axisColor = dark ? '#475569' : '#cbd5e1'
  const textColor = dark ? '#94a3b8' : '#64748b'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* Bar chart */}
      <div className="card p-5 lg:col-span-3">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Monthly Overview</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Income vs expenses over last 6 months</p>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} barSize={14} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke={axisColor} vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: textColor }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: textColor }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => formatCurrency(v, true)}
              width={52}
            />
            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: dark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.03)', radius: 4 }} />
            <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} name="income" />
            <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} name="expense" />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-3 h-1.5 rounded-full bg-brand-500 inline-block" />Income</div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-3 h-1.5 rounded-full bg-rose-500 inline-block" />Expense</div>
        </div>
      </div>

      {/* Pie chart */}
      <div className="card p-5 lg:col-span-2">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Spending Breakdown</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">By category (expenses)</p>
        </div>
        {pieData.length === 0 ? (
          <div className="flex items-center justify-center h-[200px] text-sm text-slate-400">No expense data</div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}
        {/* Legend */}
        <div className="mt-1 space-y-1 max-h-28 overflow-y-auto">
          {pieData.slice(0, 6).map(({ name, color, value }) => (
            <div key={name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                <span className="text-slate-600 dark:text-slate-400 truncate max-w-[100px]">{name}</span>
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-300">{formatCurrency(value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

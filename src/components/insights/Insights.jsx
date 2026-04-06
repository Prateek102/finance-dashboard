import { useMemo } from 'react';
import { useApp } from '../../context/useApp';
import { computeInsights, fmt, computeSummary } from '../../utils/finance';
import { TrendingUp, TrendingDown, Award, PiggyBank, Activity, BarChart3 } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import Card from '../ui/Card';
import { motion } from 'framer-motion';

function InsightCard({ icon: Icon, label, value, sub, accent = 'blue', delay = 0 }) {
  const colorMap = {
    blue: { color: 'var(--accent-blue)', bg: 'var(--accent-blue-dim)' },
    green: { color: 'var(--accent-green)', bg: 'var(--accent-green-dim)' },
    red: { color: 'var(--accent-red)', bg: 'var(--accent-red-dim)' },
    amber: { color: 'var(--accent-amber)', bg: 'var(--accent-amber-dim)' },
    purple: { color: 'var(--accent-purple)', bg: 'var(--accent-purple-dim)' },
  };
  const c = colorMap[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: c.bg }}>
          <Icon size={15} style={{ color: c.color }} strokeWidth={2.5} />
        </div>
        <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{label}</p>
      </div>
      <div>
        <p className="text-xl font-semibold mono" style={{ color: 'var(--text-primary)' }}>{value}</p>
        {sub && <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{sub}</p>}
      </div>
    </motion.div>
  );
}

function ObservationBubble({ text, accent = 'blue', delay = 0 }) {
  const colorMap = {
    blue: { color: 'var(--accent-blue)', bg: 'var(--accent-blue-dim)', border: 'var(--accent-blue)' },
    green: { color: 'var(--accent-green)', bg: 'var(--accent-green-dim)', border: 'var(--accent-green)' },
    red: { color: 'var(--accent-red)', bg: 'var(--accent-red-dim)', border: 'var(--accent-red)' },
    amber: { color: 'var(--accent-amber)', bg: 'var(--accent-amber-dim)', border: 'var(--accent-amber)' },
  };
  const c = colorMap[accent];
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-start gap-3 p-4 rounded-xl"
      style={{ background: c.bg, borderLeft: `3px solid ${c.border}` }}
    >
      <p className="text-xs leading-relaxed" style={{ color: c.color }}>{text}</p>
    </motion.div>
  );
}

function AreaTooltip({ active, payload, label }) {
  if (active && payload?.length) {
    return (
      <div className="rounded-xl px-3 py-2 text-xs shadow-xl" style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)',
      }}>
        <p style={{ color: 'var(--text-muted)' }}>{label}</p>
        <p className="mono font-semibold">{fmt(payload[0].value)}</p>
      </div>
    );
  }
  return null;
}

export default function Insights() {
  const { transactions } = useApp();
  const insights = useMemo(() => computeInsights(transactions), [transactions]);
  const summary = useMemo(() => computeSummary(transactions), [transactions]);

  const { topCategory, monthlyChange, avgMonthlyExpense, savingsRate, monthly, catBreakdown } = insights;

  // Savings trend data
  const savingsTrend = monthly.map(m => ({
    label: m.label,
    savings: Math.max(0, m.income - m.expense),
  }));

  // Radar data for top categories (normalized)
  const maxCat = catBreakdown[0]?.value || 1;
  const radarData = catBreakdown.slice(0, 6).map(c => ({
    category: c.name.split(' ')[0],
    value: Math.round((c.value / maxCat) * 100),
  }));

  // Build observations
  const observations = [];
  if (monthlyChange) {
    const { pct, diff } = monthlyChange;
    const dir = diff > 0 ? 'increased' : 'decreased';
    const accent = diff > 0 ? 'red' : 'green';
    observations.push({
      text: `Your spending ${dir} by ${Math.abs(pct)}% this month compared to last month (${diff > 0 ? '+' : ''}${fmt(diff)}).`,
      accent,
    });
  }
  if (topCategory) {
    observations.push({
      text: `Your biggest spending category is ${topCategory.name} at ${fmt(topCategory.value)} total — consider if this aligns with your budget goals.`,
      accent: 'amber',
    });
  }
  if (savingsRate > 0) {
    const pct = Math.round(savingsRate * 100);
    observations.push({
      text: `Your average savings rate is ${pct}% — ${pct >= 20 ? "great work! You're saving a healthy portion of your income." : "try to aim for at least 20% to build a stronger financial cushion."}`,
      accent: pct >= 20 ? 'green' : 'blue',
    });
  }
  if (summary.balance < 0) {
    observations.push({
      text: `Your total expenses exceed income by ${fmt(Math.abs(summary.balance))}. Review recurring costs to bring your balance positive.`,
      accent: 'red',
    });
  }

  return (
    <div className="p-4 lg:p-6 flex flex-col gap-5 max-w-7xl mx-auto">
      <div>
        <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Insights</h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          AI-powered analysis of your spending patterns
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <InsightCard
          icon={Award}
          label="Top Category"
          value={topCategory?.name || '—'}
          sub={topCategory ? fmt(topCategory.value) + ' total' : 'No data'}
          accent="amber"
          delay={0}
        />
        <InsightCard
          icon={PiggyBank}
          label="Avg. Monthly Savings"
          value={fmt(monthly.length ? monthly.reduce((s, m) => s + Math.max(0, m.income - m.expense), 0) / monthly.length : 0)}
          sub={`${Math.round(savingsRate * 100)}% savings rate`}
          accent="green"
          delay={0.05}
        />
        <InsightCard
          icon={Activity}
          label="Avg. Monthly Expense"
          value={fmt(avgMonthlyExpense)}
          sub={`Across ${monthly.length} months`}
          accent="red"
          delay={0.1}
        />
        <InsightCard
          icon={monthlyChange?.diff > 0 ? TrendingUp : TrendingDown}
          label="Month-over-Month"
          value={monthlyChange ? `${monthlyChange.pct > 0 ? '+' : ''}${monthlyChange.pct}%` : '—'}
          sub={monthlyChange ? `${monthlyChange.diff > 0 ? 'More' : 'Less'} than last month` : 'Not enough data'}
          accent={monthlyChange?.diff > 0 ? 'red' : 'green'}
          delay={0.15}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Savings trend */}
        <Card>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Savings Trend</p>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Monthly net savings over time</p>
          {savingsTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={savingsTrend}>
                <defs>
                  <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-green)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--accent-green)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.6} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} width={40} />
                <Tooltip content={<AreaTooltip />} />
                <Area type="monotone" dataKey="savings" stroke="var(--accent-green)" strokeWidth={2} fill="url(#savingsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-44 flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
              <p className="text-sm">Not enough data</p>
            </div>
          )}
        </Card>

        {/* Radar chart */}
        <Card>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Spending Profile</p>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Top category distribution</p>
          {radarData.length > 2 ? (
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'DM Sans' }} />
                <Radar name="Spending" dataKey="value" stroke="var(--accent-purple)" fill="var(--accent-purple)" fillOpacity={0.25} strokeWidth={1.5} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-44 flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
              <p className="text-sm">Add more categories to see your spending profile</p>
            </div>
          )}
        </Card>
      </div>

      {/* Observations */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={15} style={{ color: 'var(--accent-blue)' }} />
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Smart Observations</p>
        </div>
        <div className="flex flex-col gap-3">
          {observations.length > 0 ? (
            observations.map((obs, i) => (
              <ObservationBubble key={i} text={obs.text} accent={obs.accent} delay={i * 0.06} />
            ))
          ) : (
            <p className="text-sm text-center py-6" style={{ color: 'var(--text-muted)' }}>
              Add more transactions to unlock insights
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

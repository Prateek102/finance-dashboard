import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { fmt } from '../../utils/finance';

function CustomTooltip({ active, payload, label }) {
  if (active && payload?.length) {
    return (
      <div className="rounded-xl px-3 py-2.5 text-xs shadow-xl" style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        color: 'var(--text-primary)',
        minWidth: 130,
      }}>
        <p className="font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label}</p>
        {payload.map(p => (
          <div key={p.name} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
              <span className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
              {p.name}
            </span>
            <span className="mono font-medium" style={{ color: 'var(--text-primary)' }}>{fmt(p.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function MonthlyBarChart({ data }) {
  if (!data.length) {
    return (
      <div className="h-48 flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
        <p className="text-sm">No data yet</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barSize={10} barGap={4}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="var(--border)"
          strokeOpacity={0.6}
        />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'DM Sans' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'DM Sans' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`}
          width={40}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-hover)', radius: 4 }} />
        <Bar dataKey="income" name="Income" fill="var(--accent-green)" radius={[4, 4, 0, 0]} opacity={0.9} />
        <Bar dataKey="expense" name="Expense" fill="var(--accent-red)" radius={[4, 4, 0, 0]} opacity={0.85} />
      </BarChart>
    </ResponsiveContainer>
  );
}

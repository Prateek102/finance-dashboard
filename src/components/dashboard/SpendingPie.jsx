import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { fmt } from '../../utils/finance';

function CustomTooltip({ active, payload }) {
  if (active && payload?.length) {
    const { name, value } = payload[0].payload;
    return (
      <div className="rounded-xl px-3 py-2 text-xs shadow-xl" style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        color: 'var(--text-primary)',
      }}>
        <p className="font-medium">{name}</p>
        <p className="mono" style={{ color: 'var(--accent-red)' }}>{fmt(value)}</p>
      </div>
    );
  }
  return null;
}

export default function SpendingPie({ data }) {
  if (!data.length) {
    return (
      <div className="h-48 flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
        <p className="text-sm">No expense data</p>
      </div>
    );
  }

  const top5 = data.slice(0, 6);

  return (
    <div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={top5}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={88}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {top5.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-3 flex flex-col gap-2">
        {top5.map((cat) => (
          <div key={cat.name} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cat.color }} />
              {cat.name}
            </span>
            <span className="mono font-medium" style={{ color: 'var(--text-primary)' }}>
              {fmt(cat.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

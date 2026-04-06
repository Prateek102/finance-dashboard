import { CATEGORY_COLORS } from '../../data/transactions';

export function TypeBadge({ type }) {
  const isIncome = type === 'income';
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium"
      style={{
        background: isIncome ? 'var(--accent-green-dim)' : 'var(--accent-red-dim)',
        color: isIncome ? 'var(--accent-green)' : 'var(--accent-red)',
      }}
    >
      <span className="text-xs">{isIncome ? '↑' : '↓'}</span>
      {isIncome ? 'Income' : 'Expense'}
    </span>
  );
}

export function CategoryDot({ category }) {
  const color = CATEGORY_COLORS[category] || '#94a3b8';
  return (
    <span className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
      {category}
    </span>
  );
}

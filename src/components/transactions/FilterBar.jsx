import { Search, X } from 'lucide-react';
import { useApp } from '../../context/useApp';
import { CATEGORIES } from '../../data/transactions';

const inputStyle = {
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border)',
  color: 'var(--text-primary)',
  borderRadius: 8,
  padding: '7px 10px',
  fontSize: 12,
  outline: 'none',
  fontFamily: 'DM Sans',
};

export default function FilterBar() {
  const { filters, setFilters } = useApp();

  function set(key, val) {
    setFilters(f => ({ ...f, [key]: val }));
  }

  function reset() {
    setFilters({ search: '', category: 'all', type: 'all', dateFrom: '', dateTo: '' });
  }

  const isActive = filters.search || filters.category !== 'all' || filters.type !== 'all' || filters.dateFrom || filters.dateTo;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search */}
      <div className="relative">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search…"
          value={filters.search}
          onChange={e => set('search', e.target.value)}
          style={{ ...inputStyle, paddingLeft: 28, width: 180 }}
        />
      </div>

      {/* Category */}
      <select value={filters.category} onChange={e => set('category', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
        <option value="all">All Categories</option>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      {/* Type */}
      <select value={filters.type} onChange={e => set('type', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      {/* Date range */}
      <input
        type="date"
        value={filters.dateFrom}
        onChange={e => set('dateFrom', e.target.value)}
        style={{ ...inputStyle, colorScheme: 'dark' }}
        title="From date"
      />
      <input
        type="date"
        value={filters.dateTo}
        onChange={e => set('dateTo', e.target.value)}
        style={{ ...inputStyle, colorScheme: 'dark' }}
        title="To date"
      />

      {/* Clear */}
      {isActive && (
        <button
          onClick={reset}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
          style={{ background: 'var(--accent-red-dim)', color: 'var(--accent-red)' }}
        >
          <X size={11} />
          Clear
        </button>
      )}
    </div>
  );
}

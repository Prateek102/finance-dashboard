import { CATEGORY_COLORS } from '../data/transactions';

export function fmt(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function fmtFull(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function fmtDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
}

export function getMonthKey(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function getMonthLabel(key) {
  const [year, month] = key.split('-');
  return new Date(year, parseInt(month) - 1, 1).toLocaleDateString('en-US', {
    month: 'short', year: '2-digit'
  });
}

export function computeSummary(transactions) {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);
  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);
  return { income, expense, balance: income - expense };
}

export function computeCategoryBreakdown(transactions) {
  const map = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    map[t.category] = (map[t.category] || 0) + t.amount;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value, color: CATEGORY_COLORS[name] || '#94a3b8' }))
    .sort((a, b) => b.value - a.value);
}

export function computeMonthlyData(transactions) {
  const map = {};
  transactions.forEach(t => {
    const key = getMonthKey(t.date);
    if (!map[key]) map[key] = { key, label: getMonthLabel(key), income: 0, expense: 0 };
    if (t.type === 'income') map[key].income += t.amount;
    else map[key].expense += t.amount;
  });
  return Object.values(map).sort((a, b) => a.key.localeCompare(b.key));
}

export function computeInsights(transactions) {
  const monthly = computeMonthlyData(transactions);
  const catBreakdown = computeCategoryBreakdown(transactions);
  const topCategory = catBreakdown[0] || null;

  const last2 = monthly.slice(-2);
  let monthlyChange = null;
  if (last2.length === 2) {
    const [prev, curr] = last2;
    const diff = curr.expense - prev.expense;
    const pct = prev.expense > 0 ? Math.round((diff / prev.expense) * 100) : 0;
    monthlyChange = { prev, curr, diff, pct };
  }

  const avgMonthlyExpense = monthly.length
    ? monthly.reduce((s, m) => s + m.expense, 0) / monthly.length
    : 0;

  const savingsRate = monthly.length
    ? monthly.reduce((s, m) => {
        const rate = m.income > 0 ? (m.income - m.expense) / m.income : 0;
        return s + rate;
      }, 0) / monthly.length
    : 0;

  return { topCategory, monthlyChange, avgMonthlyExpense, savingsRate, monthly, catBreakdown };
}

export function applyFilters(transactions, filters) {
  return transactions.filter(t => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!t.description?.toLowerCase().includes(q) && !t.category.toLowerCase().includes(q)) return false;
    }
    if (filters.category !== 'all' && t.category !== filters.category) return false;
    if (filters.type !== 'all' && t.type !== filters.type) return false;
    if (filters.dateFrom && t.date < filters.dateFrom) return false;
    if (filters.dateTo && t.date > filters.dateTo) return false;
    return true;
  });
}

export function exportCSV(transactions) {
  const header = 'Date,Category,Description,Type,Amount';
  const rows = transactions.map(t =>
    `${t.date},${t.category},"${t.description || ''}",${t.type},${t.amount}`
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'transactions.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export function exportJSON(transactions) {
  const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'transactions.json';
  a.click();
  URL.revokeObjectURL(url);
}

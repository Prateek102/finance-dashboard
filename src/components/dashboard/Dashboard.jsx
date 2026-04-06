import { useMemo } from 'react';
import { useApp } from '../../context/useApp';
import { computeSummary, computeCategoryBreakdown, computeMonthlyData } from '../../utils/finance';
import SummaryCards from './SummaryCards';
import SpendingPie from './SpendingPie';
import MonthlyBarChart from './MonthlyBarChart';
import RecentTransactions from './RecentTransactions';
import Card from '../ui/Card';

export default function Dashboard() {
  const { transactions } = useApp();

  const summary = useMemo(() => computeSummary(transactions), [transactions]);
  const categoryData = useMemo(() => computeCategoryBreakdown(transactions), [transactions]);
  const monthlyData = useMemo(() => computeMonthlyData(transactions), [transactions]);

  return (
    <div className="p-4 lg:p-6 flex flex-col gap-5 max-w-7xl mx-auto">
      {/* Page heading */}
      <div>
        <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Overview</h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Your financial summary across all transactions
        </p>
      </div>

      {/* Summary cards */}
      <SummaryCards summary={summary} />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar chart – wider */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Monthly Comparison</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Income vs Expenses</p>
            </div>
            <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-green)' }} />
                Income
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-red)' }} />
                Expense
              </span>
            </div>
          </div>
          <MonthlyBarChart data={monthlyData} />
        </Card>

        {/* Pie chart */}
        <Card>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Spending by Category</p>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Top expense categories</p>
          <SpendingPie data={categoryData} />
        </Card>
      </div>

      {/* Recent transactions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Activity</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Latest {Math.min(6, transactions.length)} transactions</p>
          </div>
        </div>
        <RecentTransactions transactions={transactions} />
      </Card>
    </div>
  );
}

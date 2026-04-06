import { useMemo } from 'react'
import { useFinance } from '../context/FinanceContext'
import { startOfMonth, endOfMonth, isWithinInterval, subMonths, parseISO } from 'date-fns'
import { CATEGORY_COLORS } from '../data/transactions'

export function useStats() {
  const { transactions } = useFinance()

  return useMemo(() => {
    const now = new Date()
    const thisMonthStart = startOfMonth(now)
    const thisMonthEnd = endOfMonth(now)
    const lastMonthStart = startOfMonth(subMonths(now, 1))
    const lastMonthEnd = endOfMonth(subMonths(now, 1))

    const inRange = (tx, start, end) =>
      isWithinInterval(parseISO(tx.date), { start, end })

    const thisMo = transactions.filter(t => inRange(t, thisMonthStart, thisMonthEnd))
    const lastMo = transactions.filter(t => inRange(t, lastMonthStart, lastMonthEnd))

    const sum = (list, type) =>
      list.filter(t => t.type === type).reduce((a, t) => a + t.amount, 0)

    const totalIncome = sum(transactions, 'income')
    const totalExpense = sum(transactions, 'expense')
    const balance = totalIncome - totalExpense

    const thisIncome = sum(thisMo, 'income')
    const thisExpense = sum(thisMo, 'expense')
    const lastIncome = sum(lastMo, 'income')
    const lastExpense = sum(lastMo, 'expense')

    const pct = (a, b) => b === 0 ? 0 : Math.round(((a - b) / b) * 100)

    // Category breakdown (expenses only, all time)
    const expensesByCategory = {}
    transactions.filter(t => t.type === 'expense').forEach(t => {
      expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount
    })

    const pieData = Object.entries(expensesByCategory)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value, color: CATEGORY_COLORS[name] || '#94a3b8' }))

    const topCategory = pieData[0] || null

    // Monthly bar data (last 6 months)
    const barData = Array.from({ length: 6 }, (_, i) => {
      const d = subMonths(now, 5 - i)
      const start = startOfMonth(d)
      const end = endOfMonth(d)
      const mo = transactions.filter(t => inRange(t, start, end))
      return {
        month: d.toLocaleString('default', { month: 'short' }),
        income: sum(mo, 'income'),
        expense: sum(mo, 'expense'),
      }
    })

    const expenseChange = pct(thisExpense, lastExpense)
    const incomeChange = pct(thisIncome, lastIncome)

    return {
      totalIncome, totalExpense, balance,
      thisIncome, thisExpense, lastIncome, lastExpense,
      thisMonthCount: thisMo.length,
      expenseChange, incomeChange,
      pieData, barData, topCategory,
    }
  }, [transactions])
}

export function useFilteredTransactions() {
  const { transactions, filters } = useFinance()

  return useMemo(() => {
    return transactions
      .filter(t => {
        if (filters.category && t.category !== filters.category) return false
        if (filters.type && t.type !== filters.type) return false
        if (filters.search) {
          const q = filters.search.toLowerCase()
          if (!t.description.toLowerCase().includes(q) && !t.category.toLowerCase().includes(q)) return false
        }
        return true
      })
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [transactions, filters])
}

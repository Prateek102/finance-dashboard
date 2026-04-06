export const formatCurrency = (amount, compact = false) => {
  if (compact && amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}k`
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatDate = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const exportCSV = (transactions) => {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount (₹)']
  const rows = transactions.map(t => [
    t.date, `"${t.description}"`, t.category, t.type, t.amount
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `fintrack_export_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export const exportJSON = (transactions) => {
  const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `fintrack_export_${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export const cn = (...classes) => classes.filter(Boolean).join(' ')

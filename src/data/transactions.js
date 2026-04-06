import { subDays, subMonths, format } from 'date-fns'

const today = new Date()

export const CATEGORIES = [
  'Food & Dining',
  'Transport',
  'Shopping',
  'Health',
  'Entertainment',
  'Utilities',
  'Salary',
  'Freelance',
  'Investment',
  'Rent',
  'Education',
  'Other',
]

export const CATEGORY_COLORS = {
  'Food & Dining':   '#f97316',
  'Transport':       '#3b82f6',
  'Shopping':        '#a855f7',
  'Health':          '#ec4899',
  'Entertainment':   '#f59e0b',
  'Utilities':       '#6366f1',
  'Salary':          '#22c55e',
  'Freelance':       '#14b8a6',
  'Investment':      '#8b5cf6',
  'Rent':            '#ef4444',
  'Education':       '#06b6d4',
  'Other':           '#94a3b8',
}

let idCounter = 100

function tx(daysAgo, category, description, amount, type) {
  return {
    id: String(++idCounter),
    date: format(subDays(today, daysAgo), 'yyyy-MM-dd'),
    category,
    description,
    amount,
    type, // 'income' | 'expense'
  }
}

export const INITIAL_TRANSACTIONS = [
  // Current month
  tx(0,  'Salary',        'Monthly Salary — March',       52000, 'income'),
  tx(1,  'Rent',          'House Rent — March',           14000, 'expense'),
  tx(2,  'Food & Dining', 'Swiggy — Pizza order',           420, 'expense'),
  tx(3,  'Transport',     'Ola — Office commute',           180, 'expense'),
  tx(4,  'Shopping',      'Amazon — Headphones',           2499, 'expense'),
  tx(5,  'Utilities',     'Airtel Broadband Bill',           799, 'expense'),
  tx(6,  'Health',        'Apollo Pharmacy',                 650, 'expense'),
  tx(7,  'Food & Dining', 'Zomato — Weekend dinner',        580, 'expense'),
  tx(8,  'Freelance',     'UI Design project',            8500, 'income'),
  tx(9,  'Entertainment', 'Netflix + Spotify bundles',       499, 'expense'),
  tx(10, 'Transport',     'Petrol — Honda Activa',           800, 'expense'),
  tx(11, 'Education',     'Udemy React course',              699, 'expense'),
  tx(12, 'Food & Dining', 'Café Coffee Day',                 320, 'expense'),
  tx(13, 'Shopping',      'Myntra — Jeans',                 1299, 'expense'),
  tx(14, 'Investment',    'SIP — Mirae Asset',             3000, 'income'),
  tx(15, 'Health',        'Dr. Sharma consultation',         500, 'expense'),
  tx(16, 'Utilities',     'Electricity Bill — BSES',        1200, 'expense'),
  tx(17, 'Food & Dining', 'Blinkit — Groceries',            1850, 'expense'),
  tx(18, 'Transport',     'Metro card recharge',             500, 'expense'),
  tx(19, 'Entertainment', 'BookMyShow — Movie tickets',      680, 'expense'),

  // Previous month
  tx(32, 'Salary',        'Monthly Salary — February',   52000, 'income'),
  tx(33, 'Rent',          'House Rent — February',       14000, 'expense'),
  tx(34, 'Food & Dining', 'Swiggy — Biryani',               380, 'expense'),
  tx(35, 'Transport',     'Uber — Airport drop',           1200, 'expense'),
  tx(36, 'Shopping',      'Flipkart — Mobile cover',        299, 'expense'),
  tx(37, 'Utilities',     'Gas cylinder — IndianOil',       920, 'expense'),
  tx(38, 'Freelance',     'Logo design project',           5000, 'income'),
  tx(39, 'Investment',    'SIP — HDFC Equity',            3000, 'income'),
  tx(40, 'Health',        'Gym membership',               1500, 'expense'),
  tx(41, 'Entertainment', 'Amazon Prime renewal',           999, 'expense'),
  tx(42, 'Education',     'Book — Clean Code',              450, 'expense'),
  tx(43, 'Shopping',      'D-Mart — Monthly grocery',     3200, 'expense'),
  tx(44, 'Food & Dining', 'Dinner with friends',           1100, 'expense'),
  tx(45, 'Transport',     'Ola — Weekly rides',             640, 'expense'),
  tx(46, 'Utilities',     'Mobile recharge — Jio',          719, 'expense'),

  // Two months ago
  tx(62, 'Salary',        'Monthly Salary — January',    52000, 'income'),
  tx(63, 'Rent',          'House Rent — January',        14000, 'expense'),
  tx(64, 'Freelance',     'Website development',         12000, 'income'),
  tx(65, 'Food & Dining', 'Zomato — Chinese',              540, 'expense'),
  tx(66, 'Shopping',      'New year shopping',            4500, 'expense'),
  tx(67, 'Health',        'Dental check-up',              1800, 'expense'),
  tx(68, 'Investment',    'SIP — Axis Bluechip',          3000, 'income'),
  tx(69, 'Transport',     'Train ticket — Shatabdi',      1200, 'expense'),
  tx(70, 'Entertainment', 'Concert tickets',              2000, 'expense'),
  tx(71, 'Utilities',     'Water purifier service',        600, 'expense'),
]

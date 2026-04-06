<div align="center">

# ⚡ FinTrack

### Personal Finance Dashboard

A modern, production-grade personal finance dashboard built with React, Vite, and Tailwind CSS.
Designed to feel like a real SaaS product — clean UI, smart insights, role-based access, and full transaction management.

<br />

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2-FF6B6B?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)

</div>

---

## 📌 Overview

**FinTrack** is a fully functional personal finance tracker that helps you monitor income, track expenses, and understand your spending habits through visual charts and smart insights.

It was built with a focus on:
- **Real developer code quality** — clean folder structure, separated concerns, meaningful naming
- **Production-level UI** — not a template or AI-generated demo, but a handcrafted interface
- **Practical features** — everything you'd expect from a real finance app

> All amounts are in **Indian Rupees (₹)**. Sample data is preloaded so the dashboard looks meaningful from the first launch.

---

## ✨ Features

### 🏠 Dashboard
- **Summary Cards** — at-a-glance view of Total Balance, Total Income, and Total Expenses
- **Month-over-month trend** — percentage change compared to last month shown on each card
- **Bar Chart** — visual comparison of income vs expenses over the last 6 months
- **Donut Chart** — expense distribution broken down by category with a live legend
- **Recent Transactions** — last 6 transactions with a quick link to the full list

### 💳 Transactions
- **Full data table** — shows Date, Description, Category, Type, and Amount for every transaction
- **Search** — filter transactions by keyword in real time
- **Category filter** — narrow down by any spending category (Food, Transport, Health, etc.)
- **Type filter** — view only Income or only Expenses
- **Add transaction** — modal form with validation (Admin only)
- **Edit transaction** — pre-filled form to update any existing record (Admin only)
- **Delete transaction** — confirmation dialog before permanent removal (Admin only)
- **Hover-reveal actions** — edit and delete buttons appear on row hover for a clean table look
- **Export CSV** — download all (filtered) transactions as a spreadsheet-ready file
- **Export JSON** — download raw transaction data for developers or backup
- **Empty state UI** — friendly placeholder shown when no transactions match filters

### 📊 Insights
- **Savings Rate** — percentage of income retained after all expenses, with a health label (Healthy / Fair / Low)
- **Top Spending Category** — the category where most money is going
- **This Month vs Last Month** — side-by-side spend comparison with percentage change
- **Average Expense** — mean transaction value across all expense entries
- **Category Breakdown** — animated progress bars showing each category's share of total expenses
- **AI Observations** — human-readable, auto-generated financial observations based on your actual data (e.g. *"Your spending jumped 28% this month — the biggest contributor was Food & Dining"*)

### ⚙️ System
- **Role-Based Access Control (RBAC)** — Admin sees full controls, Viewer gets read-only access
- **Role Switcher** — dropdown in navbar to switch between Admin and Viewer instantly
- **Dark Mode** — full dark theme toggle with smooth transition
- **LocalStorage Persistence** — transactions, role, and dark mode preference all survive page refresh
- **Responsive Design** — works cleanly on mobile, tablet, and desktop
- **Keyboard Accessibility** — Escape closes modals, click-outside dismisses dialogs

---

## 🛠️ Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Framework | React 18 | Component-based UI, hooks-first approach |
| Build Tool | Vite 5 | Instant HMR, fast production builds |
| Styling | Tailwind CSS v3 | Utility-first, consistent spacing and design system |
| Charts | Recharts | Composable, React-native chart primitives |
| Icons | Lucide React | Clean, consistent, tree-shakeable icon set |
| Date Handling | date-fns | Lightweight, modular date utilities |
| State Management | React Context + useReducer | No external library needed at this scale |
| Fonts | DM Sans + JetBrains Mono | Professional readability, not generic defaults |
| Persistence | localStorage | Zero-config, no backend required |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm 8 or higher

### Installation

```bash
# Step 1 — Clone or extract the project
cd finance-dashboard

# Step 2 — Install all dependencies
npm install

# Step 3 — Start the development server
npm run dev
```

Open your browser at:
```
http://localhost:5173
```

### Production Build

```bash
# Build optimized files into /dist
npm run build

# Preview the production build locally
npm run preview
```


## 📂 Sample Data

The app ships with **40+ pre-loaded transactions** spread across the last 3 months, covering categories like:

| Category | Type |
|---|---|
| Salary, Freelance, Investment | Income |
| Food & Dining, Transport, Shopping | Expense |
| Health, Entertainment, Utilities | Expense |
| Rent, Education | Expense |

This ensures the dashboard, charts, and insights all look meaningful from the very first launch.

To reset back to sample data: switch to **Admin** → bottom of the sidebar → **"Reset sample data"**

---

## 🎨 Design System

The UI is built on a consistent design token system defined in `tailwind.config.js` and `index.css`.

### Color Palette
| Token | Usage |
|---|---|
| `brand-600` | Primary actions, active nav, badges |
| `slate-900` | Primary text (light mode) |
| `slate-500` | Secondary / muted text |
| `emerald` | Income, positive trends |
| `rose / red` | Expenses, negative trends, delete |
| `amber` | Warnings, neutral observations |

### Reusable CSS Classes
```css
.card          /* White panel with border and subtle shadow */
.btn-primary   /* Green filled action button */
.btn-secondary /* Ghost button with border */
.btn-danger    /* Red tinted destructive button */
.input         /* Styled form input with focus ring */
.label         /* Small form field label */
.badge-income  /* Green pill for income type */
.badge-expense /* Red pill for expense type */
.nav-link      /* Sidebar navigation item */
```

---

## 🖼️ Adding Your Profile Photo

**Option A — Image in `public/` folder (recommended)**
```jsx
// In Navbar.jsx — no import needed
<img src="/your-photo.png" alt="Profile" className="w-7 h-7 rounded-full object-cover" />
```

**Option B — Image in `src/assets/` folder**
```jsx
// In Navbar.jsx — import at the top
import myPhoto from '../assets/your-photo.png'

<img src={myPhoto} alt="Profile" className="w-7 h-7 rounded-full object-cover" />
```

---

## 🧠 How Insights Work

The insights are fully calculated from your real transaction data — nothing is hardcoded.

```
Savings Rate    = (Total Income − Total Expenses) / Total Income × 100
Expense Change  = (This Month Expense − Last Month Expense) / Last Month Expense × 100
Income Change   = (This Month Income − Last Month Income) / Last Month Income × 100
Average Expense = Total Expenses / Number of Expense Transactions
Top Category    = Category with highest total expense amount
```

Observations are generated based on thresholds — for example, if expense change exceeds 20%, it flags it as a warning. If savings rate is above 30%, it recognizes it as healthy.

---

## 📦 Key Implementation Details

- **No prop drilling** — all shared state flows through `FinanceContext`
- **Memoized calculations** — `useStats` wraps everything in `useMemo` so charts don't recalculate on unrelated renders
- **Keyboard-accessible modals** — Escape key closes them, clicking the backdrop dismisses them, scroll is locked while open
- **Hover-reveal pattern** — edit/delete buttons in the table use `opacity-0 group-hover:opacity-100` for a clean professional look
- **Vite asset handling** — images in `src/assets/` must be imported; images in `public/` can be referenced by path string directly

---

## 📄 License

MIT License — free to use, modify, and distribute for personal or commercial projects.

---

<div align="center">

Built with ❤️ using React + Vite + Tailwind CSS

</div>
git  
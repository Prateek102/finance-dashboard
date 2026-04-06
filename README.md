# FinTrack — Personal Finance Dashboard

A clean, production-grade personal finance dashboard built with React, Vite, and Tailwind CSS.

## Features
- Dashboard overview with summary cards, charts, recent transactions
- Full CRUD transaction table with search, filters, export (CSV/JSON)
- Role-based access control: Admin (full access) vs Viewer (read-only)
- Dark mode with localStorage persistence
- Auto-generated financial insights and observations
- Recharts: monthly bar chart + expense donut chart

## Tech Stack
- React 18 + Vite
- Tailwind CSS v3
- Recharts
- Lucide React (icons)
- date-fns


## Setup
```bash
npm install
npm run dev
```

Open http://localhost:5173

## RBAC
Switch roles from the navbar dropdown. Admin can add/edit/delete transactions. Viewer is read-only.

## Notes
- Max transaction amount: ₹10,000 (enforced in form validation)
- All amounts in Indian Rupees (INR)
- Data persists in localStorage

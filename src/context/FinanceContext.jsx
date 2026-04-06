import { createContext, useContext, useReducer, useEffect, useState } from 'react'
import { INITIAL_TRANSACTIONS } from '../data/transactions'

const FinanceContext = createContext(null)

const STORAGE_KEY = 'fintrack_transactions'
const ROLE_KEY = 'fintrack_role'
const DARK_KEY = 'fintrack_dark'

function txReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [action.payload, ...state]
    case 'UPDATE':
      return state.map(t => t.id === action.payload.id ? action.payload : t)
    case 'DELETE':
      return state.filter(t => t.id !== action.payload)
    case 'LOAD':
      return action.payload
    default:
      return state
  }
}

export function FinanceProvider({ children }) {
  const savedTx = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : INITIAL_TRANSACTIONS
    } catch { return INITIAL_TRANSACTIONS }
  }

  const [transactions, dispatch] = useReducer(txReducer, [], savedTx)
  const [role, setRole] = useState(() => localStorage.getItem(ROLE_KEY) || 'admin')
  const [dark, setDark] = useState(() => localStorage.getItem(DARK_KEY) === 'true')
  const [activeView, setActiveView] = useState('dashboard')
  const [filters, setFilters] = useState({ category: '', type: '', search: '' })

  // persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem(ROLE_KEY, role)
  }, [role])

  useEffect(() => {
    localStorage.setItem(DARK_KEY, String(dark))
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [dark])

  const addTransaction = (data) => {
    const tx = { ...data, id: String(Date.now()) }
    dispatch({ type: 'ADD', payload: tx })
  }

  const updateTransaction = (data) => {
    dispatch({ type: 'UPDATE', payload: data })
  }

  const deleteTransaction = (id) => {
    dispatch({ type: 'DELETE', payload: id })
  }

  const resetData = () => {
    dispatch({ type: 'LOAD', payload: INITIAL_TRANSACTIONS })
  }

  const isAdmin = role === 'admin'

  return (
    <FinanceContext.Provider value={{
      transactions, addTransaction, updateTransaction, deleteTransaction, resetData,
      role, setRole, isAdmin,
      dark, setDark,
      activeView, setActiveView,
      filters, setFilters,
    }}>
      {children}
    </FinanceContext.Provider>
  )
}

export const useFinance = () => {
  const ctx = useContext(FinanceContext)
  if (!ctx) throw new Error('useFinance must be inside FinanceProvider')
  return ctx
}

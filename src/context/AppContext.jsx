import { useReducer, useEffect, useState } from 'react';
import { INITIAL_TRANSACTIONS } from '../data/transactions';
import { AppContext } from './appContext';

const STORAGE_KEY = 'finboard_transactions';
const THEME_KEY = 'finboard_theme';

function transactionsReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [action.payload, ...state];
    case 'UPDATE':
      return state.map(t => t.id === action.payload.id ? action.payload : t);
    case 'DELETE':
      return state.filter(t => t.id !== action.payload);
    case 'SET':
      return action.payload;
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || 'dark';
  });

  const [role, setRole] = useState('admin');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    type: 'all',
    dateFrom: '',
    dateTo: '',
  });

  const [transactions, dispatch] = useReducer(transactionsReducer, [], () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.className = theme === 'light' ? 'light' : '';
  }, [theme]);

  function addTransaction(data) {
    const id = `txn_${Date.now()}`;
    dispatch({ type: 'ADD', payload: { ...data, id } });
  }

  function updateTransaction(data) {
    dispatch({ type: 'UPDATE', payload: data });
  }

  function deleteTransaction(id) {
    dispatch({ type: 'DELETE', payload: id });
  }

  function resetData() {
    dispatch({ type: 'SET', payload: INITIAL_TRANSACTIONS });
  }

  const isAdmin = role === 'admin';

  return (
    <AppContext.Provider value={{
      theme, setTheme,
      role, setRole, isAdmin,
      activeSection, setActiveSection,
      sidebarOpen, setSidebarOpen,
      transactions,
      addTransaction, updateTransaction, deleteTransaction, resetData,
      filters, setFilters,
    }}>
      {children}
    </AppContext.Provider>
  );
}

import { LayoutDashboard, ArrowLeftRight, Lightbulb, RotateCcw } from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',     icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions',  icon: ArrowLeftRight },
  { id: 'insights',     label: 'Insights',      icon: Lightbulb },
]

export default function Sidebar() {
  const { activeView, setActiveView, resetData, isAdmin } = useFinance()

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-[220px] bg-white dark:bg-[#161b22] border-r border-slate-200 dark:border-slate-800 flex flex-col z-20">
      <nav className="flex-1 p-3 space-y-0.5">
        <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600">Menu</p>
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveView(id)}
            className={`w-full nav-link ${activeView === id ? 'nav-link-active' : ''}`}
          >
            <Icon size={16} strokeWidth={activeView === id ? 2.5 : 1.8} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        {isAdmin && (
          <button
            onClick={resetData}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors"
          >
            <RotateCcw size={12} />
            Reset sample data
          </button>
        )}
        <div className="mt-2 px-3 py-2">
          <div className="text-[10px] text-slate-400 dark:text-slate-600">FinTrack v1.0</div>
          <div className="text-[10px] text-slate-400 dark:text-slate-600">Personal Finance Manager</div>
        </div>
      </div>
    </aside>
  )
}

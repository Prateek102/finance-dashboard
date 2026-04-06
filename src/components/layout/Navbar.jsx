import { Moon, Sun, Shield, Eye, ChevronDown, Zap } from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import { useState, useRef, useEffect } from 'react'


export default function Navbar() {
  const { role, setRole, dark, setDark } = useFinance()
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-14 bg-white dark:bg-[#161b22] border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-4">
      {/* Logo */}
      <div className="flex items-center gap-2 min-w-[200px]">
        <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
          <Zap size={14} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="font-semibold text-slate-900 dark:text-white tracking-tight">FinTrack</span>
      </div>

      <div className="flex-1" />

      {/* Role Switcher */}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(p => !p)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          {role === 'admin'
            ? <Shield size={13} className="text-brand-600" />
            : <Eye size={13} className="text-slate-500" />
          }
          <span className="capitalize">{role}</span>
          <ChevronDown size={12} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-1.5 w-44 card overflow-hidden py-1 animate-[fadeIn_.15s_ease]">
            {[
              { value: 'admin', label: 'Admin', sub: 'Full access', icon: Shield, color: 'text-brand-600' },
              { value: 'viewer', label: 'Viewer', sub: 'Read only', icon: Eye, color: 'text-slate-400' },
            ].map(({ value, label, sub, icon: Icon, color }) => (
              <button
                key={value}
                onClick={() => { setRole(value); setOpen(false) }}
                className={`w-full flex items-start gap-3 px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${role === value ? 'bg-slate-50 dark:bg-slate-800/60' : ''}`}
              >
                <Icon size={14} className={`mt-0.5 flex-shrink-0 ${color}`} />
                <div>
                  <div className="font-medium text-slate-900 dark:text-slate-100 leading-none mb-0.5">{label}</div>
                  <div className="text-xs text-slate-500">{sub}</div>
                </div>
                {role === value && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500 mt-1" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Dark toggle */}
      <button
        onClick={() => setDark(d => !d)}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        title="Toggle dark mode"
      >
        {dark ? <Sun size={15} /> : <Moon size={15} />}
      </button>




      {/* Avatar */}
     <img
      src="Prateek_img.png"
      alt="Prateek"
      className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-2 ring-brand-500/30"
/>
   
    </header>
  )
}

import { Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import { useFinance } from '../../context/FinanceContext'

export default function DeleteConfirm({ tx, onClose }) {
  const { deleteTransaction } = useFinance()

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleDelete = () => {
    deleteTransaction(tx.id)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-[2px]" />
      <div className="relative w-full max-w-sm card p-6 shadow-modal animate-[scaleIn_.15s_ease]">
        <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center mb-4">
          <Trash2 size={18} className="text-red-500" />
        </div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Delete transaction?</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
          <span className="font-medium text-slate-700 dark:text-slate-300">"{tx.description}"</span> will be permanently removed.
        </p>
        <p className="text-xs text-slate-400 mb-6">This action cannot be undone.</p>
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleDelete} className="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>
  )
}

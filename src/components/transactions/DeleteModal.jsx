import Modal from '../ui/Modal';
import { AlertTriangle } from 'lucide-react';

export default function DeleteModal({ open, onClose, onConfirm, transaction }) {
  return (
    <Modal open={open} onClose={onClose} title="Delete Transaction">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: 'var(--accent-red-dim)' }}>
          <AlertTriangle size={22} style={{ color: 'var(--accent-red)' }} />
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Are you sure?
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            This will permanently remove{' '}
            <span style={{ color: 'var(--text-secondary)' }}>
              "{transaction?.description || transaction?.category}"
            </span>{' '}
            from your records.
          </p>
        </div>
        <div className="flex gap-2 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg text-xs font-medium"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="flex-1 py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
            style={{ background: 'var(--accent-red)', color: '#fff' }}
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}

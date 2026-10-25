import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

/**
 * Toast Component
 * Displays temporary toast feedback when actions succeed or fail.
 */
export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isError = type === 'error';

  return (
    <div className={`toast-notification ${isError ? 'error' : 'success'}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        {isError ? (
          <AlertCircle size={18} color="#f43f5e" />
        ) : (
          <CheckCircle2 size={18} color="#10b981" />
        )}
        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{message}</span>
      </div>
      <button className="icon-btn" onClick={onClose} style={{ padding: '0.2rem' }}>
        <X size={16} />
      </button>
    </div>
  );
}

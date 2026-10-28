import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString();
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container" role="region" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
          >
            {toast.type === 'success' && (
              <CheckCircle2 size={18} className="text-success" style={{ color: 'var(--color-success)', flexShrink: 0 }} />
            )}
            {toast.type === 'error' && (
              <AlertCircle size={18} className="text-danger" style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
            )}
            {toast.type === 'info' && (
              <Info size={18} className="text-accent" style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
            )}
            <div style={{ flex: 1 }}>{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ color: 'var(--color-text-subtle)', cursor: 'pointer', padding: 0 }}
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

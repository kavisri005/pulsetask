import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { ToastMessage, ToastType } from '../types/todo';

interface ToastContextValue {
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastType, description?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  toast: {
    success: (message: string, description?: string) => void;
    error: (message: string, description?: string) => void;
    info: (message: string, description?: string) => void;
    warning: (message: string, description?: string) => void;
  };
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', description?: string, duration: number = 3500) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newToast: ToastMessage = { id, message, type, description, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const toast = useMemo(
    () => ({
      success: (msg: string, desc?: string) => addToast(msg, 'success', desc),
      error: (msg: string, desc?: string) => addToast(msg, 'error', desc),
      info: (msg: string, desc?: string) => addToast(msg, 'info', desc),
      warning: (msg: string, desc?: string) => addToast(msg, 'warning', desc),
    }),
    [addToast]
  );

  const contextValue = useMemo(
    () => ({
      toasts,
      addToast,
      removeToast,
      toast,
    }),
    [toasts, addToast, removeToast, toast]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

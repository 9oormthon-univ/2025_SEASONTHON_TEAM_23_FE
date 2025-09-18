import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface ToastItem {
  id: string;
  message: string;
  title?: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onPress?: () => void;
  actionLabel?: string;
  onActionPress?: () => void;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (
    message: string,
    type?: 'success' | 'error' | 'info',
    duration?: number,
    options?: {
      title?: string;
      onPress?: () => void;
      actionLabel?: string;
      onActionPress?: () => void;
    }
  ) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    (
      message: string,
      type: 'success' | 'error' | 'info' = 'info',
      duration = 3000,
      options?: {
        title?: string;
        onPress?: () => void;
        actionLabel?: string;
        onActionPress?: () => void;
      }
    ) => {
      const id = Date.now().toString();
      const newToast: ToastItem = {
        id,
        message,
        type,
        duration,
        ...options,
      };
      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
};

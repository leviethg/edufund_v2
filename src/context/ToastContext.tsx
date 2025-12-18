import React, { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[200] space-y-2 flex flex-col items-end pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`pointer-events-auto min-w-[300px] max-w-sm p-4 rounded-xl shadow-lg border-l-4 transform transition-all animate-fade-in-up cursor-pointer flex items-center justify-between
              ${toast.type === 'success' ? 'bg-white border-accent text-gray-800' : ''}
              ${toast.type === 'error' ? 'bg-white border-red-500 text-gray-800' : ''}
              ${toast.type === 'info' ? 'bg-white border-primary text-gray-800' : ''}
            `}
          >
             <div className="flex items-center gap-3">
               <span className="text-xl">
                 {toast.type === 'success' && '✅'}
                 {toast.type === 'error' && '⚠️'}
                 {toast.type === 'info' && 'ℹ️'}
               </span>
               <p className="text-sm font-medium">{toast.message}</p>
             </div>
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
import React, { createContext, useCallback, useContext, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

const ToastContext = createContext(null);

let idCounter = 0;

export const ToastProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const show = useCallback((toast) => {
    const id = ++idCounter;
    setItems((prev) => [...prev, { id, ...toast }]);
    if (toast.duration !== 0) {
      setTimeout(
        () =>
          setItems((prev) =>
            prev.filter((item) => item.id !== id)
          ),
        toast.duration || 3000
      );
    }
  }, []);

  const remove = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 top-16 z-40 flex justify-center px-4"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="flex w-full max-w-sm flex-col gap-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                'pointer-events-auto flex items-start gap-2 rounded-lg border px-3 py-2 text-xs shadow-lg backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                item.variant === 'error'
                  ? 'border-red-200 bg-red-50/90 text-red-800 dark:border-red-900 dark:bg-red-950/80 dark:text-red-100'
                  : item.variant === 'success'
                  ? 'border-emerald-200 bg-emerald-50/90 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-100'
                  : 'border-gray-200 bg-white/90 text-gray-800 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-gray-100'
              )}
              tabIndex={0}
              role="alert"
              aria-label={item.title || 'Notification'}
            >
              <div className="flex-1">
                {item.title && (
                  <p className="font-medium leading-snug">{item.title}</p>
                )}
                {item.description && (
                  <p className="mt-0.5 text-[11px] leading-snug">
                    {item.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="ml-1 mt-0.5 rounded p-0.5 text-gray-400 hover:bg-black/5 hover:text-gray-600 dark:hover:bg-white/5 dark:hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                aria-label="Close notification"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
};



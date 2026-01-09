import React from 'react';
import { cn } from '../../utils/cn';

// Lightweight accessible dialog used for confirmations and simple flows.
export const Dialog = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-4 text-sm shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export const DialogHeader = ({ className, ...props }) => (
  <div
    className={cn('mb-2 flex items-start justify-between gap-2', className)}
    {...props}
  />
);

export const DialogTitle = ({ className, ...props }) => (
  <h2
    className={cn(
      'text-sm font-semibold text-gray-900 dark:text-gray-50',
      className
    )}
    {...props}
  />
);

export const DialogDescription = ({ className, ...props }) => (
  <p
    className={cn('text-xs text-gray-600 dark:text-gray-300', className)}
    {...props}
  />
);



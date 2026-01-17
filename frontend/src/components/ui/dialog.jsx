import React from 'react';
import { cn } from '../../utils/cn';

// Lightweight accessible dialog used for confirmations and simple flows.
// Lightweight accessible dialog used for confirmations and simple flows.
export const Dialog = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-border bg-background p-6 shadow-xl animate-fade-in-up sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export const DialogHeader = ({ className, ...props }) => (
  <div
    className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}
    {...props}
  />
);

export const DialogTitle = ({ className, ...props }) => (
  <h2
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
);

export const DialogDescription = ({ className, ...props }) => (
  <p
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
);



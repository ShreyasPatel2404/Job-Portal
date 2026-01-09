import React from 'react';
import { cn } from '../../utils/cn';

export const Badge = ({ className, variant = 'default', ...props }) => {
  const base =
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors';

  const variants = {
    default:
      'border-transparent bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',
    secondary:
      'border-transparent bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-200',
    outline:
      'border-gray-300 text-gray-700 dark:border-zinc-700 dark:text-gray-200',
    success:
      'border-transparent bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    warning:
      'border-transparent bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    destructive:
      'border-transparent bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    <span className={cn(base, variants[variant], className)} {...props} />
  );
};



import React from 'react';
import { cn } from '../../utils/cn';

export const Progress = ({ value = 0, className }) => {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      role="progressbar"
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800',
        className
      )}
    >
      <div
        className="h-full w-full flex-1 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600 transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${100 - clamped}%)` }}
      />
    </div>
  );
};



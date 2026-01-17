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
        'relative h-2 w-full overflow-hidden rounded-full bg-secondary',
        className
      )}
    >
      <div
        className="h-full w-full flex-1 bg-primary transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${100 - clamped}%)` }}
      />
    </div>
  );
};



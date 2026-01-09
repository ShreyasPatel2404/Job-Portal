import React from 'react';
import { cn } from '../../utils/cn';

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200/80 dark:bg-zinc-800',
        className
      )}
      {...props}
    />
  );
};



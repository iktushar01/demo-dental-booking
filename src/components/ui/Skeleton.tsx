import React from 'react';
import { cn } from '../../lib/utils';

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-neutral-200/80 dark:bg-neutral-800',
        className
      )}
      {...props}
    />
  );
};

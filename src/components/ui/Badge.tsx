import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'subtle' | 'dot';
  dotColor?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'subtle',
  dotColor,
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-medium tracking-tight',
        variant === 'subtle' &&
          'px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-200/80 dark:border-neutral-700/80',
        variant === 'outline' &&
          'px-2 py-0.5 rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300',
        variant === 'dot' && 'text-neutral-700 dark:text-neutral-300',
        className
      )}
      {...props}
    >
      {dotColor && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColor)}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};

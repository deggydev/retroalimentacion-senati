import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon } from '@iconify/react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  children?: ReactNode;
}

const variants = {
  primary: 'bg-senati hover:bg-senati-dark text-white shadow-sm',
  secondary: 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200',
  danger: 'bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400',
  success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm',
  ghost: 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300',
};

const sizes = {
  sm: 'px-2 py-1 text-xs gap-1',
  md: 'px-3 py-2 text-sm gap-2',
  lg: 'px-4 py-3 text-base gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-senati focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <Icon icon={icon} className={size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base'} />}
      {children}
    </button>
  );
}

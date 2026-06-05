import type { InputHTMLAttributes } from 'react';
import { Icon } from '@iconify/react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
  label?: string;
}

export function Input({ icon, label, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon icon={icon} className="text-gray-400" />
          </div>
        )}
        <input
          className={`w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-senati focus:border-transparent transition-shadow ${icon ? 'pl-10' : ''} ${className}`}
          {...props}
        />
      </div>
    </div>
  );
}

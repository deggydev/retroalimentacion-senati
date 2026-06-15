import type { ReactNode } from 'react';
import { Icon } from '@iconify/react';

interface CardProps {
  title: string;
  icon: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
}

export function Card({ title, icon, children, className = '', headerAction }: CardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden ${className}`}>
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon icon={icon} className="text-xl text-senati" />
            <h2 className="font-semibold text-gray-800 dark:text-white">{title}</h2>
          </div>
          {headerAction}
        </div>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

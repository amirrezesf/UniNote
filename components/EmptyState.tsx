import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState: React.FC<{ icon?: any; title: string; description?: string; children?: React.ReactNode }> = ({
  icon: Icon = Inbox,
  title,
  description,
  children,
}) => (
  <div className="bg-white dark:bg-gray-800 border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-3xl p-12 text-center">
    <Icon className="mx-auto text-slate-300 dark:text-gray-600 mb-4" size={56} />
    <h3 className="text-lg font-bold text-slate-800 dark:text-gray-100 mb-2">{title}</h3>
    {description && <p className="text-slate-500 dark:text-gray-400 max-w-md mx-auto mb-6">{description}</p>}
    {children}
  </div>
);

export default EmptyState;
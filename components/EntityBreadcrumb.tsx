import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Home } from 'lucide-react';

export interface Crumb {
  label: string;
  to?: string;
}

/** Directory breadcrumb: University → Field → Teacher → Course → Material. RTL-aware. */
const EntityBreadcrumb: React.FC<{ items: Crumb[] }> = ({ items }) => (
  <nav className="flex items-center flex-wrap gap-1 text-sm text-slate-500 dark:text-gray-500 mb-6" aria-label="breadcrumb">
    <Link to="/browse" className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
      <Home size={15} />
      کاوش
    </Link>
    {items.map((item, i) => (
      <React.Fragment key={i}>
        <ChevronLeft size={15} className="text-slate-300 dark:text-gray-600" />
        {item.to && i < items.length - 1 ? (
          <Link to={item.to} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{item.label}</Link>
        ) : (
          <span className="text-slate-800 font-medium dark:text-gray-200">{item.label}</span>
        )}
      </React.Fragment>
    ))}
  </nav>
);

export default EntityBreadcrumb;
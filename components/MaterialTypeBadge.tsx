import React from 'react';
import { MaterialType } from '../types';
import { FileText, ClipboardList, StickyNote, Presentation, PencilRuler } from 'lucide-react';

const MATERIAL_TYPE_LABELS: Record<MaterialType, string> = {
  HANDOUT: 'جزوه',
  EXAM: 'نمونه سوال',
  NOTE: 'یادداشت',
  SLIDE: 'اسلاید',
  ASSIGNMENT: 'تمرین',
};

const CONFIG: Record<MaterialType, { color: string; icon: any; darkColor: string }> = {
  HANDOUT: { color: 'bg-blue-50 text-blue-700 border-blue-100', darkColor: 'dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50', icon: FileText },
  EXAM: { color: 'bg-red-50 text-red-700 border-red-100', darkColor: 'dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50', icon: ClipboardList },
  NOTE: { color: 'bg-amber-50 text-amber-700 border-amber-100', darkColor: 'dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50', icon: StickyNote },
  SLIDE: { color: 'bg-purple-50 text-purple-700 border-purple-100', darkColor: 'dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/50', icon: Presentation },
  ASSIGNMENT: { color: 'bg-emerald-50 text-emerald-700 border-emerald-100', darkColor: 'dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/50', icon: PencilRuler },
};

const MaterialTypeBadge: React.FC<{ type: MaterialType; size?: 'sm' | 'md'; withIcon?: boolean }> = ({
  type,
  size = 'sm',
  withIcon = true,
}) => {
  const { color, darkColor, icon: Icon } = CONFIG[type];
  const sizing = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5';
  return (
    <span className={`inline-flex items-center gap-1 rounded-lg font-bold border ${color} ${darkColor} ${sizing}`}>
      {withIcon && <Icon size={size === 'sm' ? 12 : 16} />}
      {MATERIAL_TYPE_LABELS[type]}
    </span>
  );
};

export default MaterialTypeBadge;
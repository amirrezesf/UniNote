import React from 'react';
import { MaterialType } from '../types';
import { MATERIAL_TYPE_LABELS } from '../constants';
import { FileText, ClipboardList, StickyNote, Presentation, PencilRuler } from 'lucide-react';

const CONFIG: Record<MaterialType, { color: string; icon: any }> = {
  HANDOUT: { color: 'bg-blue-50 text-blue-700 border-blue-100', icon: FileText },
  EXAM: { color: 'bg-red-50 text-red-700 border-red-100', icon: ClipboardList },
  NOTE: { color: 'bg-amber-50 text-amber-700 border-amber-100', icon: StickyNote },
  SLIDE: { color: 'bg-purple-50 text-purple-700 border-purple-100', icon: Presentation },
  ASSIGNMENT: { color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: PencilRuler },
};

const MaterialTypeBadge: React.FC<{ type: MaterialType; size?: 'sm' | 'md'; withIcon?: boolean }> = ({
  type,
  size = 'sm',
  withIcon = true,
}) => {
  const { color, icon: Icon } = CONFIG[type];
  const sizing = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5';
  return (
    <span className={`inline-flex items-center gap-1 rounded-lg font-bold border ${color} ${sizing}`}>
      {withIcon && <Icon size={size === 'sm' ? 12 : 16} />}
      {MATERIAL_TYPE_LABELS[type]}
    </span>
  );
};

export default MaterialTypeBadge;

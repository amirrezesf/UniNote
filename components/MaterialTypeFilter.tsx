import React from 'react';
import { MaterialType } from '../types';
import { MATERIAL_TYPE_LABELS } from '../constants';

const ALL_TYPES: MaterialType[] = ['HANDOUT', 'EXAM', 'NOTE', 'SLIDE', 'ASSIGNMENT'];

/** Horizontal pill row for filtering a material list by type. `null` = همه. */
const MaterialTypeFilter: React.FC<{
  value: MaterialType | null;
  onChange: (t: MaterialType | null) => void;
  counts?: Partial<Record<MaterialType, number>>;
  total?: number;
}> = ({ value, onChange, counts, total }) => {
  const pill = (active: boolean) =>
    `px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors border ${
      active ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
    }`;

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button onClick={() => onChange(null)} className={pill(value === null)}>
        همه{total !== undefined ? ` (${total})` : ''}
      </button>
      {ALL_TYPES.map(t => (
        <button key={t} onClick={() => onChange(t)} className={pill(value === t)}>
          {MATERIAL_TYPE_LABELS[t]}{counts && counts[t] !== undefined ? ` (${counts[t]})` : ''}
        </button>
      ))}
    </div>
  );
};

export default MaterialTypeFilter;

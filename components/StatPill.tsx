import React from 'react';

const StatPill: React.FC<{ icon: any; value: React.ReactNode; label: string; color?: string }> = ({
  icon: Icon,
  value,
  label,
  color = 'bg-blue-100 text-blue-600',
}) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon size={22} />
    </div>
    <div className="min-w-0">
      <p className="text-xl font-bold text-slate-800 leading-tight">{value}</p>
      <p className="text-xs text-slate-500 font-medium truncate">{label}</p>
    </div>
  </div>
);

export default StatPill;

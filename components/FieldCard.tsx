import React from 'react';
import { Link } from 'react-router-dom';
import { Field } from '../types';
import { Layers, GraduationCap, FileText } from 'lucide-react';

interface FieldCardProps {
  field: Field;
  teacherCount?: number;
  courseCount?: number;
  materialCount?: number;
}

const FieldCard: React.FC<FieldCardProps> = ({ field, teacherCount = 0, courseCount = 0, materialCount = 0 }) => {
  return (
    <Link
      to={`/field/${field.id}`}
      className="group bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-blue-300 transition-all flex items-center gap-4"
    >
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
        <Layers size={26} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors mb-2">{field.name}</h3>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1"><GraduationCap size={13} /> {teacherCount} استاد</span>
          <span className="flex items-center gap-1"><FileText size={13} /> {materialCount} منبع</span>
          <span className="hidden sm:flex items-center gap-1">{courseCount} درس</span>
        </div>
      </div>
    </Link>
  );
};

export default FieldCard;
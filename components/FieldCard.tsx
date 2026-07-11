import React from 'react';
import { Link } from 'react-router-dom';
import { Field } from '../types';
import { getTeachersByField, getCoursesByField, getMaterialsByField } from '../constants';
import { Layers, GraduationCap, FileText } from 'lucide-react';

const FieldCard: React.FC<{ field: Field }> = ({ field }) => {
  const teachers = getTeachersByField(field.id).length;
  const courses = getCoursesByField(field.id).length;
  const materials = getMaterialsByField(field.id).length;

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
          <span className="flex items-center gap-1"><GraduationCap size={13} /> {teachers} استاد</span>
          <span className="flex items-center gap-1"><FileText size={13} /> {materials} منبع</span>
          <span className="hidden sm:flex items-center gap-1">{courses} درس</span>
        </div>
      </div>
    </Link>
  );
};

export default FieldCard;

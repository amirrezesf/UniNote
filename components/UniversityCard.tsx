import React from 'react';
import { Link } from 'react-router-dom';
import { University } from '../types';
import { getTeachersByUniversity, getCoursesByUniversity } from '../constants';
import { Building2, GraduationCap, BookOpen } from 'lucide-react';

const UniversityCard: React.FC<{ university: University }> = ({ university }) => {
  const teachers = getTeachersByUniversity(university.id).length;
  const courses = getCoursesByUniversity(university.id).length;

  return (
    <Link
      to={`/university/${university.id}`}
      className="group bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-blue-300 transition-all flex items-center gap-4"
    >
      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
        {university.logoUrl ? (
          <img src={university.logoUrl} alt={university.name} className="w-full h-full object-cover" />
        ) : (
          <Building2 size={26} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{university.name}</h3>
        {university.city && <p className="text-xs text-slate-500 mb-2">{university.city}</p>}
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1"><GraduationCap size={13} /> {teachers} استاد</span>
          <span className="flex items-center gap-1"><BookOpen size={13} /> {courses} درس</span>
        </div>
      </div>
    </Link>
  );
};

export default UniversityCard;

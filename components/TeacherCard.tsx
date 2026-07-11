import React from 'react';
import { Link } from 'react-router-dom';
import { Teacher } from '../types';
import { getUniversityById, getFieldById, getMaterialsByTeacher, getCoursesByTeacher } from '../constants';
import { BadgeCheck, BookOpen, FileText } from 'lucide-react';

const TeacherCard: React.FC<{ teacher: Teacher }> = ({ teacher }) => {
  const university = getUniversityById(teacher.universityId);
  const courses = getCoursesByTeacher(teacher.id).length;
  const materials = getMaterialsByTeacher(teacher.id).length;

  return (
    <Link
      to={`/teacher/${teacher.id}`}
      className="group bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-blue-300 transition-all flex flex-col h-full"
    >
      <div className="flex items-center gap-3 mb-3">
        <img
          src={teacher.avatarUrl || `https://picsum.photos/seed/${teacher.id}/200`}
          alt={teacher.name}
          className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
        />
        <div className="min-w-0">
          <h3 className="font-bold text-slate-900 flex items-center gap-1 group-hover:text-blue-600 transition-colors">
            <span className="truncate">{teacher.name}</span>
            {teacher.isVerified && <BadgeCheck size={16} className="text-blue-600 fill-blue-100 flex-shrink-0" />}
          </h3>
          {university && <p className="text-xs text-slate-500 truncate">{university.name}</p>}
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {teacher.fieldIds.map(fid => {
          const f = getFieldById(fid);
          return f ? (
            <span key={fid} className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md font-medium">{f.name}</span>
          ) : null;
        })}
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-400 mt-auto pt-3 border-t border-slate-100">
        <span className="flex items-center gap-1"><BookOpen size={13} /> {courses} درس</span>
        <span className="flex items-center gap-1"><FileText size={13} /> {materials} منبع</span>
      </div>
    </Link>
  );
};

export default TeacherCard;

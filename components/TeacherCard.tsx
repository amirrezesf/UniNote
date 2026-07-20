import React from 'react';
import { Link } from 'react-router-dom';
import { Teacher } from '../types';
import { BadgeCheck, BookOpen, FileText } from 'lucide-react';

interface TeacherCardProps {
  teacher: Teacher;
  universityName?: string;
  fieldNames?: string[];
  courseCount?: number;
  materialCount?: number;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher, universityName, fieldNames = [], courseCount = 0, materialCount = 0 }) => {
  return (
    <Link
      to={`/teacher/${teacher.id}`}
      className="group bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 p-5 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col h-full"
    >
      <div className="flex items-center gap-3 mb-3">
        <img
          src={teacher.avatarUrl || `https://picsum.photos/seed/${teacher.id}/200`}
          alt={teacher.name}
          className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
        />
        <div className="min-w-0">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            <span className="truncate">{teacher.name}</span>
            {teacher.isVerified && <BadgeCheck size={16} className="text-blue-600 fill-blue-100 dark:fill-blue-900/50 flex-shrink-0" />}
          </h3>
          {universityName && <p className="text-xs text-slate-500 dark:text-gray-400 truncate">{universityName}</p>}
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {fieldNames.map((fid, idx) => (
          <span key={idx} className="text-xs px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-md font-medium">{fid}</span>
        ))}
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-gray-500 mt-auto pt-3 border-t border-slate-100 dark:border-gray-700">
        <span className="flex items-center gap-1"><BookOpen size={13} /> {courseCount} درس</span>
        <span className="flex items-center gap-1"><FileText size={13} /> {materialCount} منبع</span>
      </div>
    </Link>
  );
};

export default TeacherCard;
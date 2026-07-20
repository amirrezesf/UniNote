import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../types';
import { BookOpen, FileText, BadgeCheck } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  teacherName?: string;
  teacherVerified?: boolean;
  fieldName?: string;
  materialCount?: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, teacherName, teacherVerified, fieldName, materialCount = 0 }) => {
  return (
    <Link
      to={`/course/${course.id}`}
      className="group bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 p-5 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
          <BookOpen size={22} />
        </div>
        {course.code && <span className="text-xs font-mono text-slate-400 dark:text-gray-500 bg-slate-50 dark:bg-gray-700 px-2 py-1 rounded">{course.code}</span>}
      </div>
      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">{course.title}</h3>
      {fieldName && <span className="text-xs text-indigo-600 dark:text-indigo-400 mb-2">{fieldName}</span>}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 dark:border-gray-700 text-xs text-slate-400 dark:text-gray-500">
        {teacherName ? (
          <span className="flex items-center gap-1 text-slate-500 dark:text-gray-400">
            {teacherName}
            {teacherVerified && <BadgeCheck size={12} className="text-blue-600 fill-blue-100 dark:fill-blue-900/50" />}
          </span>
        ) : <span />}
        <span className="flex items-center gap-1"><FileText size={13} /> {materialCount} منبع</span>
      </div>
    </Link>
  );
};

export default CourseCard;
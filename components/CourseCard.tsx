import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../types';
import { getTeacherById, getFieldById, getMaterialsByCourse } from '../constants';
import { BookOpen, FileText, BadgeCheck } from 'lucide-react';

const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  const teacher = getTeacherById(course.teacherId);
  const field = getFieldById(course.fieldId);
  const materials = getMaterialsByCourse(course.id).length;

  return (
    <Link
      to={`/course/${course.id}`}
      className="group bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-blue-300 transition-all flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
          <BookOpen size={22} />
        </div>
        {course.code && <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">{course.code}</span>}
      </div>
      <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">{course.title}</h3>
      {field && <span className="text-xs text-indigo-600 mb-2">{field.name}</span>}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 text-xs text-slate-400">
        {teacher ? (
          <span className="flex items-center gap-1 text-slate-500">
            {teacher.name}
            {teacher.isVerified && <BadgeCheck size={12} className="text-blue-600 fill-blue-100" />}
          </span>
        ) : <span />}
        <span className="flex items-center gap-1"><FileText size={13} /> {materials} منبع</span>
      </div>
    </Link>
  );
};

export default CourseCard;

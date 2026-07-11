import React from 'react';
import { Link } from 'react-router-dom';
import { Material } from '../types';
import { Star, BadgeCheck } from 'lucide-react';
import { UserRole } from '../types';
import { getTeacherById } from '../constants';
import MaterialTypeBadge from './MaterialTypeBadge';

/** Full card used in grids (Dashboard, Teacher, Field, Course pages). */
const MaterialCard: React.FC<{ material: Material; showTeacher?: boolean }> = ({ material, showTeacher }) => {
  const isVerifiedUploader = material.uploader.role === UserRole.INSTRUCTOR;
  const teacher = showTeacher ? getTeacherById(material.teacherId) : undefined;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-300 flex flex-col h-full relative">
      <Link to={`/material/${material.id}`} className="absolute inset-0 z-0" aria-label={material.title}></Link>
      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 mb-4 z-10 pointer-events-none">
        <img src={material.thumbnailUrl} alt={material.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-2 right-2">
          <MaterialTypeBadge type={material.materialType} />
        </div>
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-700 shadow-sm">
          {material.fileType.toUpperCase()}
        </div>
      </div>

      <div className="flex-1 z-10 pointer-events-none">
        <div className="flex items-center justify-between mb-2">
          {teacher ? (
            <span className="text-xs text-slate-500 truncate">{teacher.name}</span>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-1 text-amber-500">
            <Star size={14} fill="currentColor" />
            <span className="text-xs font-bold">{material.rating || '—'}</span>
          </div>
        </div>
        <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{material.title}</h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-3">{material.description}</p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto z-10">
        <Link to={`/profile/${material.uploader.id}`} className="flex items-center gap-2 hover:bg-slate-50 rounded-lg p-1 -mr-1 transition-colors">
          <img src={material.uploader.avatarUrl} className="w-6 h-6 rounded-full" alt="uploader" />
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-600 font-medium hover:text-blue-600">{material.uploader.name}</span>
            {isVerifiedUploader && <BadgeCheck size={14} className="text-blue-600 fill-blue-100" />}
          </div>
        </Link>
        <span className="text-xs text-slate-400">{material.term}</span>
      </div>
    </div>
  );
};

/** Compact horizontal row used in lists (Search, Profile, Course, Teacher). */
export const MaterialRow: React.FC<{ material: Material }> = ({ material }) => {
  const teacher = getTeacherById(material.teacherId);
  return (
    <div className="block bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group relative">
      <Link to={`/material/${material.id}`} className="absolute inset-0 z-0" aria-label={material.title}></Link>
      <div className="flex items-start gap-4 pointer-events-none">
        <img src={material.thumbnailUrl} alt="" className="w-24 h-24 object-cover rounded-lg bg-slate-100 hidden sm:block z-10" />
        <div className="flex-1 z-10 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{material.title}</h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              <MaterialTypeBadge type={material.materialType} />
              <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md font-bold">{material.fileType.toUpperCase()}</span>
            </div>
          </div>
          <p className="text-slate-500 text-sm mb-2 line-clamp-2">{material.description}</p>
          <div className="flex flex-wrap gap-2 text-xs pointer-events-auto">
            <Link to={`/profile/${material.uploader.id}`} className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded text-slate-600 font-medium hover:text-blue-600 hover:bg-blue-50 transition-colors">
              بارگذاری: {material.uploader.name}
            </Link>
            {teacher && (
              <Link to={`/teacher/${teacher.id}`} className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded text-blue-700 font-medium hover:bg-blue-100 transition-colors">
                استاد: {teacher.name}
                {teacher.isVerified && <BadgeCheck size={13} className="text-blue-600 fill-blue-100" />}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialCard;

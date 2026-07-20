import React from 'react';
import { Link } from 'react-router-dom';
import { Material } from '../types';
import { Star, BadgeCheck } from 'lucide-react';
import { UserRole } from '../types';
import MaterialTypeBadge from './MaterialTypeBadge';

/** Full card used in grids (Dashboard, Teacher, Field, Course pages). */
const MaterialCard: React.FC<{ material: Material; showTeacher?: boolean; teacherName?: string; teacherVerified?: boolean }> = ({ material, showTeacher, teacherName, teacherVerified }) => {
  const isVerifiedUploader = material.uploader.role === UserRole.INSTRUCTOR;

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 p-4 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 flex flex-col h-full relative">
      <Link to={`/material/${material.id}`} className="absolute inset-0 z-0" aria-label={material.title}></Link>
      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-gray-700 mb-4 z-10 pointer-events-none">
        <img src={material.thumbnailUrl} alt={material.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-2 right-2 flex gap-1">
          <MaterialTypeBadge type={material.materialType} />
          {material.isPremium && (
            <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm dark:bg-amber-900/30 dark:text-amber-300">
              ★ پولی
            </span>
          )}
        </div>
        <div className="absolute top-2 left-2 bg-white/90 dark:bg-gray-700/60 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-700 dark:text-gray-200 shadow-sm">
          {material.fileType.toUpperCase()}
        </div>
        {material.isPremium && (
          <div className="absolute bottom-2 left-2 bg-amber-500/95 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
            {material.priceTomans?.toLocaleString('fa-IR')} تومان
          </div>
        )}
      </div>

      <div className="flex-1 z-10 pointer-events-none">
        <div className="flex items-center justify-between mb-2">
          {showTeacher && teacherName ? (
            <span className="text-xs text-slate-500 dark:text-gray-500 truncate">{teacherName}</span>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400">
            <Star size={14} fill="currentColor" />
            <span className="text-xs font-bold">{material.rating || '—'}</span>
          </div>
        </div>
        <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1">{material.title}</h3>
        <p className="text-sm text-slate-500 dark:text-gray-500 line-clamp-2 mb-3">{material.description}</p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-gray-700 mt-auto z-10">
        <Link to={`/profile/${material.uploader.id}`} className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-gray-700 rounded-lg p-1 -mr-1 transition-colors">
          <img src={material.uploader.avatarUrl} className="w-6 h-6 rounded-full" alt="uploader" />
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-600 dark:text-gray-400 font-medium hover:text-blue-600 dark:hover:text-blue-400">{material.uploader.name}</span>
            {isVerifiedUploader && <BadgeCheck size={14} className="text-blue-600 dark:text-blue-400 fill-blue-100" />}
          </div>
        </Link>
        <span className="text-xs text-slate-400 dark:text-gray-500">{material.term}</span>
      </div>
    </div>
  );
};

export default MaterialCard;

/** Compact horizontal row used in lists (Search, Profile, Course, Teacher). */
export const MaterialRow: React.FC<{ material: Material; showTeacher?: boolean; teacherName?: string; teacherVerified?: boolean }> = ({ material, showTeacher, teacherName, teacherVerified }) => {
  return (
    <div className="block bg-white dark:bg-gray-800 p-4 rounded-xl border border-slate-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition-all group relative">
      <Link to={`/material/${material.id}`} className="absolute inset-0 z-0" aria-label={material.title}></Link>
      <div className="flex items-start gap-4 pointer-events-none">
        <img src={material.thumbnailUrl} alt="" className="w-24 h-24 object-cover rounded-lg bg-slate-100 dark:bg-gray-700 hidden sm:block z-10" />
        <div className="flex-1 z-10 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{material.title}</h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              <MaterialTypeBadge type={material.materialType} />
              {material.isPremium && (
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 dark:bg-amber-900/30 dark:text-amber-300">
                  ★ پولی · {material.priceTomans?.toLocaleString('fa-IR')} ت
                </span>
              )}
              <span className="bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-400 text-xs px-2 py-1 rounded-md font-bold">{material.fileType.toUpperCase()}</span>
            </div>
          </div>
          <p className="text-slate-500 dark:text-gray-500 text-sm mb-2 line-clamp-2">{material.description}</p>
          <div className="flex flex-wrap gap-2 text-xs pointer-events-auto">
            <Link to={`/profile/${material.uploader.id}`} className="flex items-center gap-1 bg-slate-50 dark:bg-gray-700 px-2 py-1 rounded text-slate-600 dark:text-gray-400 font-medium hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-800/30 transition-colors">
              بارگذاری: {material.uploader.name}
            </Link>
            {showTeacher && teacherName && (
              <Link to={`/teacher/${material.teacherId}`} className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded text-blue-700 dark:text-blue-400 font-medium hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors">
                استاد: {teacherName}
                {teacherVerified && <BadgeCheck size={13} className="text-blue-600 dark:text-blue-400 fill-blue-100" />}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
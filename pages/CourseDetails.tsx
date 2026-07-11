import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getCourseById,
  getTeacherById,
  getFieldById,
  getUniversityById,
  getMaterialsByCourse,
} from '../constants';
import { MaterialType } from '../types';
import { BookOpen, FileText, BadgeCheck, Building2, UploadCloud, Layers } from 'lucide-react';
import EntityBreadcrumb from '../components/EntityBreadcrumb';
import MaterialCard from '../components/MaterialCard';
import MaterialTypeFilter from '../components/MaterialTypeFilter';
import EmptyState from '../components/EmptyState';

const CourseDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const course = getCourseById(id);
  const [typeFilter, setTypeFilter] = useState<MaterialType | null>(null);

  if (!course) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">درس مورد نظر یافت نشد</h2>
        <Link to="/browse" className="text-blue-600 hover:underline mt-4 inline-block">بازگشت به کاوش</Link>
      </div>
    );
  }

  const teacher = getTeacherById(course.teacherId);
  const field = getFieldById(course.fieldId);
  const university = getUniversityById(course.universityId);
  const allMaterials = getMaterialsByCourse(course.id);
  const materials = typeFilter ? allMaterials.filter(m => m.materialType === typeFilter) : allMaterials;

  const counts = allMaterials.reduce((acc, m) => {
    acc[m.materialType] = (acc[m.materialType] || 0) + 1;
    return acc;
  }, {} as Partial<Record<MaterialType, number>>);

  return (
    <div className="space-y-8">
      <EntityBreadcrumb
        items={[
          ...(field ? [{ label: field.name, to: `/field/${field.id}` }] : []),
          ...(teacher ? [{ label: teacher.name, to: `/teacher/${teacher.id}` }] : []),
          { label: course.title },
        ]}
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {course.code && <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-lg text-sm font-mono">{course.code}</span>}
            {field && (
              <Link to={`/field/${field.id}`} className="bg-white/20 backdrop-blur px-3 py-1 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors flex items-center gap-1">
                <Layers size={14} /> {field.name}
              </Link>
            )}
          </div>
          <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
          {course.description && <p className="text-blue-100 max-w-2xl leading-relaxed">{course.description}</p>}
        </div>
      </div>

      {/* Teacher + University row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teacher && (
          <Link to={`/teacher/${teacher.id}`} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4 hover:shadow-md hover:border-blue-300 transition-all">
            <img src={teacher.avatarUrl} alt={teacher.name} className="w-14 h-14 rounded-2xl object-cover" />
            <div>
              <span className="text-xs text-slate-400">استاد درس</span>
              <h3 className="font-bold text-slate-900 flex items-center gap-1">
                {teacher.name}
                {teacher.isVerified && <BadgeCheck size={16} className="text-blue-600 fill-blue-100" />}
              </h3>
            </div>
          </Link>
        )}
        {university && (
          <Link to={`/university/${university.id}`} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4 hover:shadow-md hover:border-blue-300 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 size={24} />
            </div>
            <div>
              <span className="text-xs text-slate-400">دانشگاه</span>
              <h3 className="font-bold text-slate-900">{university.name}</h3>
            </div>
          </Link>
        )}
      </div>

      {/* Materials */}
      <section>
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-blue-600" size={22} />
            منابع این درس
          </h2>
          <Link
            to={`/upload?course=${course.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm shadow-lg shadow-blue-200"
          >
            <UploadCloud size={18} /> بارگذاری منبع برای این درس
          </Link>
        </div>

        <div className="mb-5">
          <MaterialTypeFilter value={typeFilter} onChange={setTypeFilter} counts={counts} total={allMaterials.length} />
        </div>

        {materials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map(m => <MaterialCard key={m.id} material={m} />)}
          </div>
        ) : (
          <EmptyState icon={BookOpen} title="هنوز منبعی برای این درس وجود ندارد" description="با بارگذاری جزوه، نمونه سوال یا اسلاید به دانشجویان این درس کمک کنید.">
            <Link to={`/upload?course=${course.id}`} className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
              <UploadCloud size={18} /> بارگذاری منبع
            </Link>
          </EmptyState>
        )}
      </section>
    </div>
  );
};

export default CourseDetailsPage;

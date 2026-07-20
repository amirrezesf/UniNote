import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useField, useFieldTeachers, useFieldCourses } from '../src/api/hooks/directory';
import { useUniversities } from '../src/api/hooks/directory';
import { useMaterialsList } from '../src/api/hooks/materials';
import { GraduationCap, BookOpen, FileText, Layers, Building2 } from 'lucide-react';
import EntityBreadcrumb from '../components/EntityBreadcrumb';
import StatPill from '../components/StatPill';
import TeacherCard from '../components/TeacherCard';
import CourseCard from '../components/CourseCard';
import EmptyState from '../components/EmptyState';
import { NoteStatus } from '../types';

const FieldPage = () => {
  const { id } = useParams<{ id: string }>();
  const [uniFilter, setUniFilter] = useState<string>('');

  const { data: field, isLoading: fieldLoading, isError: fieldError } = useField(id || '');
  const { data: allTeachers, isLoading: teachersLoading } = useFieldTeachers(id || '');
  const { data: allCourses } = useFieldCourses(id || '');
  const { data: materials, isLoading: materialsLoading } = useMaterialsList({ field: id, status: NoteStatus.PUBLISHED });
  const { data: universities } = useUniversities();

  if (fieldLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (fieldError || !field) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">رشته مورد نظر یافت نشد</h2>
        <Link to="/browse" className="text-blue-600 hover:underline mt-4 inline-block">بازگشت به کاوش</Link>
      </div>
    );
  }

  const teachers = uniFilter ? allTeachers?.filter(t => t.universityId === uniFilter) : allTeachers;
  const courses = uniFilter ? allCourses?.filter(c => c.universityId === uniFilter) : allCourses;

  // Universities that actually have content in this field
  const relevantUniIds = new Set<string>();
  allTeachers?.forEach(t => t.universityId && relevantUniIds.add(t.universityId));
  allCourses?.forEach(c => c.universityId && relevantUniIds.add(c.universityId));
  const relevantUnis = universities?.filter(u => relevantUniIds.has(u.id)) || [];

  const publishedMaterialsCount = materials?.filter(m => m.status === NoteStatus.PUBLISHED).length ?? 0;

  return (
    <div className="space-y-8">
      <EntityBreadcrumb items={[{ label: field.name }]} />

      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
          <Layers size={30} />
        </div>
        <div>
          <span className="text-sm text-slate-400">رشته تحصیلی</span>
          <h1 className="text-2xl font-bold text-slate-900">{field.name}</h1>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatPill icon={GraduationCap} value={allTeachers?.length ?? (teachersLoading ? '—' : 0)} label="استاد" color="bg-blue-100 text-blue-600" />
        <StatPill icon={BookOpen} value={allCourses?.length ?? 0} label="درس" color="bg-emerald-100 text-emerald-600" />
        <StatPill icon={FileText} value={publishedMaterialsCount} label="منبع" color="bg-amber-100 text-amber-600" />
      </div>

      {/* University filter */}
      {relevantUnis.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setUniFilter('')}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors border ${uniFilter === '' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
          >
            همه دانشگاه‌ها
          </button>
          {relevantUnis.map(u => (
            <button
              key={u.id}
              onClick={() => setUniFilter(u.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors border flex items-center gap-1 ${uniFilter === u.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
            >
              <Building2 size={14} /> {u.name}
            </button>
          ))}
        </div>
      )}

      {/* Teachers */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
          <GraduationCap className="text-blue-600" size={22} />
          اساتید این رشته
        </h2>
        {teachersLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <TeacherCard key={i} teacher={{ id: '', name: '', fieldIds: [], avatarUrl: '', isVerified: false }} skeleton />)}
          </div>
        ) : teachers && teachers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.map(t => <TeacherCard key={t.id} teacher={t} />)}
          </div>
        ) : (
          <EmptyState icon={GraduationCap} title="استادی یافت نشد" />
        )}
      </section>

      {/* Courses */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
          <BookOpen className="text-blue-600" size={22} />
          درس‌های این رشته
        </h2>
        {courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(c => <CourseCard key={c.id} course={c} />)}
          </div>
        ) : (
          <EmptyState icon={BookOpen} title="درسی یافت نشد" />
        )}
      </section>
    </div>
  );
};

export default FieldPage;
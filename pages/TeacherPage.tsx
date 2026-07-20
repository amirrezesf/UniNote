import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { useTeacher, useTeacherCourses, useTeacherMaterials } from '../src/api/hooks/directory';
import { useUniversity } from '../src/api/hooks/directory';
import { api } from '../src/api/client';
import { qk } from '../src/api/keys';
import { MaterialType, type Field } from '../types';
import { BadgeCheck, BookOpen, GraduationCap, FileText, Building2, UploadCloud, Layers } from 'lucide-react';
import EntityBreadcrumb from '../components/EntityBreadcrumb';
import StatPill from '../components/StatPill';
import CourseCard from '../components/CourseCard';
import MaterialCard from '../components/MaterialCard';
import MaterialTypeFilter from '../components/MaterialTypeFilter';
import EmptyState from '../components/EmptyState';

const TeacherPage = () => {
  const { id } = useParams<{ id: string }>();
  const [typeFilter, setTypeFilter] = useState<MaterialType | null>(null);

  const { data: teacher, isLoading: teacherLoading, isError: teacherError } = useTeacher(id || '');
  const { data: university } = useUniversity(teacher?.universityId || '');

  // Fetch field details for display. NOTE: must NOT call useField() inside
  // .map() — that violates the Rules of Hooks and produces
  // "Rendered more hooks than during the previous render" once teacher loads.
  // useQueries is the React Query hook designed for a dynamic-length list of
  // queries; it always calls the same single hook, regardless of array length.
  const fieldIds = teacher?.fieldIds ?? [];
  const fieldQueries = useQueries({
    queries: fieldIds.map(fid => ({
      queryKey: qk.field(fid),
      queryFn: async () => {
        const { data } = await api.get<Field>(`/fields/${fid}/`);
        return data;
      },
      enabled: !!fid,
    })),
  });

  const { data: courses, isLoading: coursesLoading } = useTeacherCourses(id || '');
  const { data: allMaterials, isLoading: materialsLoading } = useTeacherMaterials(id || '', typeFilter);

  if (teacherLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (teacherError || !teacher) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">استاد مورد نظر یافت نشد</h2>
        <Link to="/browse" className="text-blue-600 hover:underline mt-4 inline-block">بازگشت به کاوش</Link>
      </div>
    );
  }

  const counts = allMaterials?.reduce((acc, m) => {
    acc[m.materialType] = (acc[m.materialType] || 0) + 1;
    return acc;
  }, {} as Partial<Record<MaterialType, number>>);

  const materials = typeFilter ? allMaterials?.filter(m => m.materialType === typeFilter) : allMaterials;

  return (
    <div className="space-y-8">
      <EntityBreadcrumb
        items={[
          ...(university ? [{ label: university.name, to: `/university/${university.id}` }] : []),
          { label: teacher.name },
        ]}
      />

      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-blue-600 to-indigo-700" />
        <div className="px-6 md:px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-5 -mt-12">
            <img
              src={teacher.avatarUrl || `https://picsum.photos/seed/${teacher.id}/200`}
              alt={teacher.name}
              className="w-28 h-28 rounded-3xl border-4 border-white object-cover bg-white shadow-lg"
            />
            <div className="flex-1 mb-1">
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                {teacher.name}
                {teacher.isVerified && <BadgeCheck className="text-blue-600 fill-blue-100" />}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mt-1">
                {university && (
                  <Link to={`/university/${university.id}`} className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                    <Building2 size={15} /> {university.name}
                  </Link>
                )}
                <div className="flex flex-wrap gap-1">
                  {teacher.fieldIds.map(fid => {
                    const field = fieldQueries.find(q => q.data?.id === fid)?.data;
                    return field ? (
                      <Link key={field.id} to={`/field/${field.id}`} className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md font-medium hover:bg-indigo-100 transition-colors">
                        {field.name}
                      </Link>
                    ) : (
                      <span key={fid} className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md font-medium">
                        {fid}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          {teacher.bio && <p className="text-slate-600 leading-relaxed mt-5 text-sm">{teacher.bio}</p>}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatPill icon={BookOpen} value={courses?.length ?? (coursesLoading ? '—' : 0)} label="درس" color="bg-emerald-100 text-emerald-600" />
        <StatPill icon={FileText} value={allMaterials?.length ?? (materialsLoading ? '—' : 0)} label="منبع آموزشی" color="bg-blue-100 text-blue-600" />
        <StatPill icon={GraduationCap} value={teacher.fieldIds.length} label="رشته" color="bg-indigo-100 text-indigo-600" />
      </div>

      {/* Courses */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
          <BookOpen className="text-blue-600" size={22} />
          درس‌های تدریس‌شده
        </h2>
        {coursesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <CourseCard key={i} course={{ id: '', title: '', code: '', fieldId: '', teacherId: '', universityId: '', description: '' }} skeleton />)}
          </div>
        ) : courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(c => <CourseCard key={c.id} course={c} />)}
          </div>
        ) : (
          <EmptyState icon={BookOpen} title="درسی برای این استاد ثبت نشده است" />
        )}
      </section>

      {/* All materials (aggregated across ALL uploaders) */}
      <section>
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-blue-600" size={22} />
            همه منابع این استاد
          </h2>
          <Link to="/upload" className="text-sm text-blue-600 font-bold flex items-center gap-1 hover:underline">
            <UploadCloud size={16} /> بارگذاری منبع
          </Link>
        </div>
        <p className="text-sm text-slate-500 mb-4">تمام منابع مربوط به درس‌های این استاد، صرف‌نظر از اینکه توسط چه کسی بارگذاری شده است.</p>

        <div className="mb-5">
          <MaterialTypeFilter value={typeFilter} onChange={setTypeFilter} counts={counts || {}} total={allMaterials?.length || 0} />
        </div>

        {materialsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <MaterialCard key={`skeleton-${i}`} material={{ id: '', title: '', description: '', materialType: 'HANDOUT', uploader: { id: '', name: '', role: 'STUDENT', avatarUrl: '', points: 0 }, fieldId: '', courseId: '', teacherId: '', universityId: '', term: '', fileType: 'pdf', fileUrl: '', thumbnailUrl: '', status: 'PUBLISHED', likes: 0, views: 0, rating: 0, createdAt: '', tags: [], visibility: 'PUBLIC' }} skeleton />)}
          </div>
        ) : materials && materials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map(m => <MaterialCard key={m.id} material={m} />)}
          </div>
        ) : (
          <EmptyState icon={FileText} title="هنوز منبعی برای این استاد بارگذاری نشده است" description="اولین نفری باشید که برای درس‌های این استاد منبع به اشتراک می‌گذارد.">
            <Link to="/upload" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
              <UploadCloud size={18} /> بارگذاری منبع
            </Link>
          </EmptyState>
        )}
      </section>
    </div>
  );
};

export default TeacherPage;
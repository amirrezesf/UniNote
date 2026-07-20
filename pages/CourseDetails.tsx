import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  useCourse,
  useCourseMaterials,
  useTeacher,
  useField,
  useUniversity,
} from '../src/api/hooks/directory';
import { MaterialType } from '../types';
import MaterialCard from '../components/MaterialCard';
import MaterialTypeFilter from '../components/MaterialTypeFilter';
import EmptyState from '../components/EmptyState';
import { Building2, FileText, UploadCloud, BookOpen, X, Award } from 'lucide-react';

const CourseDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [typeFilter, setTypeFilter] = useState<MaterialType | null>(null);

  // Always call hooks to maintain consistent order
  const { data: course, isLoading: courseLoading, isError: courseError } = useCourse(id || '');
  const { data: allMaterials, isLoading: materialsLoading } = useCourseMaterials(id || '', typeFilter);
  const materials = typeFilter ? allMaterials?.filter(m => m.materialType === typeFilter) : allMaterials;

  // Use safe fallbacks for dependent hooks
  const teacherId = course?.teacherId ?? '';
  const fieldId = course?.fieldId ?? '';
  const universityId = course?.universityId ?? '';

  const { data: teacher } = useTeacher(teacherId);
  const { data: field } = useField(fieldId);
  const { data: university } = useUniversity(universityId);

  if (courseLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">درس مورد نظر یافت نشد</h2>
        <Link to="/browse" className="text-blue-600 hover:underline mt-4 inline-block">بازگشت به کاوش</Link>
      </div>
    );
  }

  const counts = allMaterials?.reduce(
    (acc: Record<MaterialType, number>, m) => {
      acc[m.materialType] = (acc[m.materialType] || 0) + 1;
      return acc;
    },
    {} as Record<MaterialType, number>
  ) ?? {};

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-slate-900">{course.title}</h1>
              <p className="mt-1 text-slate-500 text-sm">{course.code}</p>
            </div>
            <div className="text-right space-x-4">
              {teacher && (
                <Link
                  to={`/teacher/${teacher.id}`}
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors text-sm"
                >
                  <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                    <Award size={16} />
                  </div>
                  <span>{teacher.name}</span>
                </Link>
              )}
              {university && (
                <Link
                  to={`/university/${university.id}`}
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors text-sm"
                >
                  <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                    <Building2 size={16} />
                  </div>
                  <span>{university.name}</span>
                </Link>
              )}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <p className="text-slate-600">{course.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {field && (
                <span className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-0.5 rounded">
                  {field.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Materials Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="text-blue-600" size={24} />
              منابع این درس
            </h2>
            <Link
              to={`/upload?course=${course.id}`}
              className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm shadow-md shadow-blue-200 hover:shadow-lg"
            >
              <UploadCloud size={20} />
              بارگذاری منبع برای این درس
            </Link>
          </div>

          {/* Filter */}
          <div className="mb-6">
            <MaterialTypeFilter value={typeFilter} onChange={setTypeFilter} counts={counts} total={allMaterials?.length || 0} />
          </div>

          {/* Materials List */}
          {materialsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[200px]">
              {[...Array(3)].map((_, i) => (
                <MaterialCard
                  key={`skeleton-${i}`}
                  material={{
                    id: '',
                    title: '',
                    description: '',
                    materialType: 'HANDOUT',
                    uploader: { id: '', name: '', role: 'STUDENT', avatarUrl: '', points: 0 },
                    fieldId: '',
                    courseId: '',
                    teacherId: '',
                    universityId: '',
                    term: '',
                    fileType: 'pdf',
                    fileUrl: '',
                    thumbnailUrl: '',
                    status: 'PUBLISHED',
                    likes: 0,
                    views: 0,
                    rating: 0,
                    createdAt: '',
                    tags: [],
                    visibility: 'PUBLIC',
                  }}
                  skeleton
                />
              ))}
            </div>
          ) : materials && materials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map(m => (
                <MaterialCard key={m.id} material={m} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <EmptyState
                icon={BookOpen}
                title="هنوز منبعی برای این درس وجود ندارد"
                description="با بارگذاری جزوه، نمونه سوال یا اسلاید به دانشجویان این درس کمک کنید."
              >
                <Link
                  to={`/upload?course=${course.id}`}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                  <UploadCloud size={18} />
                  بارگذاری منبع
                </Link>
              </EmptyState>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CourseDetailsPage;
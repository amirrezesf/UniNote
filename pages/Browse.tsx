import React, { useState } from 'react';
import { Compass, SearchIcon, Building2, Layers, GraduationCap, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUniversities, useFields, useTeachers, useCourses } from '../src/api/hooks/directory';
import UniversityCard from '../components/UniversityCard';
import FieldCard from '../components/FieldCard';
import TeacherCard from '../components/TeacherCard';
import CourseCard from '../components/CourseCard';
import EmptyState from '../components/EmptyState';

const Browse = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const { data: universities, isLoading: unisLoading } = useUniversities();
  const { data: fields, isLoading: fieldsLoading } = useFields();
  const { data: teachers, isLoading: teachersLoading } = useTeachers();
  const { data: courses, isLoading: coursesLoading } = useCourses();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : '/search');
  };

  return (
    <div className="space-y-8">
      {/* Hero + search */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
            <Compass size={28} /> کاوش در دایرکتوری
          </h1>
          <p className="text-blue-100 mb-6 max-w-2xl">دانشگاه، رشته یا استاد مورد نظر خود را انتخاب کنید و به منابع دقیق درس‌ها دسترسی پیدا کنید.</p>
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="جستجوی جزوه، نمونه سوال، استاد، درس..."
              className="w-full pr-12 pl-4 py-3.5 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
            />
          </form>
        </div>
      </div>

      {/* Universities */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
          <Building2 className="text-blue-600" size={22} />
          دانشگاه‌ها
        </h2>
        {unisLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
                <div className="h-6 bg-slate-200 rounded w-1/3" />
                <div className="h-4 bg-slate-200 rounded w-2/3" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : universities && universities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {universities.map(u => <UniversityCard key={u.id} university={u} />)}
          </div>
        ) : (
          <EmptyState icon={Building2} title="دانشگاهی یافت نشد" />
        )}
      </section>

      {/* Fields */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
          <Layers className="text-indigo-600" size={22} />
          رشته‌ها
        </h2>
        {fieldsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
                <div className="h-6 bg-slate-200 rounded w-1/3" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : fields && fields.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(f => <FieldCard key={f.id} field={f} />)}
          </div>
        ) : (
          <EmptyState icon={Layers} title="رشته‌ای یافت نشد" />
        )}
      </section>

      {/* Teachers */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
          <GraduationCap className="text-indigo-600" size={22} />
          اساتید
        </h2>
        {teachersLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-slate-200 rounded w-1/3" />
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
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
          <BookOpen className="text-emerald-600" size={22} />
          دروس
        </h2>
        {coursesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
                <div className="h-6 bg-slate-200 rounded w-1/2" />
                <div className="h-4 bg-slate-200 rounded w-2/3" />
                <div className="h-4 bg-slate-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : courses && courses.length > 0 ? (
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

export default Browse;
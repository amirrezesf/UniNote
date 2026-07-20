import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {  useUniversities, useFields, useTeachers } from '../src/api/hooks/directory';
import { Search as SearchIcon, Filter, X, SlidersHorizontal, Layers, Building2, GraduationCap, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { NoteStatus, MaterialType } from '../types';
import { MaterialRow } from '../components/MaterialCard';
import EmptyState from '../components/EmptyState';
import { useMaterials } from '@/src/api/hooks/materials';

const MATERIAL_TYPES: MaterialType[] = ['HANDOUT', 'EXAM', 'NOTE', 'SLIDE', 'ASSIGNMENT'];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [fieldId, setFieldId] = useState(searchParams.get('field') || '');
  const [universityId, setUniversityId] = useState(searchParams.get('university') || '');
  const [teacherId, setTeacherId] = useState(searchParams.get('teacher') || '');
  const [materialType, setMaterialType] = useState<MaterialType | ''>('');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  // Per-section option search
  const [fieldQuery, setFieldQuery] = useState('');
  const [uniQuery, setUniQuery] = useState('');
  const [teacherQuery, setTeacherQuery] = useState('');

  // Fetch data with filters
  const { data: materialsData, isLoading: materialsLoading, error: materialsError } = useMaterials({
    q: query || undefined,
    field: fieldId || undefined,
    university: universityId || undefined,
    teacher: teacherId || undefined,
    type: materialType || undefined,
    status: NoteStatus.PUBLISHED,
    page,
    ordering: '-createdAt',
  });

  // Fetch options for filter dropdowns
  const { data: universities = [], isLoading: unisLoading } = useUniversities();
  const { data: fields = [], isLoading: fieldsLoading } = useFields();
  const { data: teachers = [], isLoading: teachersLoading } = useTeachers();

  // Filter dropdown options based on search query
  const visibleFields = fields.filter(f => f.name.toLowerCase().includes(fieldQuery.toLowerCase()));
  const visibleUnis = universities.filter(u => u.name.toLowerCase().includes(uniQuery.toLowerCase()));
  const visibleTeachers = teachers.filter(t => t.name.toLowerCase().includes(teacherQuery.toLowerCase()));

  const materialTypeLabels: Record<MaterialType, string> = {
    HANDOUT: 'جزوه',
    EXAM: 'نمونه سوال',
    NOTE: 'یادداشت',
    SLIDE: 'اسلاید',
    ASSIGNMENT: 'تکلیف',
  };

  const results = materialsData?.results || [];
  const totalCount = materialsData?.count || 0;
  const totalPages = Math.ceil(totalCount / 20); // assuming page size 20
  const hasNextPage = materialsData?.next !== null;
  const hasPrevPage = materialsData?.previous !== null;

  const activeFilters = [fieldId, universityId, teacherId, materialType].filter(Boolean).length;

  const clearFilters = () => {
    setFieldId('');
    setUniversityId('');
    setTeacherId('');
    setMaterialType('');
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearchParams({ q: query.trim() || undefined });
  };

  const updateParam = (key: string, value: string | undefined) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    });
    setPage(1);
  };

  const radio = (name: string, checked: boolean, onChange: () => void, label: string) => (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="radio" name={name} checked={checked} onChange={onChange} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
      <span className="text-sm text-slate-600">{label}</span>
    </label>
  );

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-140px)]">
      {/* Filters Sidebar */}
      <div className={`
        fixed inset-0 z-30 bg-white p-6 md:static md:w-72 md:bg-transparent md:p-0 md:block transition-transform duration-300 overflow-y-auto
        ${showFilters ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
      `}>
        <div className="flex items-center justify-between md:hidden mb-6">
          <h3 className="font-bold text-lg">فیلترها</h3>
          <button onClick={() => setShowFilters(false)}><X /></button>
        </div>

        <div className="space-y-5">
          {activeFilters > 0 && (
            <button onClick={clearFilters} className="text-sm text-red-500 font-medium flex items-center gap-1 hover:underline">
              <X size={14} /> پاک کردن فیلترها ({activeFilters})
            </button>
          )}

          {/* Material Type */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Tag size={18} /> نوع منبع</h3>
            <div className="space-y-2">
              {radio('mtype', materialType === '', () => { setMaterialType(''); updateParam('type', undefined); }, 'همه')}
              {MATERIAL_TYPES.map(t => radio('mtype', materialType === t, () => { setMaterialType(t); updateParam('type', t); }, materialTypeLabels[t]))}
            </div>
          </div>

          {/* Field */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Layers size={18} /> رشته تحصیلی</h3>
            <div className="relative mb-3">
              <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" value={fieldQuery} onChange={e => setFieldQuery(e.target.value)} placeholder="جستجوی رشته..." className="w-full pl-3 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
              {radio('field', fieldId === '', () => { setFieldId(''); updateParam('field', undefined); }, 'همه')}
              {visibleFields.map(f => radio('field', fieldId === f.id, () => { setFieldId(f.id); updateParam('field', f.id); }, f.name))}
            </div>
          </div>

          {/* University */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Building2 size={18} /> دانشگاه</h3>
            <div className="relative mb-3">
              <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" value={uniQuery} onChange={e => setUniQuery(e.target.value)} placeholder="جستجوی دانشگاه..." className="w-full pl-3 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
              {radio('uni', universityId === '', () => { setUniversityId(''); updateParam('university', undefined); }, 'همه')}
              {visibleUnis.map(u => radio('uni', universityId === u.id, () => { setUniversityId(u.id); updateParam('university', u.id); }, u.name))}
            </div>
          </div>

          {/* Teacher */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><GraduationCap size={18} /> استاد</h3>
            <div className="relative mb-3">
              <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" value={teacherQuery} onChange={e => setTeacherQuery(e.target.value)} placeholder="جستجوی استاد..." className="w-full pl-3 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
              {radio('teacher', teacherId === '', () => { setTeacherId(''); updateParam('teacher', undefined); }, 'همه')}
              {visibleTeachers.map(t => radio('teacher', teacherId === t.id, () => { setTeacherId(t.id); updateParam('teacher', t.id); }, t.name))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Search Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="جستجو در نام منبع، توضیحات و برچسب‌ها..."
                className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
              />
            </form>
          </div>
          <button onClick={() => setShowFilters(true)} className="md:hidden bg-white border border-slate-200 p-3 rounded-xl text-slate-600 relative">
            <SlidersHorizontal size={20} />
            {activeFilters > 0 && <span className="absolute -top-1 -left-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">{activeFilters}</span>}
          </button>
        </div>

        <div className="mb-4 text-sm text-slate-500 flex items-center gap-2">
          <Filter size={15} /> {totalCount} منبع یافت شد
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto pb-10">
          <div className="space-y-4">
            {materialsLoading ? (
              [...Array(5)].map((_, i) => (
                <MaterialRow key={`skeleton-${i}`} material={{
                  id: '', title: '', description: '', materialType: 'HANDOUT',
                  uploader: { id: '', name: '', role: 'STUDENT', avatarUrl: '', points: 0 },
                  fieldId: '', courseId: '', teacherId: '', universityId: '',
                  term: '', fileType: 'pdf', fileUrl: '', thumbnailUrl: '',
                  status: 'PUBLISHED', likes: 0, views: 0, rating: 0, createdAt: '', tags: [], visibility: 'PUBLIC'
                }} skeleton />
              ))
            ) : materialsError ? (
              <EmptyState icon={SearchIcon} title="خطا در جستجو" description="لطفاً دوباره تلاش کنید." />
            ) : results.length === 0 ? (
              <EmptyState icon={SearchIcon} title="نتیجه‌ای یافت نشد" description="عبارت جستجو یا فیلترها را تغییر دهید." />
            ) : (
              <>
                {results.map(m => <MaterialRow key={m.id} material={m} />)}
                {/* Pagination */}
                {(hasNextPage || hasPrevPage) && (
                  <div className="flex justify-center gap-2 mt-8 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => setPage(p => p - 1)}
                      disabled={!hasPrevPage}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                    >
                      <ChevronRight size={18} /> قبلی
                    </button>
                    <span className="flex items-center px-4 text-slate-600">صفحه {page} از {totalPages}</span>
                    <button
                      onClick={() => setPage(p => p + 1)}
                      disabled={!hasNextPage}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                    >
                      بعدی <ChevronLeft size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useFields, useUniversities, useTeachers, useCourses } from '../src/api/hooks/directory';
import { useUploadMaterial } from '../src/api/hooks/mutations';
import { UploadCloud, File, X, Check, Loader2, Search, ChevronDown, Layers, Building2, GraduationCap, BookOpen, Tag } from 'lucide-react';
import { MaterialType } from '../types';

const MATERIAL_TYPES: MaterialType[] = ['HANDOUT', 'EXAM', 'NOTE', 'SLIDE', 'ASSIGNMENT'];

const UploadPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const prefillCourseId = searchParams.get('course') || undefined;

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [materialType, setMaterialType] = useState<MaterialType | ''>('');
  const [fieldId, setFieldId] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  // Marketplace state
  const [isPremium, setIsPremium] = useState(false);
  const [price, setPrice] = useState<number | ''>('');

  // Field searchable select
  const [fieldSearch, setFieldSearch] = useState('');
  const [showFieldSuggestions, setShowFieldSuggestions] = useState(false);

  // Teacher autocomplete
  const [teacherSearch, setTeacherSearch] = useState('');
  const [showTeacherSuggestions, setShowTeacherSuggestions] = useState(false);

  // Fetch reference data for dropdowns
  const { data: fields = [], isLoading: fieldsLoading } = useFields();
  const { data: universities = [], isLoading: unisLoading } = useUniversities();
  const { data: teachers = [], isLoading: teachersLoading } = useTeachers();

  // Fetch courses after field/teacher selected
  const { data: courses = [], isLoading: coursesLoading } = useCourses({
    field: fieldId || undefined,
    teacher: teacherId || undefined,
  });

  const uploadMutation = useUploadMaterial();

  // Prefill form from URL params
  useEffect(() => {
    if (prefillCourseId) {
      setCourseId(prefillCourseId);
    }
  }, [prefillCourseId]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    if (!fieldId) { alert('لطفا رشته تحصیلی را انتخاب کنید.'); return; }
    if (!materialType) { alert('لطفا نوع منبع را انتخاب کنید.'); return; }

    uploadMutation.mutate({
      title,
      description,
      materialType,
      fieldId,
      courseId: courseId || undefined,
      teacherId: teacherId || undefined,
      universityId: universityId || undefined,
      tags: [], // Could add tags support later
      file,
      // Marketplace fields — camelCase keys accepted by MaterialWriteSerializer
      isPremium,
      priceTomans: isPremium && price !== '' ? Number(price) : undefined,
    }, {
      onSuccess: () => {
        setSuccess(true);
      },
      onError: (error) => {
        alert(error.message || 'خطا در بارگذاری منبع');
      },
    });
  };

  const filteredFields = fields.filter(f => f.name.toLowerCase().includes(fieldSearch.toLowerCase()));
  const filteredTeachers = teachers.filter(t => t.name.toLowerCase().includes(teacherSearch.toLowerCase()));

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6">
          <Check size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-2">بارگذاری با موفقیت انجام شد</h2>
        <p className="text-slate-500 dark:text-gray-500 mb-8 max-w-md">منبع شما با موفقیت ثبت شد و پس از تایید برای همه دانشجویان قابل مشاهده خواهد بود.</p>
        <button
          onClick={() => {
            setSuccess(false); setFile(null); setTitle(''); setDescription(''); setMaterialType('');
            setFieldId(''); setUniversityId(''); setCourseId(''); setFieldSearch('');
            setTeacherSearch(''); setTeacherId('');
          }}
          className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
        >
          بارگذاری منبع دیگر
        </button>
      </div>
    );
  }

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-gray-100 mb-8">بارگذاری منبع جدید</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Zone */}
        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${dragActive ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-slate-400 dark:hover:border-gray-500'} ${file ? 'border-green-500 dark:border-green-400 bg-green-50/30 dark:bg-green-900/20' : ''}`}
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
        >
          <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleChange} accept=".pdf,.docx,.pptx,.jpg,.png" />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm"><File className="text-green-600 dark:text-green-400" size={32} /></div>
              <div className="text-right">
                <p className="font-bold text-slate-800 dark:text-gray-100">{file.name}</p>
                <p className="text-sm text-slate-500 dark:text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button type="button" onClick={e => { e.preventDefault(); setFile(null); }} className="mr-auto p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full text-red-500 dark:text-red-400 z-10"><X size={20} /></button>
            </div>
          ) : (
            <div className="pointer-events-none">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4"><UploadCloud size={32} /></div>
              <p className="text-lg font-bold text-slate-700 dark:text-gray-300 mb-1">فایل را اینجا بکشید و رها کنید</p>
              <p className="text-sm text-slate-500 dark:text-gray-500">یا برای انتخاب فایل کلیک کنید (PDF, DOCX, PPTX, IMG)</p>
            </div>
          )}
        </div>

        {/* Material Type (required) */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700 dark:text-gray-300 flex items-center gap-2"><Tag size={16} /> نوع منبع <span className="text-red-500 dark:text-red-400">*</span></label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {MATERIAL_TYPES.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setMaterialType(t)}
                className={`px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all ${materialType === t ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'border-slate-200 dark:border-gray-600 hover:border-slate-300 dark:hover:border-gray-500 text-slate-600 dark:text-gray-400'}`}
              >
                {t === 'HANDOUT' ? 'جزوه' : t === 'EXAM' ? 'نمونه سوال' : t === 'NOTE' ? 'یادداشت' : t === 'SLIDE' ? 'اسلاید' : 'تکلیف'}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-gray-300">عنوان منبع <span className="text-red-500 dark:text-red-400">*</span></label>
          <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className={inputClass} placeholder="مثال: جزوه ساختمان داده دکتر کمالی" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Field (required, searchable) */}
          <div className="space-y-2 relative">
            <label className="text-sm font-bold text-slate-700 dark:text-gray-300 flex items-center gap-2"><Layers size={16} /> رشته تحصیلی <span className="text-red-500 dark:text-red-400">*</span></label>
            <div className="relative">
              <input
                type="text"
                value={fieldSearch}
                onChange={e => { setFieldSearch(e.target.value); setShowFieldSuggestions(true); setFieldId(''); }}
                onFocus={() => setShowFieldSuggestions(true)}
                onBlur={() => setTimeout(() => setShowFieldSuggestions(false), 200)}
                className={`${inputClass} pl-10 ${!fieldId && fieldSearch ? 'border-amber-300 dark:border-amber-400' : ''}`}
                placeholder={fieldsLoading ? 'در حال بارگذاری...' : 'جستجوی رشته...'}
                disabled={fieldsLoading}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500" size={18} />
            </div>
            {showFieldSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-600 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                {filteredFields.length > 0 ? filteredFields.map(f => (
                  <button key={f.id} type="button" onClick={() => { setFieldSearch(f.name); setFieldId(f.id); setShowFieldSuggestions(false); }} className="w-full flex items-center gap-2 px-4 py-3 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors text-right">
                    <Layers size={16} className="text-indigo-500 dark:text-indigo-400" />
                    <span className="font-medium text-sm text-slate-800 dark:text-gray-200">{f.name}</span>
                  </button>
                )) : (
                  <div className="p-3 text-center text-sm text-slate-500 dark:text-gray-500">رشته‌ای یافت نشد.</div>
                )}
              </div>
            )}
          </div>

          {/* University (optional, searchable) */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-gray-300 flex items-center gap-2"><Building2 size={16} /> دانشگاه <span className="text-slate-400 font-normal dark:text-gray-500">(اختیاری)</span></label>
            <div className="relative">
              <select value={universityId} onChange={e => setUniversityId(e.target.value)} className={`${inputClass} appearance-none pl-10`} disabled={unisLoading}>
                <option value="">انتخاب دانشگاه...</option>
                {universities.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
              <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 pointer-events-none" size={18} />
            </div>
          </div>

          {/* Teacher (optional autocomplete) */}
          <div className="space-y-2 relative">
            <label className="text-sm font-bold text-slate-700 dark:text-gray-300 flex items-center gap-2"><GraduationCap size={16} /> استاد درس <span className="text-slate-400 font-normal dark:text-gray-500">(اختیاری)</span></label>
            <div className="relative">
              <input
                type="text"
                value={teacherSearch}
                onChange={e => { setTeacherSearch(e.target.value); setShowTeacherSuggestions(true); setTeacherId(''); }}
                onFocus={() => setShowTeacherSuggestions(true)}
                onBlur={() => setTimeout(() => setShowTeacherSuggestions(false), 200)}
                className={`${inputClass} pl-10`}
                placeholder={teachersLoading ? 'در حال بارگذاری...' : 'جستجوی نام استاد...'}
                disabled={teachersLoading}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500" size={18} />
            </div>
            {showTeacherSuggestions && teacherSearch && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-600 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                {filteredTeachers.length > 0 ? filteredTeachers.map(t => (
                  <button key={t.id} type="button" onClick={() => { setTeacherSearch(t.name); setTeacherId(t.id); setShowTeacherSuggestions(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors text-right">
                    <img src={t.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
                    <span className="font-bold text-sm text-slate-800 dark:text-gray-200">{t.name}</span>
                  </button>
                )) : (
                  <div className="p-3 text-center text-sm text-slate-500 dark:text-gray-500">استادی یافت نشد. می‌توانید نام را دستی وارد کنید.</div>
                )}
              </div>
            )}
          </div>

          {/* Course (optional link) */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-gray-300 flex items-center gap-2"><BookOpen size={16} /> درس مرتبط <span className="text-slate-400 font-normal dark:text-gray-500">(اختیاری)</span></label>
            <div className="relative">
              <select value={courseId} onChange={e => setCourseId(e.target.value)} className={`${inputClass} appearance-none pl-10`} disabled={coursesLoading}>
                <option value="">انتخاب درس...</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}{c.code ? ` (${c.code})` : ''}</option>)}
              </select>
              <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 pointer-events-none" size={18} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-gray-300">توضیحات تکمیلی</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className={`${inputClass} resize-none`} placeholder="توضیحاتی در مورد محتوای منبع، نکات مهم و ..." />
        </div>

        {/* Marketplace — sell handout */}
        <div className="rounded-2xl border border-slate-200 dark:border-gray-600 bg-slate-50/50 dark:bg-gray-800/50 p-4 space-y-4">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isPremium}
              onChange={e => setIsPremium(e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 focus:ring-blue-500"
            />
            <span className="text-sm font-bold text-slate-700 dark:text-gray-300">فروش این منبع (پولی)</span>
          </label>

          {isPremium && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-gray-600">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 dark:text-gray-400">قیمت (تومان)</label>
                <input
                  type="number"
                  min={10000}
                  step={1000}
                  value={price}
                  onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className={inputClass}
                  placeholder="مثال: ۵۰۰۰۰"
                />
                <p className="text-xs text-slate-400 dark:text-gray-500">حداقل ۱۰,۰۰۰ — حداکثر ۵۰۰,۰۰۰ تومان (مضربی از ۱,۰۰۰)</p>
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 sm:col-span-2">
                توجه: فروش منابع به‌صورت آزمایشی فعال است و در نسخه‌های بعدی کامل خواهد شد.
              </p>
            </div>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={!file || uploadMutation.isPending}
            className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 ${!file || uploadMutation.isPending ? 'bg-slate-300 dark:bg-gray-700 cursor-not-allowed shadow-none' : 'bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 hover:shadow-xl'}`}
          >
            {uploadMutation.isPending ? (<><Loader2 className="animate-spin" /> در حال بارگذاری...</>) : 'ارسال منبع'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadPage;
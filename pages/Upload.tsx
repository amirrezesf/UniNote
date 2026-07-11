import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { UploadCloud, File, X, Check, Loader2, Search, ChevronDown, Layers, Building2, GraduationCap, BookOpen, Tag } from 'lucide-react';
import { MaterialType } from '../types';
import { FIELDS, UNIVERSITIES, TEACHERS, COURSES, MATERIAL_TYPE_LABELS, getCourseById } from '../constants';

const MATERIAL_TYPES: MaterialType[] = ['HANDOUT', 'EXAM', 'NOTE', 'SLIDE', 'ASSIGNMENT'];

const UploadPage = () => {
  const [searchParams] = useSearchParams();
  const prefillCourse = getCourseById(searchParams.get('course') || undefined);

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [materialType, setMaterialType] = useState<MaterialType | ''>('');
  const [fieldId, setFieldId] = useState(prefillCourse?.fieldId || '');
  const [universityId, setUniversityId] = useState(prefillCourse?.universityId || '');
  const [courseId, setCourseId] = useState(prefillCourse?.id || '');

  // Field searchable select
  const [fieldSearch, setFieldSearch] = useState(prefillCourse ? FIELDS.find(f => f.id === prefillCourse.fieldId)?.name || '' : '');
  const [showFieldSuggestions, setShowFieldSuggestions] = useState(false);

  // Teacher autocomplete
  const [teacherSearch, setTeacherSearch] = useState(prefillCourse?.teacherId ? TEACHERS.find(t => t.id === prefillCourse.teacherId)?.name || '' : '');
  const [showTeacherSuggestions, setShowTeacherSuggestions] = useState(false);
  const [teacherId, setTeacherId] = useState(prefillCourse?.teacherId || '');

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

    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setSuccess(true);
    }, 2000);
  };

  const filteredFields = FIELDS.filter(f => f.name.includes(fieldSearch));
  const filteredTeachers = TEACHERS.filter(t => t.name.includes(teacherSearch));
  const availableCourses = COURSES.filter(c => (!fieldId || c.fieldId === fieldId) && (!teacherId || c.teacherId === teacherId));

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <Check size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">بارگذاری با موفقیت انجام شد</h2>
        <p className="text-slate-500 mb-8 max-w-md">منبع شما با موفقیت ثبت شد و پس از تایید برای همه دانشجویان قابل مشاهده خواهد بود.</p>
        <button
          onClick={() => {
            setSuccess(false); setFile(null); setTitle(''); setDescription(''); setMaterialType('');
            setFieldId(''); setUniversityId(''); setCourseId(''); setFieldSearch('');
            setTeacherSearch(''); setTeacherId('');
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
        >
          بارگذاری منبع دیگر
        </button>
      </div>
    );
  }

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-8">بارگذاری منبع جدید</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Zone */}
        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white hover:border-slate-400'} ${file ? 'border-green-500 bg-green-50/30' : ''}`}
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
        >
          <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleChange} accept=".pdf,.docx,.pptx,.jpg,.png" />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-white rounded-xl shadow-sm"><File className="text-green-600" size={32} /></div>
              <div className="text-right">
                <p className="font-bold text-slate-800">{file.name}</p>
                <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button type="button" onClick={e => { e.preventDefault(); setFile(null); }} className="mr-auto p-2 hover:bg-red-100 rounded-full text-red-500 z-10"><X size={20} /></button>
            </div>
          ) : (
            <div className="pointer-events-none">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"><UploadCloud size={32} /></div>
              <p className="text-lg font-bold text-slate-700 mb-1">فایل را اینجا بکشید و رها کنید</p>
              <p className="text-sm text-slate-500">یا برای انتخاب فایل کلیک کنید (PDF, DOCX, PPTX, IMG)</p>
            </div>
          )}
        </div>

        {/* Material Type (required) */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Tag size={16} /> نوع منبع <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {MATERIAL_TYPES.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setMaterialType(t)}
                className={`px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all ${materialType === t ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
              >
                {MATERIAL_TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">عنوان منبع <span className="text-red-500">*</span></label>
          <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className={inputClass} placeholder="مثال: جزوه ساختمان داده دکتر کمالی" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Field (required, searchable) */}
          <div className="space-y-2 relative">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Layers size={16} /> رشته تحصیلی <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type="text"
                value={fieldSearch}
                onChange={e => { setFieldSearch(e.target.value); setShowFieldSuggestions(true); setFieldId(''); }}
                onFocus={() => setShowFieldSuggestions(true)}
                onBlur={() => setTimeout(() => setShowFieldSuggestions(false), 200)}
                className={`${inputClass} pl-10 ${!fieldId && fieldSearch ? 'border-amber-300' : ''}`}
                placeholder="جستجوی رشته..."
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
            {showFieldSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                {filteredFields.length > 0 ? filteredFields.map(f => (
                  <button key={f.id} type="button" onClick={() => { setFieldSearch(f.name); setFieldId(f.id); setShowFieldSuggestions(false); }} className="w-full flex items-center gap-2 px-4 py-3 hover:bg-slate-50 transition-colors text-right">
                    <Layers size={16} className="text-indigo-500" />
                    <span className="font-medium text-sm text-slate-800">{f.name}</span>
                  </button>
                )) : (
                  <div className="p-3 text-center text-sm text-slate-500">رشته‌ای یافت نشد.</div>
                )}
              </div>
            )}
          </div>

          {/* University (optional, searchable) */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Building2 size={16} /> دانشگاه <span className="text-slate-400 font-normal">(اختیاری)</span></label>
            <div className="relative">
              <select value={universityId} onChange={e => setUniversityId(e.target.value)} className={`${inputClass} appearance-none pl-10`}>
                <option value="">انتخاب دانشگاه...</option>
                {UNIVERSITIES.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
              <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>
          </div>

          {/* Teacher (optional autocomplete) */}
          <div className="space-y-2 relative">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><GraduationCap size={16} /> استاد درس <span className="text-slate-400 font-normal">(اختیاری)</span></label>
            <div className="relative">
              <input
                type="text"
                value={teacherSearch}
                onChange={e => { setTeacherSearch(e.target.value); setShowTeacherSuggestions(true); setTeacherId(''); }}
                onFocus={() => setShowTeacherSuggestions(true)}
                onBlur={() => setTimeout(() => setShowTeacherSuggestions(false), 200)}
                className={`${inputClass} pl-10`}
                placeholder="جستجوی نام استاد..."
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
            {showTeacherSuggestions && teacherSearch && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                {filteredTeachers.length > 0 ? filteredTeachers.map(t => (
                  <button key={t.id} type="button" onClick={() => { setTeacherSearch(t.name); setTeacherId(t.id); setShowTeacherSuggestions(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-right">
                    <img src={t.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
                    <span className="font-bold text-sm text-slate-800">{t.name}</span>
                  </button>
                )) : (
                  <div className="p-3 text-center text-sm text-slate-500">استادی یافت نشد. می‌توانید نام را دستی وارد کنید.</div>
                )}
              </div>
            )}
          </div>

          {/* Course (optional link) */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><BookOpen size={16} /> درس مرتبط <span className="text-slate-400 font-normal">(اختیاری)</span></label>
            <div className="relative">
              <select value={courseId} onChange={e => setCourseId(e.target.value)} className={`${inputClass} appearance-none pl-10`}>
                <option value="">انتخاب درس...</option>
                {availableCourses.map(c => <option key={c.id} value={c.id}>{c.title}{c.code ? ` (${c.code})` : ''}</option>)}
              </select>
              <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">توضیحات تکمیلی</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className={`${inputClass} resize-none`} placeholder="توضیحاتی در مورد محتوای منبع، نکات مهم و ..." />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={!file || uploading}
            className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 ${!file || uploading ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl'}`}
          >
            {uploading ? (<><Loader2 className="animate-spin" /> در حال بارگذاری...</>) : 'ارسال منبع'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadPage;

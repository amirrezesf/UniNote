
import React, { useState } from 'react';
import { UploadCloud, File, X, Check, Loader2, Search, User, Globe, Users, Lock, ChevronDown, BookOpen } from 'lucide-react';
import { NoteStatus, UserRole } from '../types';
import { CURRENT_USER, MOCK_INSTRUCTORS, MOCK_MY_COURSES } from '../constants';

const UploadPage = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [university, setUniversity] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'PUBLIC' | 'CLASS'>('PUBLIC');
  const [selectedClassId, setSelectedClassId] = useState('');
  
  // Teacher Search State
  const [teacherSearch, setTeacherSearch] = useState('');
  const [showTeacherSuggestions, setShowTeacherSuggestions] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    if (visibility === 'CLASS' && !selectedClassId) {
        alert('لطفا کلاسی که می‌خواهید جزوه را برای آن ارسال کنید انتخاب نمایید.');
        return;
    }

    setUploading(true);
    // Simulate upload delay
    setTimeout(() => {
        setUploading(false);
        setSuccess(true);
        // Reset form would happen here
    }, 2000);
  };

  // Filter instructors based on search
  const filteredInstructors = MOCK_INSTRUCTORS.filter(inst => 
    inst.name.includes(teacherSearch)
  );

  const selectTeacher = (name: string, id: string) => {
      setTeacherSearch(name);
      setSelectedTeacherId(id);
      setShowTeacherSuggestions(false);
  };

  const handleClassSelect = (classId: string) => {
      setSelectedClassId(classId);
      const selectedClass = MOCK_MY_COURSES.find(c => c.id === classId);
      if (selectedClass) {
          setCourse(selectedClass.title);
          // Optional: Pre-fill instructor if known
          // setTeacherSearch(selectedClass.instructor);
      }
  };

  if (success) {
      return (
          <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <Check size={40} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">بارگذاری با موفقیت انجام شد</h2>
              <p className="text-slate-500 mb-8 max-w-md">جزوه شما با موفقیت منتشر شد و هم‌اکنون برای سایر دانشجویان قابل مشاهده است.</p>
              <button
                onClick={() => {
                    setSuccess(false);
                    setFile(null);
                    setTitle('');
                    setCourse('');
                    setFieldOfStudy('');
                    setUniversity('');
                    setDescription('');
                    setTeacherSearch('');
                    setSelectedTeacherId(null);
                    setVisibility('PUBLIC');
                    setSelectedClassId('');
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                  بارگذاری جزوه دیگر
              </button>
          </div>
      )
  }

  return (
    <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-8">بارگذاری جزوه جدید</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload Zone */}
            <div 
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                    dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white hover:border-slate-400'
                } ${file ? 'border-green-500 bg-green-50/30' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleChange}
                    accept=".pdf,.docx,.pptx"
                />
                
                {file ? (
                    <div className="flex items-center justify-center gap-3">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                            <File className="text-green-600" size={32} />
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-slate-800">{file.name}</p>
                            <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button 
                            type="button"
                            onClick={(e) => { e.preventDefault(); setFile(null); }}
                            className="mr-auto p-2 hover:bg-red-100 rounded-full text-red-500 z-10"
                        >
                            <X size={20} />
                        </button>
                    </div>
                ) : (
                    <div className="pointer-events-none">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <UploadCloud size={32} />
                        </div>
                        <p className="text-lg font-bold text-slate-700 mb-1">فایل را اینجا بکشید و رها کنید</p>
                        <p className="text-sm text-slate-500">یا برای انتخاب فایل کلیک کنید (PDF, DOCX, PPTX)</p>
                    </div>
                )}
            </div>

            {/* Visibility Selector */}
            <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700">سطح دسترسی</label>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setVisibility('PUBLIC')}
                        className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                            visibility === 'PUBLIC' 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-slate-200 hover:border-slate-300 text-slate-600'
                        }`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${visibility === 'PUBLIC' ? 'bg-blue-200' : 'bg-slate-100'}`}>
                            <Globe size={20} />
                        </div>
                        <div className="text-right">
                            <span className="block font-bold text-sm">عمومی</span>
                            <span className="block text-xs opacity-70">قابل مشاهده برای همه</span>
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => setVisibility('CLASS')}
                        className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                            visibility === 'CLASS' 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-slate-200 hover:border-slate-300 text-slate-600'
                        }`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${visibility === 'CLASS' ? 'bg-blue-200' : 'bg-slate-100'}`}>
                            <Users size={20} />
                        </div>
                        <div className="text-right">
                            <span className="block font-bold text-sm">کلاسی</span>
                            <span className="block text-xs opacity-70">فقط دانشجویان کلاس</span>
                        </div>
                    </button>
                </div>
            </div>

             {/* Class Selector (Conditional) */}
             {visibility === 'CLASS' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <BookOpen size={16} />
                        انتخاب کلاس مربوطه
                    </label>
                    <div className="relative">
                        <select
                            required={visibility === 'CLASS'}
                            value={selectedClassId}
                            onChange={(e) => handleClassSelect(e.target.value)}
                            className="w-full px-4 py-3 appearance-none rounded-xl border-2 border-blue-100 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
                        >
                            <option value="">لطفا یک کلاس را انتخاب کنید...</option>
                            {MOCK_MY_COURSES.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.title} - {course.instructor}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                    </div>
                </div>
            )}

            {/* Meta Data Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">عنوان جزوه</label>
                    <input
                        required
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="مثال: جزوه ریاضی ۱ دکتر..."
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">رشته تحصیلی</label>
                    <input
                        required
                        type="text"
                        value={fieldOfStudy}
                        onChange={(e) => setFieldOfStudy(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="مثال: مهندسی کامپیوتر"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">نام درس</label>
                    <input
                        required
                        type="text"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="نام درس مربوطه"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">دانشگاه <span className="text-slate-400 font-normal">(اختیاری)</span></label>
                    <input
                        type="text"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="نام دانشگاه"
                    />
                </div>
                 <div className="space-y-2 relative">
                    <label className="text-sm font-bold text-slate-700">استاد درس <span className="text-slate-400 font-normal">(اختیاری)</span></label>
                    <div className="relative">
                        <input 
                            type="text"
                            value={teacherSearch}
                            onChange={(e) => {
                                setTeacherSearch(e.target.value);
                                setShowTeacherSuggestions(true);
                                setSelectedTeacherId(null);
                            }}
                            onFocus={() => setShowTeacherSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowTeacherSuggestions(false), 200)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                            placeholder="جستجوی نام استاد..."
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    </div>
                    
                    {/* Suggestions Dropdown */}
                    {showTeacherSuggestions && teacherSearch && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                            {filteredInstructors.length > 0 ? (
                                filteredInstructors.map(inst => (
                                    <button
                                        key={inst.id}
                                        type="button"
                                        onClick={() => selectTeacher(inst.name, inst.id)}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-right"
                                    >
                                        <img src={inst.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
                                        <div className="flex-1">
                                            <p className="font-bold text-sm text-slate-800">{inst.name}</p>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="p-3 text-center text-sm text-slate-500">
                                    استادی یافت نشد. می‌توانید نام را دستی وارد کنید.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">توضیحات تکمیلی</label>
                <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="توضیحاتی در مورد محتوای جزوه، نویسنده، و نکات مهم..."
                ></textarea>
            </div>

            <div className="pt-4">
                <button 
                    type="submit" 
                    disabled={!file || uploading}
                    className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2
                        ${!file || uploading ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl'}
                    `}
                >
                    {uploading ? (
                        <>
                           <Loader2 className="animate-spin" />
                           در حال بارگذاری...
                        </>
                    ) : (
                        'ارسال جزوه'
                    )}
                </button>
            </div>
        </form>
    </div>
  );
};

export default UploadPage;

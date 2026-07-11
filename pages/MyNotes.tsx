
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_NOTES, CURRENT_USER, MOCK_MY_COURSES } from '../constants';
import { Note, NoteStatus } from '../types';
import { FileText, Edit, Trash2, Eye, Clock, CheckCircle, XCircle, Plus, Save, X, Globe, Users, BookOpen, ChevronDown, Download } from 'lucide-react';

const MyNotesPage = () => {
    // State for notes (initialized from mock)
    const [notes, setNotes] = useState(MOCK_NOTES.filter(n => n.author.id === CURRENT_USER.id));
    const [filter, setFilter] = useState<'ALL' | 'PUBLISHED' | 'PENDING' | 'REJECTED'>('ALL');

    // Edit Modal State
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        course: '',
        visibility: 'PUBLIC' as 'PUBLIC' | 'CLASS',
        classId: '' // Track selected class for class-only notes
    });

    const filteredNotes = filter === 'ALL' 
        ? notes 
        : notes.filter(n => n.status === filter);

    const handleDelete = (id: string) => {
        if (window.confirm('آیا از حذف این جزوه اطمینان دارید؟')) {
            setNotes(prev => prev.filter(n => n.id !== id));
        }
    };

    const handleEditClick = (note: Note) => {
        setEditingNote(note);
        setEditForm({
            title: note.title,
            description: note.description,
            course: note.course,
            visibility: note.visibility,
            classId: '' // In a real app, we'd map this from the note data
        });
    };

    const handleClassSelect = (classId: string) => {
        const selectedClass = MOCK_MY_COURSES.find(c => c.id === classId);
        setEditForm(prev => ({
            ...prev,
            classId: classId,
            course: selectedClass ? selectedClass.title : prev.course
        }));
    };

    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingNote) return;

        if (editForm.visibility === 'CLASS' && !editForm.classId && editForm.visibility !== editingNote.visibility) {
             // Simple check: if switching to CLASS, enforce selection. 
             // Logic can be more complex if note was already CLASS.
             if(!editForm.classId) {
                alert('لطفا کلاس مربوطه را انتخاب کنید.');
                return;
             }
        }

        setNotes(prev => prev.map(n => 
            n.id === editingNote.id 
                ? { ...n, ...editForm } 
                : n
        ));
        setEditingNote(null);
    };

    const handleDownloadAll = () => {
        if (filteredNotes.length === 0) {
             alert('هیچ موردی برای دانلود وجود ندارد.');
             return;
        }
        alert(`در حال دانلود ${filteredNotes.length} فایل...`);
    };

    const getStatusConfig = (status: NoteStatus) => {
        switch (status) {
            case NoteStatus.PUBLISHED:
                return { color: 'text-green-600 bg-green-50', icon: CheckCircle, label: 'منتشر شده' };
            case NoteStatus.PENDING:
                return { color: 'text-amber-600 bg-amber-50', icon: Clock, label: 'در انتظار تایید' };
            case NoteStatus.REJECTED:
                return { color: 'text-red-600 bg-red-50', icon: XCircle, label: 'رد شده' };
            default:
                return { color: 'text-slate-600 bg-slate-50', icon: FileText, label: 'نامشخص' };
        }
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="text-blue-600" />
                        جزوات من
                    </h1>
                    <p className="text-slate-500">مدیریت جزواتی که بارگذاری کرده‌اید.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button 
                        onClick={handleDownloadAll}
                        className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <Download size={20} />
                        دانلود همه
                    </button>
                    <Link to="/upload" className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200">
                        <Plus size={20} />
                        بارگذاری جزوه جدید
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
                <button 
                    onClick={() => setFilter('ALL')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${filter === 'ALL' ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                    همه ({notes.length})
                </button>
                <button 
                    onClick={() => setFilter(NoteStatus.PUBLISHED)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${filter === NoteStatus.PUBLISHED ? 'bg-green-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-green-50 hover:text-green-600 hover:border-green-200'}`}
                >
                    منتشر شده ({notes.filter(n => n.status === NoteStatus.PUBLISHED).length})
                </button>
                <button 
                    onClick={() => setFilter(NoteStatus.PENDING)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${filter === NoteStatus.PENDING ? 'bg-amber-500 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200'}`}
                >
                    در انتظار ({notes.filter(n => n.status === NoteStatus.PENDING).length})
                </button>
                <button 
                    onClick={() => setFilter(NoteStatus.REJECTED)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${filter === NoteStatus.REJECTED ? 'bg-red-500 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200'}`}
                >
                    رد شده ({notes.filter(n => n.status === NoteStatus.REJECTED).length})
                </button>
            </div>

            {/* List */}
            {filteredNotes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNotes.map(note => {
                        const statusConfig = getStatusConfig(note.status);
                        const StatusIcon = statusConfig.icon;
                        
                        return (
                            <div key={note.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col">
                                <div className="relative h-40 bg-slate-100">
                                    <img src={note.thumbnailUrl} alt={note.title} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-700 shadow-sm">
                                        {note.fileType.toUpperCase()}
                                    </div>
                                    <div className={`absolute bottom-2 right-2 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${statusConfig.color} bg-white/90 backdrop-blur-sm shadow-sm`}>
                                        <StatusIcon size={12} />
                                        {statusConfig.label}
                                    </div>
                                    {note.visibility === 'CLASS' && (
                                        <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
                                            <Users size={12} />
                                            کلاسی
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">{note.title}</h3>
                                    <p className="text-sm text-slate-500 mb-4">{note.course} • {note.university}</p>
                                    
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                                        <div className="flex items-center gap-3 text-sm text-slate-400">
                                            <span className="flex items-center gap-1"><Eye size={14} /> {note.views}</span>
                                            <span className="flex items-center gap-1"><Clock size={14} /> {note.createdAt}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link to={`/note/${note.id}`} className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors" title="مشاهده">
                                                <Eye size={18} />
                                            </Link>
                                            <button 
                                                onClick={() => handleEditClick(note)}
                                                className="p-2 hover:bg-amber-50 text-slate-400 hover:text-amber-600 rounded-lg transition-colors" 
                                                title="ویرایش"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(note.id)}
                                                className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors" 
                                                title="حذف"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white border-2 border-dashed border-slate-300 rounded-3xl p-12 text-center">
                    <FileText className="mx-auto text-slate-300 mb-4" size={64} />
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                        {filter === 'ALL' ? 'هنوز جزوه‌ای بارگذاری نکرده‌اید' : 'جزوه‌ای با این وضعیت یافت نشد'}
                    </h3>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">
                        با به اشتراک‌گذاری جزوات خود، به هم‌کلاسی‌هایتان کمک کنید و امتیاز کسب نمایید.
                    </p>
                    {filter === 'ALL' && (
                        <Link to="/upload" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                            <Plus size={20} />
                            اولین جزوه خود را بارگذاری کنید
                        </Link>
                    )}
                </div>
            )}

            {/* Edit Modal */}
            {editingNote && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-4 border-b border-slate-100 sticky top-0 bg-white z-10">
                            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                <Edit size={20} className="text-blue-600" />
                                ویرایش جزوه
                            </h3>
                            <button 
                                onClick={() => setEditingNote(null)}
                                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">عنوان جزوه</label>
                                <input 
                                    type="text" 
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">سطح دسترسی</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setEditForm({...editForm, visibility: 'PUBLIC'})}
                                        className={`p-3 rounded-xl border flex items-center gap-2 justify-center transition-all ${
                                            editForm.visibility === 'PUBLIC' 
                                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                            : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                                        }`}
                                    >
                                        <Globe size={18} />
                                        <span className="font-bold text-sm">عمومی</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditForm({...editForm, visibility: 'CLASS'})}
                                        className={`p-3 rounded-xl border flex items-center gap-2 justify-center transition-all ${
                                            editForm.visibility === 'CLASS' 
                                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                            : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                                        }`}
                                    >
                                        <Users size={18} />
                                        <span className="font-bold text-sm">هم‌کلاسی‌ها</span>
                                    </button>
                                </div>
                            </div>

                             {/* Class Selector (Conditional) */}
                             {editForm.visibility === 'CLASS' && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <BookOpen size={16} />
                                        انتخاب کلاس مربوطه
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={editForm.classId}
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

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">نام درس</label>
                                <input 
                                    type="text" 
                                    value={editForm.course}
                                    onChange={(e) => setEditForm({...editForm, course: e.target.value})}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">توضیحات</label>
                                <textarea 
                                    rows={4}
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button 
                                    type="submit" 
                                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Save size={18} />
                                    ذخیره تغییرات
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setEditingNote(null)}
                                    className="px-6 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                                >
                                    انصراف
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyNotesPage;

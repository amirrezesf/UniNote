import React, { useState } from 'react';
import { MOCK_NOTES } from '../constants';
import { NoteStatus, Note } from '../types';
import { CheckCircle, XCircle, FileText, AlertCircle } from 'lucide-react';

const ModerationPage = () => {
    // In a real app, we would fetch pending notes from an API
    const [pendingNotes, setPendingNotes] = useState<Note[]>(
        MOCK_NOTES.filter(n => n.status === NoteStatus.PENDING)
    );

    const handleApprove = (id: string) => {
        setPendingNotes(prev => prev.filter(n => n.id !== id));
        // API call to approve would go here
    };

    const handleReject = (id: string) => {
        setPendingNotes(prev => prev.filter(n => n.id !== id));
        // API call to reject would go here
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">پنل مدیریت محتوا</h1>
                    <p className="text-slate-500">بررسی و تایید جزوات بارگذاری شده توسط دانشجویان.</p>
                </div>
                <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                    <AlertCircle size={16} />
                    {pendingNotes.length} مورد در انتظار بررسی
                </div>
            </div>

            <div className="space-y-4">
                {pendingNotes.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                        <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-slate-800">همه چیز مرتب است!</h3>
                        <p className="text-slate-500">هیچ جزوه جدیدی برای بررسی وجود ندارد.</p>
                    </div>
                ) : (
                    pendingNotes.map(note => (
                        <div key={note.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row gap-6">
                            {/* File Preview Thumbnail */}
                            <div className="w-full md:w-48 aspect-video bg-slate-100 rounded-xl overflow-hidden relative flex-shrink-0">
                                <img src={note.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <FileText className="text-white drop-shadow-md" size={32} />
                                </div>
                            </div>

                            {/* Details */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-slate-900">{note.title}</h3>
                                    <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">{note.createdAt}</span>
                                </div>
                                <p className="text-slate-600 text-sm mb-4">{note.description}</p>
                                
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-500 mb-6">
                                    <div className="bg-slate-50 p-2 rounded-lg">
                                        <span className="block text-slate-400 mb-1">دانشگاه</span>
                                        <span className="font-bold text-slate-700">{note.university}</span>
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded-lg">
                                        <span className="block text-slate-400 mb-1">درس</span>
                                        <span className="font-bold text-slate-700">{note.course}</span>
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded-lg">
                                        <span className="block text-slate-400 mb-1">فرستنده</span>
                                        <span className="font-bold text-slate-700">{note.author.name}</span>
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded-lg">
                                        <span className="block text-slate-400 mb-1">فایل</span>
                                        <span className="font-bold text-slate-700 dir-ltr text-left block">{note.fileType.toUpperCase()} (2.4 MB)</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => handleApprove(note.id)}
                                        className="flex-1 bg-green-600 text-white py-2 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={18} />
                                        تایید و انتشار
                                    </button>
                                    <button 
                                        onClick={() => handleReject(note.id)}
                                        className="flex-1 bg-white border border-red-200 text-red-600 py-2 rounded-xl font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <XCircle size={18} />
                                        رد کردن
                                    </button>
                                    <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition-colors">
                                        مشاهده فایل
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ModerationPage;

import React, { useState } from 'react';
import { Play, Download, Calendar, User, BookOpen, Clock, Search, Film, Sparkles, Loader2, Info } from 'lucide-react';
import { MOCK_ONLINE_CLASSES } from '../constants';
import { generateVideoSummary } from '../services/geminiService';

const RecordedClassesPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVideo, setSelectedVideo] = useState<any>(null);
    const [videoSummary, setVideoSummary] = useState<string | null>(null);
    const [loadingSummary, setLoadingSummary] = useState(false);

    const recordedClasses = MOCK_ONLINE_CLASSES.filter(c => c.status === 'ENDED' && c.videoUrl);

    const filteredRecordings = recordedClasses.filter(c => 
        c.courseTitle.includes(searchQuery) || 
        c.topic.includes(searchQuery) || 
        c.instructor.includes(searchQuery)
    );

    const handleSelectVideo = (video: any) => {
        setSelectedVideo(video);
        setVideoSummary(null); // Reset summary when changing video
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleGenerateAiSummary = async () => {
        if (!selectedVideo) return;
        setLoadingSummary(true);
        try {
            const summary = await generateVideoSummary(selectedVideo.courseTitle, selectedVideo.topic);
            setVideoSummary(summary);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingSummary(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Film className="text-blue-600" />
                        آرشیو کلاس‌های ضبط شده
                    </h1>
                    <p className="text-slate-500">مشاهده و دانلود جلسات برگزار شده قبلی.</p>
                </div>
                
                <div className="relative w-full md:w-72">
                    <input 
                        type="text" 
                        placeholder="جستجو در آرشیو..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-4 pr-10 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                </div>
            </div>

            {selectedVideo && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5">
                        <div className="aspect-video bg-black relative group">
                            <video 
                                src={selectedVideo.videoUrl} 
                                controls 
                                autoPlay
                                className="w-full h-full"
                            />
                            <button 
                                onClick={() => { setSelectedVideo(null); setVideoSummary(null); }}
                                className="absolute top-4 left-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2 rounded-full transition-colors"
                            >
                                بستن پخش‌کننده
                            </button>
                        </div>
                        <div className="p-6 md:p-8">
                            <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-6">
                                <div className="space-y-2">
                                    <h2 className="text-xl md:text-2xl font-black text-white">{selectedVideo.topic}</h2>
                                    <div className="flex flex-wrap gap-4 text-slate-400 text-sm">
                                        <span className="flex items-center gap-1"><BookOpen size={16} /> {selectedVideo.courseTitle}</span>
                                        <span className="flex items-center gap-1"><User size={16} /> {selectedVideo.instructor}</span>
                                        <span className="flex items-center gap-1"><Calendar size={16} /> {selectedVideo.date}</span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <button 
                                        onClick={handleGenerateAiSummary}
                                        disabled={loadingSummary}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-900/40 disabled:opacity-50"
                                    >
                                        {loadingSummary ? (
                                            <Loader2 size={20} className="animate-spin" />
                                        ) : (
                                            <Sparkles size={20} />
                                        )}
                                        خلاصه‌سازی با هوش مصنوعی
                                    </button>
                                    <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all border border-white/10">
                                        <Download size={20} />
                                        دانلود ویدیو
                                    </button>
                                </div>
                            </div>

                            {/* AI Summary Box */}
                            {(videoSummary || loadingSummary) && (
                                <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-3xl p-6 md:p-8 animate-in zoom-in duration-300">
                                    <div className="flex items-center gap-3 text-indigo-400 font-bold mb-4">
                                        <Sparkles size={24} />
                                        <h3>خلاصه و سرفصل‌های هوشمند جلسه</h3>
                                    </div>
                                    {loadingSummary ? (
                                        <div className="flex flex-col items-center py-8 text-indigo-300">
                                            <Loader2 size={32} className="animate-spin mb-4" />
                                            <p className="animate-pulse">در حال تحلیل محتوای ویدیو و استخراج نکات کلیدی...</p>
                                        </div>
                                    ) : (
                                        <div className="text-indigo-100/90 leading-relaxed text-sm md:text-base space-y-4">
                                            <div className="whitespace-pre-wrap">
                                                {videoSummary}
                                            </div>
                                            <div className="pt-4 border-t border-indigo-500/20 flex items-center gap-2 text-[10px] text-indigo-400 uppercase tracking-widest font-bold">
                                                <Info size={12} />
                                                تولید شده توسط مدل Gemini 2.5 Flash
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecordings.length > 0 ? (
                    filteredRecordings.map(recording => (
                        <div 
                            key={recording.id} 
                            className={`group bg-white rounded-3xl border overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col ${selectedVideo?.id === recording.id ? 'ring-2 ring-blue-500 border-blue-500 shadow-lg' : 'border-slate-200 hover:border-blue-300'}`}
                        >
                            <div className="relative aspect-video overflow-hidden bg-slate-100">
                                <img 
                                    src={recording.thumbnailUrl} 
                                    alt={recording.topic} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleSelectVideo(recording)}
                                        className="bg-white text-blue-600 p-4 rounded-full shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300"
                                    >
                                        <Play size={24} fill="currentColor" />
                                    </button>
                                </div>
                                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded font-bold">
                                    {recording.duration} دقیقه
                                </div>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-lg">
                                        <Sparkles size={16} />
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-1 rounded-md font-black">
                                        {recording.courseTitle}
                                    </span>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                    {recording.topic}
                                </h3>
                                
                                <div className="mt-auto pt-4 border-t border-slate-50 space-y-2">
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <User size={14} className="text-slate-400" />
                                            {recording.instructor}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} className="text-slate-400" />
                                            {recording.date}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => handleSelectVideo(recording)}
                                        className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${selectedVideo?.id === recording.id ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600'}`}
                                    >
                                        <Play size={14} />
                                        {selectedVideo?.id === recording.id ? 'در حال پخش...' : 'مشاهده فیلم کلاس'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-slate-300 text-center">
                        <Film size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-500 font-medium">هیچ ویدیوی ضبط شده‌ای یافت نشد.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecordedClassesPage;

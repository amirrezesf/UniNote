
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Video, Calendar, Clock, Monitor, ExternalLink, PlayCircle } from 'lucide-react';
import { MOCK_ONLINE_CLASSES } from '../constants';

const OnlineClassesPage = () => {
    const [filter, setFilter] = useState<'UPCOMING' | 'ENDED'>('UPCOMING');
    
    const filteredClasses = MOCK_ONLINE_CLASSES.filter(c => {
        if (filter === 'UPCOMING') return c.status !== 'ENDED';
        return c.status === 'ENDED';
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Monitor className="text-blue-600" />
                        کلاس‌های آنلاین
                    </h1>
                    <p className="text-slate-500">لیست کلاس‌های مجازی و جلسات آنلاین شما.</p>
                </div>
                
                 <div className="flex bg-white rounded-xl border border-slate-200 p-1">
                    <button 
                        onClick={() => setFilter('UPCOMING')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'UPCOMING' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        پیش‌رو
                    </button>
                    <button 
                        onClick={() => setFilter('ENDED')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'ENDED' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        برگزار شده
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredClasses.length > 0 ? (
                    filteredClasses.map(cls => (
                        <div key={cls.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row items-center gap-6 hover:shadow-lg transition-all">
                            <div className="flex-shrink-0 w-full md:w-28 bg-blue-50 rounded-xl p-4 flex flex-col items-center justify-center text-blue-700">
                                <span className="text-2xl font-bold">{cls.time}</span>
                                <span className="text-sm mt-1 font-medium whitespace-nowrap">{cls.date}</span>
                            </div>

                            <div className="flex-1 text-center md:text-right w-full">
                                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                                    <h3 className="text-lg font-bold text-slate-900">{cls.courseTitle}</h3>
                                    <span className="hidden md:inline text-slate-300">•</span>
                                    <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded-md inline-block">{cls.topic}</span>
                                </div>
                                
                                <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <Monitor size={16} className="text-slate-400" />
                                        {cls.platform}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={16} className="text-slate-400" />
                                        {cls.duration} دقیقه
                                    </span>
                                    <span className="flex items-center gap-1">
                                        استاد: {cls.instructor}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-shrink-0 w-full md:w-auto mt-2 md:mt-0">
                                {cls.status === 'UPCOMING' ? (
                                    <Link 
                                        to={`/online-class/${cls.id}`} 
                                        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors w-full md:w-auto shadow-lg shadow-blue-200"
                                    >
                                        <PlayCircle size={20} />
                                        ورود به کلاس
                                    </Link>
                                ) : (
                                    <button disabled className="flex items-center justify-center gap-2 bg-slate-100 text-slate-400 px-6 py-3 rounded-xl font-bold w-full md:w-auto cursor-not-allowed">
                                        پایان یافته
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
                        <Video size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-500 font-medium">هیچ کلاس آنلاینی در این بخش وجود ندارد.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OnlineClassesPage;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Calendar, Clock, Monitor, BookOpen, CheckCircle, Loader2, Link as LinkIcon } from 'lucide-react';
import { MOCK_MY_COURSES } from '../constants';

const RequestOnlineClassPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        courseId: '',
        topic: '',
        date: '',
        time: '',
        duration: '90',
        platform: 'ADOBE_CONNECT',
        link: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setSuccess(true);
            setTimeout(() => {
                navigate('/my-courses');
            }, 2000);
        }, 1500);
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in zoom-in duration-300">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-200">
                    <CheckCircle size={48} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">درخواست ثبت شد!</h2>
                <p className="text-slate-500">اطلاعیه کلاس آنلاین برای دانشجویان ارسال گردید.</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                        <Video size={24} />
                    </div>
                    درخواست کلاس آنلاین
                </h1>
                <p className="text-slate-500">
                    رزرو کلاس جبرانی یا رفع اشکال آنلاین. اطلاعیه به صورت خودکار برای دانشجویان ارسال می‌شود.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                
                {/* Course Selection */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <BookOpen size={16} className="text-blue-500" />
                        انتخاب درس
                    </label>
                    <select 
                        required
                        value={formData.courseId}
                        onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">لطفا یک درس را انتخاب کنید...</option>
                        {MOCK_MY_COURSES.map(course => (
                            <option key={course.id} value={course.id}>{course.title} - {course.instructor}</option>
                        ))}
                    </select>
                </div>

                {/* Topic */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">موضوع جلسه</label>
                    <input 
                        type="text" 
                        required
                        value={formData.topic}
                        onChange={(e) => setFormData({...formData, topic: e.target.value})}
                        placeholder="مثال: کلاس جبرانی مبحث انتگرال"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Calendar size={16} className="text-blue-500" />
                            تاریخ برگزاری
                        </label>
                        <input 
                            type="date" 
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Clock size={16} className="text-blue-500" />
                            ساعت شروع
                        </label>
                        <input 
                            type="time" 
                            required
                            value={formData.time}
                            onChange={(e) => setFormData({...formData, time: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                        />
                    </div>
                </div>

                {/* Platform & Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Monitor size={16} className="text-blue-500" />
                            بستر برگزاری
                        </label>
                        <select 
                            value={formData.platform}
                            onChange={(e) => setFormData({...formData, platform: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="ADOBE_CONNECT">Adobe Connect</option>
                            <option value="SKYROOM">Skyroom</option>
                            <option value="GOOGLE_MEET">Google Meet</option>
                            <option value="BIGBLUEBUTTON">BigBlueButton</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">مدت زمان</label>
                        <select 
                            value={formData.duration}
                            onChange={(e) => setFormData({...formData, duration: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="45">۴۵ دقیقه</option>
                            <option value="60">۱ ساعت</option>
                            <option value="90">۱ ساعت و ۳۰ دقیقه</option>
                            <option value="120">۲ ساعت</option>
                        </select>
                    </div>
                </div>

                {/* Link (Optional) */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <LinkIcon size={16} className="text-slate-400" />
                        لینک کلاس (اختیاری)
                    </label>
                    <input 
                        type="url" 
                        value={formData.link}
                        onChange={(e) => setFormData({...formData, link: e.target.value})}
                        placeholder="https://vc.university.ac.ir/class-101"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-left dir-ltr"
                    />
                    <p className="text-xs text-slate-400">در صورت خالی ماندن، لینک پیش‌فرض درس استفاده خواهد شد.</p>
                </div>

                <div className="pt-4 flex gap-4">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : 'ثبت درخواست کلاس'}
                    </button>
                    <button 
                        type="button" 
                        onClick={() => navigate(-1)}
                        className="px-6 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                    >
                        انصراف
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RequestOnlineClassPage;

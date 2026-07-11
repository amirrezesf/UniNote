
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, User, CheckCircle } from 'lucide-react';

const AddCoursePage = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [instructor, setInstructor] = useState('');
    const [day, setDay] = useState('شنبه');
    const [time, setTime] = useState('');
    const [color, setColor] = useState('blue');
    const [success, setSuccess] = useState(false);

    const colors = [
        { id: 'blue', class: 'bg-blue-100 text-blue-600 border-blue-200' },
        { id: 'emerald', class: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
        { id: 'amber', class: 'bg-amber-100 text-amber-600 border-amber-200' },
        { id: 'rose', class: 'bg-rose-100 text-rose-600 border-rose-200' },
        { id: 'purple', class: 'bg-purple-100 text-purple-600 border-purple-200' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would send data to API
        setSuccess(true);
        setTimeout(() => {
            navigate('/my-courses');
        }, 1500);
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in zoom-in duration-300">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-100">
                    <CheckCircle size={48} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">درس جدید اضافه شد!</h2>
                <p className="text-slate-500">شما به لیست درس‌های خود منتقل می‌شوید...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 text-slate-500 mb-6 text-sm">
                <Link to="/my-courses" className="hover:text-blue-600 transition-colors">درس‌های من</Link>
                <span>/</span>
                <span className="text-slate-800 font-bold">افزودن درس جدید</span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-8">ایجاد کلاس درس جدید</h1>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <BookOpen size={16} />
                        نام درس
                    </label>
                    <input 
                        type="text" 
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="مثال: ریاضی مهندسی"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <User size={16} />
                        نام استاد
                    </label>
                    <input 
                        type="text" 
                        required
                        value={instructor}
                        onChange={(e) => setInstructor(e.target.value)}
                        placeholder="مثال: دکتر حسینی"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Clock size={16} />
                            روز برگزاری
                        </label>
                        <select 
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="شنبه">شنبه</option>
                            <option value="یک‌شنبه">یک‌شنبه</option>
                            <option value="دوشنبه">دوشنبه</option>
                            <option value="سه‌شنبه">سه‌شنبه</option>
                            <option value="چهارشنبه">چهارشنبه</option>
                            <option value="پنج‌شنبه">پنج‌شنبه</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">ساعت</label>
                        <input 
                            type="text" 
                            required
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            placeholder="مثال: ۱۰:۳۰"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-center"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700">رنگ درس</label>
                    <div className="flex flex-wrap gap-3">
                        {colors.map((c) => (
                            <button
                                key={c.id}
                                type="button"
                                onClick={() => setColor(c.id)}
                                className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center ${c.class} ${color === c.id ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'opacity-70 hover:opacity-100'}`}
                            >
                                {color === c.id && <CheckCircle size={20} />}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-6 flex gap-4">
                    <button 
                        type="submit" 
                        className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                    >
                        ذخیره درس
                    </button>
                    <Link 
                        to="/my-courses"
                        className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center"
                    >
                        انصراف
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default AddCoursePage;


import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, Target, FileText, Users, ArrowLeft, ShieldCheck, HelpCircle, Rocket, Sparkles } from 'lucide-react';

const IdeaFestivalPage = () => {
    const goals = [
        "شناسایی و حمایت از ایده‌های نوآورانه آموزشی در سطح دانشگاه",
        "تقویت توانمندی دانشجویان در طراحی و مستندسازی ایده",
        "تمرین ارائه، مستندسازی و دریافت بازخورد قبل از جشنواره کشوری",
        "افزایش مشارکت دانشجویان در ارتقای فرآیندهای یاددهی-ی یادگیری",
        "ایجاد فضای رقابتی سالم و توسعه مهارت‌های نوآوری آموزشی"
    ];

    const scenarios = [
        {
            id: 's1',
            title: 'توقف آموزش در جنگ ۱۲ روزه',
            description: 'در دوران جنگ ۱۲ روزه، فعالیت‌های آموزشی دانشگاه‌های علوم پزشکی متوقف شده و فقط خدمات درمانی ارائه می‌شود. چالش اصلی، ناتمام ماندن کلاس‌ها و امتحانات پایان ترم است...',
            tag: 'سناریوی اصلی ۱۴۰۵'
        }
    ];

    return (
        <div className="space-y-8 pb-12">
            {/* Hero Section */}
            <div className="relative bg-white rounded-[3rem] border border-slate-200 overflow-hidden p-8 md:p-12 shadow-sm">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-blue-600 to-indigo-600"></div>
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-bold border border-amber-100">
                            <Sparkles size={16} />
                            جشنواره درون‌دانشگاهی جندی شاپور
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                            جشنواره ایده‌های <span className="text-blue-600">نوآورانه آموزشی</span>
                        </h1>
                        <p className="text-slate-600 leading-relaxed text-justify">
                            این جشنواره با هدف شناس
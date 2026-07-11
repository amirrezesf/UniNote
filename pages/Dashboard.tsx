import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MATERIALS, UNIVERSITIES, FIELDS, TEACHERS, COURSES, CURRENT_USER } from '../constants';
import { NoteStatus } from '../types';
import { Search as SearchIcon, Compass, Clock, TrendingUp, ArrowLeft, Building2, GraduationCap, BookOpen, FileText } from 'lucide-react';
import MaterialCard from '../components/MaterialCard';
import TeacherCard from '../components/TeacherCard';
import StatPill from '../components/StatPill';

export default function Dashboard() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const published = MATERIALS.filter(m => m.status === NoteStatus.PUBLISHED);
  const newest = [...published].slice(0, 3);
  const trending = [...published].sort((a, b) => b.views - a.views).slice(0, 3);
  const featuredTeachers = TEACHERS.filter(t => t.isVerified).slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : '/search');
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-3">سلام، {CURRENT_USER.name} 👋</h1>
          <p className="text-blue-100 text-lg max-w-2xl mb-6">به دایرکتوری ملی جزوات دانشگاهی خوش آمدید. منابع دقیق درس هر استاد را از هر دانشگاه و رشته پیدا کنید.</p>
          <form onSubmit={handleSearch} className="relative max-w-2xl mb-4">
            <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="جستجوی جزوه، نمونه سوال، استاد، درس..."
              className="w-full pr-12 pl-4 py-3.5 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
            />
          </form>
          <div className="flex flex-wrap gap-3">
            <Link to="/browse" className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20 flex items-center gap-2">
              <Compass size={18} /> کاوش دانشگاه‌ها و اساتید
            </Link>
            <Link to="/upload" className="bg-blue-500/30 backdrop-blur-md text-white border border-white/20 px-6 py-3 rounded-xl font-bold hover:bg-blue-500/40 transition-colors">
              بارگذاری منبع جدید
            </Link>
          </div>
        </div>
      </div>

      {/* Directory stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatPill icon={Building2} value={UNIVERSITIES.length} label="دانشگاه" color="bg-blue-100 text-blue-600" />
        <StatPill icon={GraduationCap} value={TEACHERS.length} label="استاد" color="bg-indigo-100 text-indigo-600" />
        <StatPill icon={BookOpen} value={COURSES.length} label="درس" color="bg-emerald-100 text-emerald-600" />
        <StatPill icon={FileText} value={published.length} label="منبع آموزشی" color="bg-amber-100 text-amber-600" />
      </div>

      {/* Newest */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Clock className="text-blue-600" size={24} /> جدیدترین منابع</h2>
          <Link to="/search" className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">مشاهده همه<ArrowLeft size={16} /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newest.map(m => <MaterialCard key={m.id} material={m} showTeacher />)}
        </div>
      </section>

      {/* Trending */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><TrendingUp className="text-red-500" size={24} /> پربازدیدترین‌ها</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trending.map(m => <MaterialCard key={`trend-${m.id}`} material={m} showTeacher />)}
        </div>
      </section>

      {/* Featured teachers */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><GraduationCap className="text-indigo-600" size={24} /> اساتید شاخص</h2>
          <Link to="/browse" className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">مشاهده همه<ArrowLeft size={16} /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredTeachers.map(t => <TeacherCard key={t.id} teacher={t} />)}
        </div>
      </section>
    </div>
  );
}

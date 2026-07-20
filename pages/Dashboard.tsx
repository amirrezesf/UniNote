import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Compass, Clock, TrendingUp, ArrowLeft, Building2, GraduationCap, BookOpen, FileText } from 'lucide-react';
import { useUniversities, useFields, useTeachers, useCourses } from '../src/api/hooks/directory';
import { useMaterialsList, useLeaderboard } from '../src/api/hooks/materials';
import { useAuth } from '../src/context/AuthContext';
import { NoteStatus } from '../types';
import MaterialCard from '../components/MaterialCard';
import TeacherCard from '../components/TeacherCard';
import StatPill from '../components/StatPill';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const { data: materials, isLoading: materialsLoading } = useMaterialsList({ ordering: '-createdAt', page: 1 });
  const { data: universities, isLoading: unisLoading } = useUniversities();
  const { data: fields, isLoading: fieldsLoading } = useFields();
  const { data: teachers, isLoading: teachersLoading } = useTeachers();
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: leaderboard, isLoading: leaderboardLoading } = useLeaderboard();

  const published = materials?.filter(m => m.status === NoteStatus.PUBLISHED) || [];
  const newest = [...published].slice(0, 3);
  const trending = [...published].sort((a, b) => b.views - a.views).slice(0, 3);
  const featuredTeachers = teachers?.filter(t => t.isVerified).slice(0, 3) || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : '/search');
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-500 dark:to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 dark:opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-3 dark:text-white">سلام، {user?.name || 'مهمان'} 👋</h1>
          <p className="text-blue-100 dark:text-blue-300 text-lg max-w-2xl mb-6">به دایرکتوری ملی جزوات دانشگاهی خوش آمدید. منابع دقیق درس هر استاد را از هر دانشگاه و رشته پیدا کنید.</p>
          <form onSubmit={handleSearch} className="relative max-w-2xl mb-4">
            <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-gray-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="جستجوی جزوه، نمونه سوال، استاد، درس..."
              className="w-full pr-12 pl-4 py-3.5 rounded-xl text-slate-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50 dark:focus:ring-gray-800 shadow-lg"
            />
          </form>
          <div className="flex flex-wrap gap-3">
            <Link to="/browse" className="bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-400 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors shadow-lg shadow-blue-900/20 dark:shadow-blue-500/30 flex items-center gap-2">
              <Compass size={18} /> کاوش دانشگاه‌ها و اساتید
            </Link>
            <Link to="/upload" className="bg-blue-500/30 dark:bg-blue-900/30 backdrop-blur-md text-white dark:text-gray-100 border border-white/20 dark:border-gray-700/40 px-6 py-3 rounded-xl font-bold hover:bg-blue-500/40 dark:hover:bg-blue-800/40 transition-colors">
              بارگذاری منبع جدید
            </Link>
          </div>
        </div>
      </div>

      {/* Directory stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatPill icon={Building2} value={universities?.length ?? (unisLoading ? '—' : 0)} label="دانشگاه" color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
        <StatPill icon={GraduationCap} value={teachers?.length ?? (teachersLoading ? '—' : 0)} label="استاد" color="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" />
        <StatPill icon={BookOpen} value={courses?.length ?? (coursesLoading ? '—' : 0)} label="درس" color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" />
        <StatPill icon={FileText} value={published.length} label="منبع آموزشی" color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" />
      </div>

      {/* Newest */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-gray-100 flex items-center gap-2"><Clock className="text-blue-600 dark:text-blue-400" size={24} /> جدیدترین منابع</h2>
          <Link to="/search" className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">مشاهده همه<ArrowLeft size={16} /></Link>
        </div>
        {materialsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <MaterialCard key={`skeleton-${i}`} material={{ id: '', title: '', description: '', materialType: 'HANDOUT', uploader: { id: '', name: '', role: 'STUDENT', avatarUrl: '', points: 0 }, fieldId: '', courseId: '', teacherId: '', universityId: '', term: '', fileType: 'pdf', fileUrl: '', thumbnailUrl: '', status: 'PUBLISHED', likes: 0, views: 0, rating: 0, createdAt: '', tags: [], visibility: 'PUBLIC' }} skeleton />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newest.map(m => <MaterialCard key={m.id} material={m} showTeacher />)}
          </div>
        )}
      </section>

      {/* Trending */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-gray-100 flex items-center gap-2"><TrendingUp className="text-red-500 dark:text-red-400" size={24} /> پربازدیدترین‌ها</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trending.map(m => <MaterialCard key={`trend-${m.id}`} material={m} showTeacher />)}
        </div>
      </section>

      {/* Featured teachers */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-gray-100 flex items-center gap-2"><GraduationCap className="text-indigo-600 dark:text-indigo-400" size={24} /> اساتید شاخص</h2>
          <Link to="/browse" className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">مشاهده همه<ArrowLeft size={16} /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredTeachers.map(t => <TeacherCard key={t.id} teacher={t} />)}
        </div>
      </section>
    </div>
  );
}
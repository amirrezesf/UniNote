
import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_NOTES, CURRENT_USER } from '../constants';
import { FileText, Star, Clock, ArrowLeft, TrendingUp, BookOpen, BadgeCheck } from 'lucide-react';
import { Note, UserRole } from '../types';

const NoteCard: React.FC<{ note: Note }> = ({ note }) => {
  const isInstructor = note.author.role === UserRole.INSTRUCTOR;
  
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-300 flex flex-col h-full relative">
      <Link to={`/note/${note.id}`} className="absolute inset-0 z-0"></Link>
      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 mb-4 z-10 pointer-events-none">
        <img src={note.thumbnailUrl} alt={note.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-700 shadow-sm">
          {note.fileType.toUpperCase()}
        </div>
      </div>
      
      <div className="flex-1 z-10 pointer-events-none">
          <div className="flex items-start justify-between mb-2">
              <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-semibold">{note.course}</span>
              <div className="flex items-center gap-1 text-amber-500">
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs font-bold">{note.rating}</span>
              </div>
          </div>
          <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{note.title}</h3>
          <p className="text-sm text-slate-500 line-clamp-2 mb-3">{note.description}</p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto z-10">
          <Link to={`/profile/${note.author.id}`} className="flex items-center gap-2 hover:bg-slate-50 rounded-lg p-1 -ml-1 transition-colors">
              <img src={note.author.avatarUrl} className="w-6 h-6 rounded-full" alt="author" />
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-600 font-medium hover:text-blue-600">{note.author.name}</span>
                {isInstructor && (
                  <BadgeCheck size={14} className="text-blue-600 fill-blue-100" />
                )}
              </div>
          </Link>
          <span className="text-xs text-slate-400">{note.university}</span>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const publishedNotes = MOCK_NOTES.filter(n => n.status === 'PUBLISHED');
  
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-3">سلام، {CURRENT_USER.name} 👋</h1>
          <p className="text-blue-100 text-lg max-w-2xl mb-6">به ترم جدید خوش آمدید! تا الان ۱۲ جزوه جدید برای درس‌های شما بارگذاری شده است.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/search" className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20">
              جستجوی جزوات
            </Link>
            <Link to="/upload" className="bg-blue-500/30 backdrop-blur-md text-white border border-white/20 px-6 py-3 rounded-xl font-bold hover:bg-blue-500/40 transition-colors">
              بارگذاری جزوه جدید
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'مجموع جزوات', value: '۱,۴۲۰', icon: FileText, color: 'bg-emerald-100 text-emerald-600' },
          { label: 'بازدیدهای شما', value: '۸۵', icon: TrendingUp, color: 'bg-purple-100 text-purple-600' },
          { label: 'جزوات برتر', value: '۱۲', icon: Star, color: 'bg-amber-100 text-amber-600' },
          { label: 'درس‌های فعال', value: '۶', icon: BookOpen, color: 'bg-blue-100 text-blue-600' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Notes */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Clock className="text-blue-600" size={24} />
            جدیدترین جزوات
          </h2>
          <Link to="/search" className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
            مشاهده همه
            <ArrowLeft size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedNotes.slice(0, 3).map(note => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      </div>

       {/* Trending Section */}
       <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="text-red-500" size={24} />
            پربازدیدترین‌های هفته
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedNotes.slice(0, 2).map(note => (
            <NoteCard key={`trend-${note.id}`} note={note} />
          ))}
        </div>
      </div>
    </div>
  );
}

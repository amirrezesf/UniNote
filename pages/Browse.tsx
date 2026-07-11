import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UNIVERSITIES, FIELDS } from '../constants';
import { Search as SearchIcon, Building2, Layers, Compass } from 'lucide-react';
import UniversityCard from '../components/UniversityCard';
import FieldCard from '../components/FieldCard';

const Browse = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : '/search');
  };

  return (
    <div className="space-y-8">
      {/* Hero + search */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
            <Compass size={28} /> کاوش در دایرکتوری
          </h1>
          <p className="text-blue-100 mb-6 max-w-2xl">دانشگاه، رشته یا استاد مورد نظر خود را انتخاب کنید و به منابع دقیق درس‌ها دسترسی پیدا کنید.</p>
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="جستجوی جزوه، نمونه سوال، استاد، درس..."
              className="w-full pr-12 pl-4 py-3.5 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
            />
          </form>
        </div>
      </div>

      {/* Universities */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
          <Building2 className="text-blue-600" size={22} />
          دانشگاه‌ها
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {UNIVERSITIES.map(u => <UniversityCard key={u.id} university={u} />)}
        </div>
      </section>

      {/* Fields */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
          <Layers className="text-indigo-600" size={22} />
          رشته‌ها
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FIELDS.map(f => <FieldCard key={f.id} field={f} />)}
        </div>
      </section>
    </div>
  );
};

export default Browse;

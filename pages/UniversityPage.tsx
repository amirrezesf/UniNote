import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getUniversityById,
  getFieldsByUniversity,
  getTeachersByUniversity,
  getCoursesByUniversity,
  getMaterialsByUniversity,
} from '../constants';
import { Building2, Layers, GraduationCap, BookOpen, FileText } from 'lucide-react';
import EntityBreadcrumb from '../components/EntityBreadcrumb';
import StatPill from '../components/StatPill';
import FieldCard from '../components/FieldCard';
import TeacherCard from '../components/TeacherCard';
import EmptyState from '../components/EmptyState';

const UniversityPage = () => {
  const { id } = useParams<{ id: string }>();
  const university = getUniversityById(id);
  const [tab, setTab] = useState<'FIELDS' | 'TEACHERS'>('FIELDS');

  if (!university) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">دانشگاه مورد نظر یافت نشد</h2>
        <Link to="/browse" className="text-blue-600 hover:underline mt-4 inline-block">بازگشت به کاوش</Link>
      </div>
    );
  }

  const fields = getFieldsByUniversity(university.id);
  const teachers = getTeachersByUniversity(university.id);
  const courses = getCoursesByUniversity(university.id);
  const materials = getMaterialsByUniversity(university.id);

  const tabBtn = (active: boolean) =>
    `px-5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 ${active ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`;

  return (
    <div className="space-y-8">
      <EntityBreadcrumb items={[{ label: university.name }]} />

      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {university.logoUrl ? (
            <img src={university.logoUrl} alt={university.name} className="w-full h-full object-cover" />
          ) : (
            <Building2 size={36} />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{university.name}</h1>
          {university.city && <p className="text-slate-500">{university.city}</p>}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatPill icon={Layers} value={fields.length} label="رشته" color="bg-indigo-100 text-indigo-600" />
        <StatPill icon={GraduationCap} value={teachers.length} label="استاد" color="bg-blue-100 text-blue-600" />
        <StatPill icon={BookOpen} value={courses.length} label="درس" color="bg-emerald-100 text-emerald-600" />
        <StatPill icon={FileText} value={materials.length} label="منبع" color="bg-amber-100 text-amber-600" />
      </div>

      {/* Tabs */}
      <div className="flex gap-3">
        <button onClick={() => setTab('FIELDS')} className={tabBtn(tab === 'FIELDS')}>
          <Layers size={16} /> رشته‌ها
        </button>
        <button onClick={() => setTab('TEACHERS')} className={tabBtn(tab === 'TEACHERS')}>
          <GraduationCap size={16} /> اساتید
        </button>
      </div>

      {tab === 'FIELDS' ? (
        fields.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(f => <FieldCard key={f.id} field={f} />)}
          </div>
        ) : (
          <EmptyState icon={Layers} title="رشته‌ای برای این دانشگاه ثبت نشده است" />
        )
      ) : teachers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers.map(t => <TeacherCard key={t.id} teacher={t} />)}
        </div>
      ) : (
        <EmptyState icon={GraduationCap} title="استادی برای این دانشگاه ثبت نشده است" />
      )}
    </div>
  );
};

export default UniversityPage;

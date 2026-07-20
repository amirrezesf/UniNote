import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUniversity, useUniversityFields, useUniversityTeachers, useUniversityCourses } from '../src/api/hooks/directory';
import { useMaterialsList } from '../src/api/hooks/materials';
import { Building2, Layers, GraduationCap, BookOpen, FileText } from 'lucide-react';
import EntityBreadcrumb from '../components/EntityBreadcrumb';
import StatPill from '../components/StatPill';
import FieldCard from '../components/FieldCard';
import TeacherCard from '../components/TeacherCard';
import EmptyState from '../components/EmptyState';
import { NoteStatus } from '../types';

const UniversityPage = () => {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<'FIELDS' | 'TEACHERS'>('FIELDS');

  const { data: university, isLoading: uniLoading, isError: uniError } = useUniversity(id || '');
  const { data: fields, isLoading: fieldsLoading } = useUniversityFields(id || '');
  const { data: teachers, isLoading: teachersLoading } = useUniversityTeachers(id || '');
  const { data: courses } = useUniversityCourses(id || '');
  const { data: materials } = useMaterialsList({ university: id, status: NoteStatus.PUBLISHED });

  if (uniLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (uniError || !university) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">دانشگاه مورد نظر یافت نشد</h2>
        <Link to="/browse" className="text-blue-600 hover:underline mt-4 inline-block">بازگشت به کاوش</Link>
      </div>
    );
  }

  const tabBtn = (active: boolean) =>
    `px-5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 ${active ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`;

  const courseCount = courses?.length ?? 0;
  const materialCount = materials?.filter(m => m.status === NoteStatus.PUBLISHED).length ?? 0;

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
        <StatPill icon={Layers} value={fields?.length ?? (fieldsLoading ? '—' : 0)} label="رشته" color="bg-indigo-100 text-indigo-600" />
        <StatPill icon={GraduationCap} value={teachers?.length ?? (teachersLoading ? '—' : 0)} label="استاد" color="bg-blue-100 text-blue-600" />
        <StatPill icon={BookOpen} value={courseCount} label="درس" color="bg-emerald-100 text-emerald-600" />
        <StatPill icon={FileText} value={materialCount} label="منبع" color="bg-amber-100 text-amber-600" />
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
        fieldsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => <FieldCard key={i} field={{ id: '', name: '' }} skeleton />)}
          </div>
        ) : fields && fields.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(f => <FieldCard key={f.id} field={f} teacherCount={0} courseCount={0} materialCount={0} />)}
          </div>
        ) : (
          <EmptyState icon={Layers} title="رشته‌ای برای این دانشگاه ثبت نشده است" />
        )
      ) : teachersLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <TeacherCard key={i} teacher={{ id: '', name: '', fieldIds: [], avatarUrl: '', isVerified: false }} skeleton />)}
        </div>
      ) : teachers && teachers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers.map(t => <TeacherCard key={t.id} teacher={t} universityName={university.name} courseCount={0} materialCount={0} />)}
        </div>
      ) : (
        <EmptyState icon={GraduationCap} title="استادی برای این دانشگاه ثبت نشده است" />
      )}
    </div>
  );
};

export default UniversityPage;
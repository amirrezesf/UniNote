import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMe, useUpdateProfile, useUser } from '../src/api/auth';
import { useMyMaterials, useMaterials, useUserMaterials } from '../src/api/hooks/materials';
import { NoteStatus } from '../types';
import { FileText, Edit3, Star, Award, Calendar, User as UserIcon, Lock, AlertCircle, BookOpen, Eye, Plus, Download, CheckCircle, XCircle, Clock } from 'lucide-react';
import { MaterialRow } from '../components/MaterialCard';
import MaterialTypeBadge from '../components/MaterialTypeBadge';
import EmptyState from '../components/EmptyState';
import { formatJalali } from '../src/utils/date';

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();

  // Always hydrate the current user — needed to detect "is this me?".
  const { data: currentUser } = useMe();

  // Own profile => no :id (or :id == current user). Other user => :id present
  // and different. Clicking a material's uploader name routes to
  // /profile/<uploaderId>, so we MUST fetch that user rather than reusing
  // the current user's data — otherwise every uploader link shows the
  // logged-in user's own profile (the bug this fixes).
  const isOwnProfile = !id || id === currentUser?.id;

  // Own profile uses /auth/me/ (includes private statuses via /me/materials/).
  // Other user uses the public endpoint /auth/users/<id>/ + /materials/?uploader=<id>
  // which only exposes PUBLISHED items.
  const meQuery = useMe();
  const otherQuery = useUser(id);
  const myMaterialsQuery = useMyMaterials();
  const otherMaterialsQuery = useUserMaterials(id);

  const user = isOwnProfile ? meQuery.data : otherQuery.data;
  const userLoading = isOwnProfile ? meQuery.isLoading : otherQuery.isLoading;
  const userError = isOwnProfile ? meQuery.isError : otherQuery.isError;
  const refetchUser = isOwnProfile ? meQuery.refetch : otherQuery.refetch;

  // For own profile, /me/materials/ returns all statuses (PUBLISHED/PENDING/REJECTED).
  // For other users, /materials/?uploader=<id>&status=PUBLISHED returns only PUBLISHED.
  const myMaterials = myMaterialsQuery.data ?? [];
  const otherMaterials = otherMaterialsQuery.data ?? [];
  const userMaterials = isOwnProfile ? myMaterials : otherMaterials;
  const materialsLoading = isOwnProfile ? myMaterialsQuery.isLoading : otherMaterialsQuery.isLoading;

  const [filter, setFilter] = useState<'ALL' | NoteStatus>('ALL');
  const filtered = filter === 'ALL' ? userMaterials : userMaterials.filter(m => m.status === filter);

  const publishedCount = userMaterials.filter(m => m.status === NoteStatus.PUBLISHED).length;
  const pendingCount = userMaterials.filter(m => m.status === NoteStatus.PENDING).length;

  const handleAvatarUpdate = () => {
    refetchUser();
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">کاربر یافت نشد</h2>
        <Link to="/browse" className="text-blue-600 hover:underline mt-4 inline-block">بازگشت به کاوش</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-blue-600 to-indigo-700" />
        <div className="px-6 md:px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-5 -mt-12">
            <div className="relative flex-shrink-0">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-28 h-28 rounded-3xl border-4 border-white object-cover bg-white shadow-lg"
              />
              {isOwnProfile && (
                <button
                  onClick={handleAvatarUpdate}
                  className="absolute bottom-0 left-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
                  title="ویرایش پروفایل"
                >
                  <UserIcon size={18} />
                </button>
              )}
            </div>
            <div className="flex-1 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mt-1">
                <span className={`px-2 py-0.5 rounded-md font-medium ${user.role === 'INSTRUCTOR' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {user.role === 'INSTRUCTOR' ? 'استاد' : 'دانشجو'}
                </span>
                {user.university && (
                  <Link to={`/university/${user.university}`} className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                    <Award size={14} className="text-slate-400" /> {user.university}
                  </Link>
                )}
                {user.fieldOfStudy && (
                  <span className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md font-medium flex items-center gap-1">
                    <BookOpen size={12} /> {user.fieldOfStudy}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3 text-slate-600">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center"><Calendar size={20} className="text-blue-600" /></div>
              <div><span className="block text-xs text-slate-400">تاریخ عضویت</span><span className="font-bold text-sm">مهر ۱۴۰۱</span></div>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center"><Award size={20} className="text-amber-500" /></div>
              <div><span className="block text-xs text-slate-400">امتیاز کل</span><span className="font-bold text-sm">{user.points} امتیاز</span></div>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center"><Star size={20} className="text-amber-500" /></div>
              <div><span className="block text-xs text-slate-400">منابع منتشر شده</span><span className="font-bold text-sm">{publishedCount}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats + Materials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4">آمار فعالیت</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm flex items-center gap-2"><FileText size={16} /> منابع منتشر شده</span>
                <span className="font-bold text-slate-900">{publishedCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm flex items-center gap-2"><Clock size={16} /> در انتظار تایید</span>
                <span className="font-bold text-amber-600">{pendingCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm flex items-center gap-2"><XCircle size={16} className="text-red-500" /> رد شده</span>
                <span className="font-bold text-red-600">{userMaterials.filter(m => m.status === NoteStatus.REJECTED).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm flex items-center gap-2"><Star size={16} /> میانگین امتیاز</span>
                <span className="font-bold text-slate-900">4.5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Materials list */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
              <BookOpen className="text-blue-600" />
              {isOwnProfile ? 'مشارکت‌های من' : `مشارکت‌های ${user.name}`}
            </h3>
            {isOwnProfile && <Link to="/upload" className="text-sm text-blue-600 font-bold hover:underline">+ بارگذاری جدید</Link>}
          </div>

          {/* Status filter tabs */}
          <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
            <button onClick={() => setFilter('ALL')} className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${filter === 'ALL' ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
              همه ({userMaterials.length})
            </button>
            <button onClick={() => setFilter(NoteStatus.PUBLISHED)} className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${filter === NoteStatus.PUBLISHED ? 'bg-green-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
              منتشر شده ({publishedCount})
            </button>
            <button onClick={() => setFilter(NoteStatus.PENDING)} className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${filter === NoteStatus.PENDING ? 'bg-amber-500 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
              در انتظار ({pendingCount})
            </button>
            <button onClick={() => setFilter(NoteStatus.REJECTED)} className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${filter === NoteStatus.REJECTED ? 'bg-red-500 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
              رد شده ({userMaterials.filter(m => m.status === NoteStatus.REJECTED).length})
            </button>
          </div>

          {materialsLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="space-y-4">
              {filtered.map(m => (
                <div key={m.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col">
                  <div className="relative h-40 bg-slate-100">
                    <img src={m.thumbnailUrl} alt={m.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2"><MaterialTypeBadge type={m.materialType} /></div>
                    <div className={`absolute bottom-2 right-2 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                      m.status === NoteStatus.PUBLISHED ? 'text-green-600 bg-green-50' :
                      m.status === NoteStatus.PENDING ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50'
                    } bg-white/90 backdrop-blur-sm shadow-sm`}>
                      <CheckCircle size={12} /> {m.status === NoteStatus.PUBLISHED ? 'منتشر شده' : m.status === NoteStatus.PENDING ? 'در انتظار تایید' : 'رد شده'}
                    </div>
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-700 shadow-sm">{m.fileType.toUpperCase()}</div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">{m.title}</h3>
                    <p className="text-sm text-slate-500 mb-4">{m.materialType === 'HANDOUT' ? 'جزوه' : m.materialType === 'EXAM' ? 'نمونه سوال' : m.materialType === 'NOTE' ? 'یادداشت' : m.materialType === 'SLIDE' ? 'اسلاید' : 'تکلیف'}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span className="flex items-center gap-1"><Eye size={14} /> {m.views}</span>
                        <span className="flex items-center gap-1"><Clock size={14} /> {formatJalali(m.createdAt)}</span>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/material/${m.id}`} className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors" title="مشاهده"><Eye size={18} /></Link>
                        {isOwnProfile && (
                          <>
                            <button className="p-2 hover:bg-amber-50 text-slate-400 hover:text-amber-600 rounded-lg transition-colors" title="ویرایش"><Edit3 size={18} /></button>
                            <button className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors" title="حذف"><XCircle size={18} /></button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FileText}
              title={isOwnProfile ? 'هنوز منبعی بارگذاری نکرده‌ید' : 'این کاربر هنوز منبعی منتشر نکرده است.'}
              description={isOwnProfile ? 'با به اشتراک‌گذاری منابع خود، به دانشجویان دیگر کمک کنید و امتیاز کسب نمایید.' : ''}
            >
              {isOwnProfile && (
                <Link to="/upload" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                  <Plus size={20} /> اولین منبع خود را بارگذاری کنید
                </Link>
              )}
            </EmptyState>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
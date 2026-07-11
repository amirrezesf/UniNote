import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CURRENT_USER, MATERIALS, getUserById, getTeacherForUser } from '../constants';
import { UserRole, NoteStatus, Material } from '../types';
import { Award, BookOpen, FileText, Settings, Edit3, MapPin, Calendar, Star, BadgeCheck, MessageCircle, ExternalLink } from 'lucide-react';
import MaterialTypeBadge from '../components/MaterialTypeBadge';
import EmptyState from '../components/EmptyState';

const MaterialRowMinimal: React.FC<{ material: Material }> = ({ material }) => (
  <Link to={`/material/${material.id}`} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all">
    <div className="w-16 h-16 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden">
      <img src={material.thumbnailUrl} alt="" className="w-full h-full object-cover" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start gap-2">
        <h4 className="font-bold text-slate-800 truncate">{material.title}</h4>
        <span className={`text-xs px-2 py-1 rounded-md font-bold flex-shrink-0 ${material.status === NoteStatus.PUBLISHED ? 'bg-green-100 text-green-700' : material.status === NoteStatus.PENDING ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
          {material.status === NoteStatus.PUBLISHED ? 'منتشر شده' : material.status === NoteStatus.PENDING ? 'در انتظار' : 'رد شده'}
        </span>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <MaterialTypeBadge type={material.materialType} />
        <span className="text-xs text-slate-500">{material.createdAt}</span>
      </div>
    </div>
  </Link>
);

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const isOwnProfile = !id || id === CURRENT_USER.id;
  const user = isOwnProfile ? CURRENT_USER : getUserById(id);

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">کاربر مورد نظر یافت نشد</h2>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">بازگشت به صفحه اصلی</Link>
      </div>
    );
  }

  const userMaterials = MATERIALS.filter(m => m.uploader.id === user.id);
  const publishedCount = userMaterials.filter(m => m.status === NoteStatus.PUBLISHED).length;
  const pendingCount = isOwnProfile ? userMaterials.filter(m => m.status === NoteStatus.PENDING).length : 0;
  const teacherEntity = getTeacherForUser(user);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-4">
            <div className="flex items-end gap-6">
              <div className="w-32 h-32 rounded-3xl border-4 border-white overflow-hidden bg-white shadow-lg">
                <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="mb-2">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  {user.name}
                  {user.role === UserRole.INSTRUCTOR && <BadgeCheck className="text-blue-600 fill-blue-100" />}
                </h1>
                <p className="text-slate-500 flex items-center gap-2">
                  {user.role === UserRole.STUDENT ? 'دانشجو' : 'استاد'}
                  {user.fieldOfStudy && <span className="flex items-center gap-1 before:content-['•'] before:mx-1 before:text-slate-300">{user.fieldOfStudy}</span>}
                </p>
              </div>
            </div>
            {isOwnProfile ? (
              <Link to="/profile/edit" className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors">
                <Settings size={18} /><span>ویرایش پروفایل</span>
              </Link>
            ) : (
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                <MessageCircle size={18} /><span>ارسال پیام</span>
              </button>
            )}
          </div>

          {/* Contributor clarifier + teacher-page link */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg">این یک پروفایل مشارکت‌کننده است</span>
            {teacherEntity && (
              <Link to={`/teacher/${teacherEntity.id}`} className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-blue-100 transition-colors">
                <ExternalLink size={13} /> مشاهده صفحه استاد
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 text-slate-600">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center"><MapPin size={20} className="text-blue-600" /></div>
              <div><span className="block text-xs text-slate-400">دانشگاه</span><span className="font-bold text-sm">{user.university || 'تعیین نشده'}</span></div>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center"><Calendar size={20} className="text-blue-600" /></div>
              <div><span className="block text-xs text-slate-400">تاریخ عضویت</span><span className="font-bold text-sm">مهر ۱۴۰۱</span></div>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center"><Award size={20} className="text-amber-500" /></div>
              <div><span className="block text-xs text-slate-400">امتیاز کل</span><span className="font-bold text-sm">{user.points} امتیاز</span></div>
            </div>
          </div>
        </div>
      </div>

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
              {isOwnProfile && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm flex items-center gap-2"><Edit3 size={16} /> در انتظار تایید</span>
                  <span className="font-bold text-amber-600">{pendingCount}</span>
                </div>
              )}
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

          {userMaterials.length > 0 ? (
            <div className="space-y-4">
              {userMaterials.map(m => <MaterialRowMinimal key={m.id} material={m} />)}
            </div>
          ) : (
            <EmptyState icon={FileText} title={isOwnProfile ? 'هنوز منبعی بارگذاری نکرده‌اید.' : 'این کاربر هنوز منبعی منتشر نکرده است.'}>
              {isOwnProfile && <Link to="/upload" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-700">شروع کنید</Link>}
            </EmptyState>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;


import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CURRENT_USER, MOCK_NOTES, getUserById } from '../constants';
import { UserRole, NoteStatus, Note } from '../types';
import { 
    Award, 
    BookOpen, 
    FileText, 
    Settings, 
    Edit3, 
    MapPin, 
    Calendar,
    Star,
    BadgeCheck,
    MessageCircle
} from 'lucide-react';

const NoteCardMinimal: React.FC<{ note: Note }> = ({ note }) => (
    <Link to={`/note/${note.id}`} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all">
        <div className="w-16 h-16 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden">
            <img src={note.thumbnailUrl} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex justify-between">
                <h4 className="font-bold text-slate-800 truncate">{note.title}</h4>
                <span className={`text-xs px-2 py-1 rounded-md font-bold ${
                    note.status === NoteStatus.PUBLISHED ? 'bg-green-100 text-green-700' : 
                    note.status === NoteStatus.PENDING ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                }`}>
                    {note.status === NoteStatus.PUBLISHED ? 'منتشر شده' : 
                     note.status === NoteStatus.PENDING ? 'در انتظار' : 'رد شده'}
                </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{note.course} • {note.createdAt}</p>
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

    // Filter notes for the displayed user
    const userNotes = MOCK_NOTES.filter(note => note.author.id === user.id);
    const publishedCount = userNotes.filter(n => n.status === NoteStatus.PUBLISHED).length;
    // Only show pending count if viewing own profile
    const pendingCount = isOwnProfile ? userNotes.filter(n => n.status === NoteStatus.PENDING).length : 0;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="flex items-end gap-6">
                            <div className="w-32 h-32 rounded-3xl border-4 border-white overflow-hidden bg-white shadow-lg">
                                <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="mb-2">
                                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                    {user.name}
                                    {user.role === UserRole.INSTRUCTOR && (
                                        <BadgeCheck className="text-blue-600 fill-blue-100" />
                                    )}
                                </h1>
                                <p className="text-slate-500 flex items-center gap-2">
                                    {user.role === UserRole.STUDENT ? 'دانشجو' : 'استاد'}
                                    {user.fieldOfStudy && (
                                        <span className="flex items-center gap-1 before:content-['•'] before:mx-1 before:text-slate-300">
                                            {user.fieldOfStudy}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                        {isOwnProfile ? (
                            <Link to="/profile/edit" className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors">
                                <Settings size={18} />
                                <span>ویرایش پروفایل</span>
                            </Link>
                        ) : (
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                                <MessageCircle size={18} />
                                <span>ارسال پیام</span>
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3 text-slate-600">
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                <MapPin size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <span className="block text-xs text-slate-400">دانشگاه</span>
                                <span className="font-bold text-sm">{user.university || 'تعیین نشده'}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600">
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                <Calendar size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <span className="block text-xs text-slate-400">تاریخ عضویت</span>
                                <span className="font-bold text-sm">مهر ۱۴۰۱</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600">
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                <Award size={20} className="text-amber-500" />
                            </div>
                            <div>
                                <span className="block text-xs text-slate-400">امتیاز کل</span>
                                <span className="font-bold text-sm">{user.points} امتیاز</span>
                            </div>
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
                                <span className="text-slate-500 text-sm flex items-center gap-2">
                                    <FileText size={16} /> جزوات منتشر شده
                                </span>
                                <span className="font-bold text-slate-900">{publishedCount}</span>
                            </div>
                            {isOwnProfile && (
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 text-sm flex items-center gap-2">
                                        <Edit3 size={16} /> در انتظار تایید
                                    </span>
                                    <span className="font-bold text-amber-600">{pendingCount}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-sm flex items-center gap-2">
                                    <Star size={16} /> میانگین امتیاز
                                </span>
                                <span className="font-bold text-slate-900">4.5</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content (Notes List) */}
                <div className="md:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
                            <BookOpen className="text-blue-600" />
                            {isOwnProfile ? 'جزوات من' : `جزوات ${user.name}`}
                        </h3>
                        {isOwnProfile && (
                            <Link to="/upload" className="text-sm text-blue-600 font-bold hover:underline">
                                + بارگذاری جدید
                            </Link>
                        )}
                    </div>

                    {userNotes.length > 0 ? (
                        <div className="space-y-4">
                            {userNotes.map(note => (
                                <NoteCardMinimal key={note.id} note={note} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center">
                            <FileText className="mx-auto text-slate-300 mb-4" size={48} />
                            <p className="text-slate-500 font-medium mb-4">
                                {isOwnProfile ? 'هنوز جزوه‌ای بارگذاری نکرده‌اید.' : 'این کاربر هنوز جزوه‌ای منتشر نکرده است.'}
                            </p>
                            {isOwnProfile && (
                                <Link to="/upload" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-700">
                                    شروع کنید
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

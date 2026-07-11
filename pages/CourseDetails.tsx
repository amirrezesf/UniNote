
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_INSTRUCTORS, MOCK_NOTES, LEADERBOARD_DATA, CURRENT_USER } from '../constants';
import { Note, UserRole } from '../types';
import { 
    BookOpen, 
    Clock, 
    MapPin, 
    Users, 
    User as UserIcon, 
    FileText, 
    MessageSquare, 
    MoreHorizontal,
    BadgeCheck,
    Search,
    UserPlus,
    QrCode,
    ScanLine,
    XCircle,
    CheckCircle,
    Loader2
} from 'lucide-react';

// Mock Extended Course Data
const COURSE_DATABASE: Record<string, any> = {
    'c1': { 
        id: 'c1', 
        title: 'ریاضی عمومی ۱', 
        instructorId: 'u6', // Dr. Rezaei
        description: 'این درس به بررسی مفاهیم پایه ریاضیات شامل حد، پیوستگی، مشتق و انتگرال و کاربردهای آن‌ها در علوم مهندسی می‌پردازد.',
        time: 'دوشنبه ۱۰:۰۰ - ۱۲:۰۰',
        location: 'ساختمان ابن سینا - کلاس ۲۰۱',
        code: 'MATH-101',
        unit: 3
    },
    'c2': { 
        id: 'c2', 
        title: 'ساختمان داده‌ها', 
        instructorId: 'u3', // Dr. Kamali
        description: 'آشنایی با انواع ساختمان‌های داده نظیر آرایه، لیست پیوندی، درخت، گراف و الگوریتم‌های مرتب‌سازی و جستجو.',
        time: 'سه‌شنبه ۱۴:۰۰ - ۱۶:۰۰',
        location: 'دانشکده کامپیوتر - تالار ۳',
        code: 'CS-202',
        unit: 3
    },
    'c3': { 
        id: 'c3', 
        title: 'فیزیک ۲', 
        instructorId: 'u7', // Dr. Hesabi
        description: 'مباحث الکتریسیته و مغناطیس، میدان‌های الکتریکی، پتانسیل، خازن‌ها و جریان‌های الکتریکی.',
        time: 'شنبه ۰۸:۰۰ - ۱۰:۰۰',
        location: 'ساختمان ابوریحان - کلاس ۱۰۵',
        code: 'PHYS-102',
        unit: 3
    },
    'c4': { 
        id: 'c4', 
        title: 'هوش مصنوعی', 
        instructorId: 'u3', // Using Dr. Kamali again for demo or u8
        description: 'مبانی هوش مصنوعی، عامل‌های هوشمند، روش‌های جستجو، منطق فازی و یادگیری ماشین مقدماتی.',
        time: 'چهارشنبه ۱۶:۰۰ - ۱۸:۰۰',
        location: 'دانشکده کامپیوتر - کلاس ۱۰۱',
        code: 'CS-305',
        unit: 3
    },
    'c5': { 
        id: 'c5', 
        title: 'مدارهای منطقی', 
        instructorId: 'u8', // Dr. Sharifi
        description: 'طراحی سیستم‌های دیجیتال، جبر بولی، گیت‌های منطقی، مدارهای ترکیبی و ترتیبی.',
        time: 'یک‌شنبه ۱۰:۰۰ - ۱۲:۰۰',
        location: 'دانشکده برق - کلاس ۴۰۴',
        code: 'EE-204',
        unit: 3
    }
};

const NoteCardMinimal: React.FC<{ note: Note }> = ({ note }) => (
    <Link to={`/note/${note.id}`} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group">
        <div className="w-16 h-16 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden relative">
            <img src={note.thumbnailUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
                <h4 className="font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{note.title}</h4>
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">{note.fileType.toUpperCase()}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{note.description}</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                <span>{note.createdAt}</span>
                <span>•</span>
                <span>{note.author.name}</span>
            </div>
        </div>
    </Link>
);

const CourseDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const course = id ? COURSE_DATABASE[id] : null;
    const [activeTab, setActiveTab] = useState<'NOTES' | 'MEMBERS'>('NOTES');
    
    // Initial Classmates Data
    const [classmates, setClassmates] = useState([
        ...LEADERBOARD_DATA.map(l => l.user).filter(u => u.role === UserRole.STUDENT && u.id !== CURRENT_USER.id),
        { id: 'u10', name: 'مریم حسینی', role: UserRole.STUDENT, avatarUrl: 'https://picsum.photos/seed/u10/200', points: 100 },
        { id: 'u11', name: 'کاوه رضایی', role: UserRole.STUDENT, avatarUrl: 'https://picsum.photos/seed/u11/200', points: 150 },
        { id: 'u12', name: 'نیما کریمی', role: UserRole.STUDENT, avatarUrl: 'https://picsum.photos/seed/u12/200', points: 80 },
    ]);

    // Add Student State
    const [showAddMember, setShowAddMember] = useState(false);
    const [addCode, setAddCode] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [addError, setAddError] = useState('');
    const [addSuccess, setAddSuccess] = useState(false);

    if (!course) {
        return <div className="text-center py-20 font-bold text-slate-500">درس مورد نظر یافت نشد.</div>;
    }

    const canManageCourse = CURRENT_USER.role === UserRole.CLASS_REP || CURRENT_USER.role === UserRole.INSTRUCTOR;

    // Resolve Instructor
    const instructor = MOCK_INSTRUCTORS.find(u => u.id === course.instructorId) || {
        id: 'u_unknown',
        name: 'نامشخص',
        role: UserRole.INSTRUCTOR,
        avatarUrl: 'https://via.placeholder.com/150',
        university: 'نامشخص'
    };

    // Filter Notes for this course
    const courseNotes = MOCK_NOTES.filter(n => n.course === course.title);

    // Add Student Handler (Direct Add)
    const handleAddStudent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!addCode) return;
        
        setAddError('');
        setIsAdding(true);

        // Simulate API call to verify code and add student
        setTimeout(() => {
            setIsAdding(false);
            
            // Mock Validation: Code must be at least 5 chars for this demo
            if (addCode.length < 5) {
                setAddError('کد وارد شده صحیح نمی‌باشد یا یافت نشد.');
                return;
            }
            
            // Mock Success: Create a new mock user
            const mockNewUser = { 
                id: `u-new-${Date.now()}`, 
                name: 'دانشجوی جدید', 
                role: UserRole.STUDENT, 
                avatarUrl: `https://picsum.photos/seed/${addCode}/200`, 
                points: 0 
            };
            
            setAddSuccess(true);
            
            // Close modal after showing success
            setTimeout(() => {
                setClassmates(prev => [...prev, mockNewUser]);
                setAddSuccess(false);
                setShowAddMember(false);
                setAddCode('');
            }, 1500);
        }, 1500);
    };

    return (
        <div className="space-y-6">
            {/* Header Banner */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm relative">
                <div className="h-40 bg-gradient-to-r from-blue-900 to-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
                </div>
                <div className="px-8 pb-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start -mt-10 relative z-10">
                        <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-white text-blue-600">
                             <BookOpen size={40} />
                        </div>
                        <div className="flex-1 mt-2 md:mt-12">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h1 className="text-2xl font-bold text-slate-900">{course.title}</h1>
                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200">
                                            {course.code}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 text-sm max-w-2xl">{course.description}</p>
                                </div>
                                <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                                    <MoreHorizontal size={20} />
                                    <span>مدیریت</span>
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-4 mt-6">
                                <div className="flex items-center gap-2 text-slate-600 text-sm bg-slate-50 px-3 py-1.5 rounded-lg">
                                    <Clock size={16} className="text-blue-500" />
                                    <span>{course.time}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600 text-sm bg-slate-50 px-3 py-1.5 rounded-lg">
                                    <MapPin size={16} className="text-red-500" />
                                    <span>{course.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600 text-sm bg-slate-50 px-3 py-1.5 rounded-lg">
                                    <Users size={16} className="text-green-500" />
                                    <span>{classmates.length + 1} دانشجو</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-200">
                        <button 
                            onClick={() => { setActiveTab('NOTES'); setShowAddMember(false); }}
                            className={`px-6 py-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'NOTES' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                        >
                            <FileText size={18} />
                            جزوات و منابع
                        </button>
                        <button 
                            onClick={() => setActiveTab('MEMBERS')}
                            className={`px-6 py-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'MEMBERS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                        >
                            <Users size={18} />
                            هم‌کلاسی‌ها
                        </button>
                    </div>

                    {activeTab === 'NOTES' ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-slate-800">منابع بارگذاری شده</h3>
                                <Link to="/upload" className="text-xs font-bold text-blue-600 hover:underline">+ بارگذاری جزوه جدید</Link>
                            </div>
                            
                            {courseNotes.length > 0 ? (
                                courseNotes.map(note => (
                                    <NoteCardMinimal key={note.id} note={note} />
                                ))
                            ) : (
                                <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                        <FileText size={32} />
                                    </div>
                                    <p className="text-slate-500 font-medium">هنوز جزوه‌ای برای این درس بارگذاری نشده است.</p>
                                    <Link to="/upload" className="inline-block mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors">
                                        اولین نفر باشید!
                                    </Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            {/* Header & Add Button */}
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-slate-800">لیست دانشجویان</h3>
                                <div className="flex gap-3">
                                    {!showAddMember && (
                                        <div className="relative">
                                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                            <input type="text" placeholder="جستجو..." className="pl-3 pr-9 py-1.5 bg-slate-50 border-none rounded-lg text-xs w-48 focus:ring-1 focus:ring-blue-500" />
                                        </div>
                                    )}
                                    {canManageCourse && !showAddMember && (
                                        <button 
                                            onClick={() => setShowAddMember(true)}
                                            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition-colors"
                                        >
                                            <UserPlus size={14} />
                                            افزودن دانشجو
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Add Student UI */}
                            {showAddMember ? (
                                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="font-bold text-slate-800">افزودن دانشجو به کلاس</h4>
                                        <button onClick={() => {setShowAddMember(false); setAddError(''); setAddCode('');}} className="text-slate-400 hover:text-slate-600">
                                            <XCircle size={20} />
                                        </button>
                                    </div>
                                    
                                    {addSuccess ? (
                                        <div className="text-center py-8 text-green-600">
                                            <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                                            <p className="font-bold">دانشجو با موفقیت اضافه شد!</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => setIsScanning(false)}
                                                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors border ${!isScanning ? 'bg-white border-blue-500 text-blue-600' : 'bg-transparent border-slate-200 text-slate-500'}`}
                                                >
                                                    کد دانشجو
                                                </button>
                                                <button 
                                                    onClick={() => setIsScanning(true)}
                                                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors border ${isScanning ? 'bg-white border-blue-500 text-blue-600' : 'bg-transparent border-slate-200 text-slate-500'}`}
                                                >
                                                    اسکن QR
                                                </button>
                                            </div>

                                            {isScanning ? (
                                                <div className="aspect-square max-w-[200px] mx-auto bg-slate-900 rounded-xl flex flex-col items-center justify-center text-slate-400 relative overflow-hidden">
                                                     <ScanLine size={48} className="animate-pulse mb-2 text-blue-500" />
                                                     <span className="text-xs">دوربین را نگه دارید</span>
                                                     <button 
                                                        onClick={() => { setAddCode('U1-VALID-CODE'); setIsScanning(false); }}
                                                        className="absolute bottom-4 px-3 py-1 bg-white/20 text-white text-[10px] rounded-full backdrop-blur-sm"
                                                     >
                                                        شبیه‌سازی اسکن
                                                     </button>
                                                </div>
                                            ) : (
                                                <form onSubmit={handleAddStudent} className="flex gap-2">
                                                    <input 
                                                        type="text" 
                                                        value={addCode}
                                                        onChange={(e) => setAddCode(e.target.value)}
                                                        placeholder="کد دانشجو (مثال: U1-8492)"
                                                        className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 text-left dir-ltr"
                                                    />
                                                    <button 
                                                        type="submit" 
                                                        disabled={!addCode || isAdding}
                                                        className="bg-green-600 text-white px-6 rounded-xl hover:bg-green-700 disabled:opacity-50 font-bold text-sm flex items-center gap-2"
                                                    >
                                                        {isAdding ? <Loader2 className="animate-spin" size={18} /> : 'افزودن'}
                                                    </button>
                                                </form>
                                            )}

                                            {addError && (
                                                <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg flex items-center justify-center gap-2">
                                                    <XCircle size={14} />
                                                    {addError}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Classmates Grid */
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Current User Card */}
                                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                                        <img src={CURRENT_USER.avatarUrl} alt="" className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{CURRENT_USER.name} (شما)</p>
                                            <p className="text-xs text-slate-500">دانشجو</p>
                                        </div>
                                    </div>
                                    {/* Classmates List */}
                                    {classmates.map(user => (
                                        <div key={user.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <img src={user.avatarUrl} alt="" className="w-10 h-10 rounded-full" />
                                                <div>
                                                    <Link to={`/profile/${user.id}`} className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors">
                                                        {user.name}
                                                    </Link>
                                                    <p className="text-xs text-slate-500">دانشجو</p>
                                                </div>
                                            </div>
                                            <button className="text-slate-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-full transition-colors" title="پیام">
                                                <MessageSquare size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Instructor Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <UserIcon size={20} className="text-blue-600" />
                            استاد درس
                        </h3>
                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-3">
                                <img src={instructor.avatarUrl} alt="" className="w-20 h-20 rounded-full object-cover border-4 border-slate-50" />
                                <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full border-2 border-white">
                                    <BadgeCheck size={14} />
                                </div>
                            </div>
                            <Link to={`/profile/${instructor.id}`} className="font-bold text-lg text-slate-900 hover:text-blue-600 transition-colors">
                                {instructor.name}
                            </Link>
                            <p className="text-sm text-slate-500 mb-4">{instructor.university}</p>
                            
                            <div className="flex w-full gap-2">
                                <button className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">
                                    صفحه استاد
                                </button>
                                <button className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
                                    ارسال پیام
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                         <div className="relative z-10">
                            <h3 className="font-bold mb-4">آمار کلاس</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                    <span className="text-slate-400 text-sm">تعداد جلسات</span>
                                    <span className="font-bold">۳۲ جلسه</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                    <span className="text-slate-400 text-sm">منابع بارگذاری شده</span>
                                    <span className="font-bold">{courseNotes.length} فایل</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 text-sm">تکالیف فعال</span>
                                    <span className="font-bold text-amber-400">۲ مورد</span>
                                </div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailsPage;


import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    Mic, 
    MicOff, 
    Video, 
    VideoOff, 
    PhoneOff, 
    MessageSquare, 
    Users, 
    Download, 
    Hand, 
    MonitorUp, 
    Settings, 
    MoreHorizontal,
    Send,
    X,
    BadgeCheck,
    BookOpen,
    FileJson,
    CheckCircle
} from 'lucide-react';
import { MOCK_ONLINE_CLASSES, MOCK_NOTES, CURRENT_USER } from '../constants';

const VirtualClassroomPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const classData = MOCK_ONLINE_CLASSES.find(c => c.id === id);
    
    const [isMuted, setIsMuted] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(false);
    const [sidebarTab, setSidebarTab] = useState<'CHAT' | 'RESOURCES' | 'PARTICIPANTS'>('CHAT');
    const [chatInput, setChatInput] = useState('');
    const [isExporting, setIsExporting] = useState(false);
    const [exportSuccess, setExportSuccess] = useState(false);
    
    const [messages, setMessages] = useState([
        { id: 1, user: 'سیستم', text: 'به کلاس آنلاین خوش آمدید.', isSystem: true },
        { id: 2, user: 'سارا احمدی', text: 'سلام استاد، وقت بخیر.', isSystem: false },
        { id: 3, user: 'دکتر رضایی', text: 'سلام به همگی، تا ۵ دقیقه دیگر شروع می‌کنیم.', isSystem: false },
    ]);

    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!classData) {
        return (
            <div className="h-screen bg-slate-900 flex items-center justify-center text-white">
                <div className="text-center">
                    <X size={64} className="mx-auto text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold">کلاس یافت نشد</h2>
                    <button onClick={() => navigate('/online-classes')} className="mt-4 bg-blue-600 px-6 py-2 rounded-xl">بازگشت</button>
                </div>
            </div>
        );
    }

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        setMessages([...messages, { id: Date.now(), user: CURRENT_USER.name, text: chatInput, isSystem: false }]);
        setChatInput('');
    };

    const handleExportParticipants = () => {
        setIsExporting(true);
        // Simulate generating CSV/Excel export
        setTimeout(() => {
            setIsExporting(false);
            setExportSuccess(true);
            
            // Mock download logic
            const data = [
                ["نام و نام خانوادگی", "نقش", "زمان ورود"],
                [classData.instructor, "استاد", "۰۹:۵۵"],
                [CURRENT_USER.name, "دانشجو", "۱۰:۰۱"],
                ...[...Array(12)].map((_, i) => [`دانشجو شماره ${i + 1}`, "دانشجو", "۱۰:۰۵"])
            ];
            const csvContent = "data:text/csv;charset=utf-8," + data.map(e => e.join(",")).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `حاضرین_${classData.courseTitle}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => setExportSuccess(false), 3000);
        }, 1500);
    };

    const relatedNotes = MOCK_NOTES.filter(n => n.course === classData.courseTitle);

    return (
        <div className="h-screen flex flex-col bg-slate-950 overflow-hidden font-sans rtl">
            {/* Top Header */}
            <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 flex-shrink-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">زنده</div>
                    <h1 className="text-slate-200 font-bold text-sm md:text-base">
                        {classData.courseTitle} - {classData.topic}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs hidden md:inline">پلتفرم: {classData.platform}</span>
                    <button onClick={() => navigate('/online-classes')} className="p-2 text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Video Section */}
                <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center relative">
                        {/* Mock Stream Area */}
                        <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-slate-700">
                             <div className="relative w-48 h-48 mb-6">
                                <img src="https://picsum.photos/seed/instructor/400" className="w-full h-full rounded-full object-cover border-4 border-slate-800" alt="Instructor" />
                                <div className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full border-2 border-slate-900">
                                    <BadgeCheck size={20} />
                                </div>
                             </div>
                             <h2 className="text-xl font-bold text-slate-300">استاد در حال آماده‌سازی بستر ارائه...</h2>
                             <p className="text-sm text-slate-500 mt-2">صدای سیستم در حال تست است</p>
                        </div>

                        {/* Student Small Preview (Self) */}
                        <div className="absolute top-4 left-4 w-40 h-28 bg-slate-800 rounded-xl border border-white/10 overflow-hidden shadow-2xl z-10">
                            {isVideoOn ? (
                                <img src={CURRENT_USER.avatarUrl} className="w-full h-full object-cover" alt="Me" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center">
                                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-slate-400 text-xs font-bold">
                                        {CURRENT_USER.name.charAt(0)}
                                    </div>
                                    <span className="text-[10px] text-slate-500 mt-1">تصویر شما خاموش است</span>
                                </div>
                            )}
                            <div className="absolute bottom-1 right-2 text-[10px] text-white bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-sm">شما</div>
                        </div>

                        {/* Presentation Area (Placeholder) */}
                        <div className="absolute inset-x-8 inset-y-8 bg-slate-800/20 backdrop-blur-sm border border-white/5 rounded-3xl flex items-center justify-center text-white/5 pointer-events-none">
                            <MonitorUp size={120} />
                        </div>
                    </div>

                    {/* Controls Overlay */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 md:gap-4 p-4 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl z-30">
                        <button 
                            onClick={() => setIsMuted(!isMuted)}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                            title={isMuted ? "وصل صدا" : "قطع صدا"}
                        >
                            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                        </button>
                        <button 
                            onClick={() => setIsVideoOn(!isVideoOn)}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${!isVideoOn ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                            title={isVideoOn ? "قطع تصویر" : "وصل تصویر"}
                        >
                            {!isVideoOn ? <VideoOff size={20} /> : <Video size={20} />}
                        </button>
                        <button className="w-12 h-12 rounded-full bg-slate-800 text-white hover:bg-slate-700 flex items-center justify-center transition-all">
                            <Hand size={20} />
                        </button>
                        <button className="w-12 h-12 rounded-full bg-slate-800 text-white hover:bg-slate-700 flex items-center justify-center transition-all">
                            <MonitorUp size={20} />
                        </button>
                        
                        <div className="w-px h-8 bg-white/10 mx-1"></div>
                        
                        <button className="w-12 h-12 rounded-full bg-slate-800 text-white hover:bg-slate-700 flex items-center justify-center transition-all">
                            <Settings size={20} />
                        </button>
                        
                        <button 
                            onClick={() => navigate('/online-classes')}
                            className="w-14 h-12 rounded-full bg-red-600 text-white hover:bg-red-700 flex items-center justify-center transition-all shadow-lg shadow-red-900/50"
                            title="ترک کلاس"
                        >
                            <PhoneOff size={24} />
                        </button>
                    </div>
                </div>

                {/* Sidebar Tabbed Panel */}
                <div className="w-full md:w-80 lg:w-96 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 z-20">
                    {/* Sidebar Tabs */}
                    <div className="flex border-b border-slate-800">
                        <button 
                            onClick={() => setSidebarTab('CHAT')}
                            className={`flex-1 py-4 text-xs font-bold transition-all relative ${sidebarTab === 'CHAT' ? 'text-blue-500' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            <div className="flex flex-col items-center gap-1">
                                <MessageSquare size={18} />
                                گفتگو
                            </div>
                            {sidebarTab === 'CHAT' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>}
                        </button>
                        <button 
                            onClick={() => setSidebarTab('RESOURCES')}
                            className={`flex-1 py-4 text-xs font-bold transition-all relative ${sidebarTab === 'RESOURCES' ? 'text-blue-500' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            <div className="flex flex-col items-center gap-1">
                                <BookOpen size={18} />
                                منابع درس
                            </div>
                            {sidebarTab === 'RESOURCES' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>}
                        </button>
                        <button 
                            onClick={() => setSidebarTab('PARTICIPANTS')}
                            className={`flex-1 py-4 text-xs font-bold transition-all relative ${sidebarTab === 'PARTICIPANTS' ? 'text-blue-500' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            <div className="flex flex-col items-center gap-1">
                                <Users size={18} />
                                حاضرین (۲۴)
                            </div>
                            {sidebarTab === 'PARTICIPANTS' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>}
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                        {sidebarTab === 'CHAT' && (
                            <div className="h-full flex flex-col">
                                <div className="flex-1 space-y-4 mb-4">
                                    {messages.map(msg => (
                                        <div key={msg.id} className={`${msg.isSystem ? 'text-center' : ''}`}>
                                            {msg.isSystem ? (
                                                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded-full uppercase tracking-widest">{msg.text}</span>
                                            ) : (
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-xs font-bold ${msg.user === CURRENT_USER.name ? 'text-blue-400' : 'text-slate-300'}`}>{msg.user}</span>
                                                        <span className="text-[10px] text-slate-500">۱۰:۱۲</span>
                                                    </div>
                                                    <div className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.user === CURRENT_USER.name ? 'bg-blue-600/20 text-blue-100 border border-blue-500/20 rounded-tr-none' : 'bg-slate-800 text-slate-300 rounded-tl-none'}`}>
                                                        {msg.text}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <div ref={chatEndRef} />
                                </div>
                                <form onSubmit={handleSendMessage} className="mt-auto relative">
                                    <input 
                                        type="text" 
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        placeholder="پیامی بنویسید..." 
                                        className="w-full bg-slate-800 border-none text-white text-sm rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button type="submit" className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-500 p-2 hover:text-blue-400 transition-colors">
                                        <Send size={18} className="rotate-180" />
                                    </button>
                                </form>
                            </div>
                        )}

                        {sidebarTab === 'RESOURCES' && (
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">جزوات مرتبط با این جلسه</h4>
                                {relatedNotes.length > 0 ? (
                                    relatedNotes.map(note => (
                                        <div key={note.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 flex items-center gap-3 group hover:border-blue-500/50 transition-all">
                                            <div className="w-10 h-10 bg-slate-700 rounded flex items-center justify-center text-blue-500 flex-shrink-0">
                                                <Download size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-slate-200 text-xs font-bold truncate">{note.title}</p>
                                                <p className="text-slate-500 text-[10px] mt-0.5">{note.fileType.toUpperCase()} • {note.author.name}</p>
                                            </div>
                                            <a href="#" className="opacity-0 group-hover:opacity-100 p-2 bg-blue-600 text-white rounded-lg transition-all shadow-lg shadow-blue-900/40">
                                                <Download size={14} />
                                            </a>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 opacity-50">
                                        <BookOpen size={32} className="mx-auto mb-2" />
                                        <p className="text-xs">منبعی برای این کلاس ثبت نشده است.</p>
                                    </div>
                                )}
                                <button className="w-full py-3 mt-4 border border-dashed border-slate-700 rounded-xl text-slate-500 text-xs font-bold hover:bg-slate-800 hover:text-slate-300 transition-all">
                                    + بارگذاری منبع جدید برای کلاس
                                </button>
                            </div>
                        )}

                        {sidebarTab === 'PARTICIPANTS' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2 mb-2">
                                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">لیست حاضرین</h4>
                                    <button 
                                        onClick={handleExportParticipants}
                                        disabled={isExporting}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${exportSuccess ? 'bg-green-600 text-white border-green-600' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'}`}
                                    >
                                        {isExporting ? (
                                            <>خروجی...</>
                                        ) : exportSuccess ? (
                                            <><CheckCircle size={12} /> انجام شد</>
                                        ) : (
                                            <><FileJson size={12} /> خروجی لیست حاضرین</>
                                        )}
                                    </button>
                                </div>

                                <div className="flex items-center gap-3 p-2 bg-blue-600/10 rounded-xl border border-blue-500/20">
                                    <img src="https://picsum.photos/seed/instructor/200" className="w-8 h-8 rounded-full border border-blue-500/30" alt="Instructor" />
                                    <div className="flex-1">
                                        <p className="text-blue-400 text-xs font-black">{classData.instructor}</p>
                                        <p className="text-[10px] text-blue-500/70">ارائه دهنده / استاد</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <Mic size={14} className="text-blue-500" />
                                        <Video size={14} className="text-blue-500" />
                                    </div>
                                </div>
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 pt-2">دانشجویان</h4>
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-3 px-2 group">
                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-400 border border-slate-700">
                                            {String.fromCharCode(65 + i)}
                                        </div>
                                        <span className="text-xs text-slate-400 flex-1">دانشجو شماره {i + 1}</span>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MicOff size={14} className="text-slate-600" />
                                            <MoreHorizontal size={14} className="text-slate-600" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VirtualClassroomPage;


import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Home,
  Search,
  UploadCloud,
  Award,
  LogOut,
  Menu,
  X,
  Bell,
  BookMarked,
  MessageSquare,
  QrCode,
  FileText
} from 'lucide-react';
import { CURRENT_USER } from './constants';

// Pages
import Dashboard from './pages/Dashboard';
import SearchPage from './pages/Search';
import UploadPage from './pages/Upload';
import LeaderboardPage from './pages/Leaderboard';
import NoteDetailsPage from './pages/NoteDetails';
import ProfilePage from './pages/Profile';
import ProfileEditPage from './pages/ProfileEdit';
import MyCoursesPage from './pages/MyCourses';
import AddCoursePage from './pages/AddCourse';
import CourseDetailsPage from './pages/CourseDetails';
import MessagesPage from './pages/Messages';
import NotificationsPage from './pages/Notifications';
import LoginPage from './pages/Login';
import ForgotPasswordPage from './pages/ForgotPassword';
import MyQRCodePage from './pages/MyQRCode';
import MyNotesPage from './pages/MyNotes';

// Layout Components
const SidebarItem = ({ 
  to, 
  icon: Icon, 
  label, 
  active, 
  onClick,
  expanded 
}: { 
  to: string, 
  icon: any, 
  label: string, 
  active: boolean, 
  onClick?: () => void,
  expanded: boolean
}) => (
  <Link 
    to={to} 
    onClick={onClick}
    title={!expanded ? label : ''}
    className={`flex items-center gap-x-3 p-3 rounded-xl transition-all duration-200 group relative
      ${active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
      ${expanded ? 'justify-start px-4' : 'justify-center'}
    `}
  >
    <Icon size={20} className="flex-shrink-0" />
    <span className={`font-medium text-sm whitespace-nowrap transition-all duration-300 overflow-hidden ${
      expanded ? 'w-auto opacity-100' : 'w-0 opacity-0 hidden'
    }`}>
      {label}
    </span>
    
    {!expanded && (
      <div className="absolute right-full mr-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
        {label}
      </div>
    )}
  </Link>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden">
      <div 
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
      />

      <aside className={`
        fixed lg:static inset-y-0 right-0 z-50 bg-white border-l border-slate-200 
        shadow-2xl lg:shadow-none transition-all duration-300 ease-in-out h-full flex flex-col flex-shrink-0
        ${sidebarOpen ? 'w-72 translate-x-0' : 'w-72 lg:w-20 translate-x-full lg:translate-x-0'}
      `}>
        <div className={`
            border-b border-slate-100 flex items-center flex-shrink-0 transition-all duration-300
            ${sidebarOpen ? 'p-6 justify-between' : 'p-4 justify-center'}
        `}>
            <div className={`flex items-center gap-x-3 ${sidebarOpen ? '' : 'justify-center'}`}>
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    <Award size={24} />
                </div>
                <div className={`transition-all duration-300 overflow-hidden ${sidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0 hidden'}`}>
                    <h1 className="text-xl font-bold text-slate-900 whitespace-nowrap">یونی‌نوت</h1>
                    <p className="text-xs text-slate-500 whitespace-nowrap">اشتراک دانش</p>
                </div>
            </div>
            <button onClick={closeSidebar} className={`text-slate-500 hover:text-red-500 transition-colors lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
              <X size={24} />
            </button>
        </div>

        <div className={`flex-shrink-0 transition-all duration-300 ${sidebarOpen ? 'p-6 pb-2' : 'p-2 pb-2'}`}>
            <Link to="/profile" onClick={closeSidebar} className="block">
            <div className={`
                flex items-center gap-x-3 rounded-2xl border border-slate-100 hover:bg-blue-50 hover:border-blue-100 transition-colors cursor-pointer group
                ${sidebarOpen ? 'p-3 bg-slate-50' : 'p-2 justify-center border-transparent bg-transparent'}
            `}>
                <img src={CURRENT_USER.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover group-hover:scale-105 transition-transform" />
                <div className={`flex-1 min-w-0 transition-all duration-300 overflow-hidden ${sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>
                    <p className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-700">{CURRENT_USER.name}</p>
                    <div className="flex items-center gap-x-1 text-xs text-amber-500 font-medium">
                        <Award size={12} />
                        <span>{CURRENT_USER.points} امتیاز</span>
                    </div>
                </div>
            </div>
            </Link>
        </div>

        <nav className={`flex-1 space-y-2 overflow-y-auto custom-scrollbar ${sidebarOpen ? 'px-4 py-4' : 'px-2 py-4'}`}>
            <SidebarItem to="/" icon={Home} label="داشبورد" active={location.pathname === '/'} onClick={closeSidebar} expanded={sidebarOpen} />
            <SidebarItem to="/my-courses" icon={BookMarked} label="درس‌های من" active={location.pathname.startsWith('/my-courses') || location.pathname.startsWith('/course/')} onClick={closeSidebar} expanded={sidebarOpen} />
            <SidebarItem to="/messages" icon={MessageSquare} label="پیام‌ها" active={location.pathname === '/messages'} onClick={closeSidebar} expanded={sidebarOpen} />
            <SidebarItem to="/search" icon={Search} label="جستجو و کاوش" active={location.pathname === '/search'} onClick={closeSidebar} expanded={sidebarOpen} />
            <SidebarItem to="/upload" icon={UploadCloud} label="بارگذاری جزوه" active={location.pathname === '/upload'} onClick={closeSidebar} expanded={sidebarOpen} />
            <SidebarItem to="/my-notes" icon={FileText} label="جزوات من" active={location.pathname === '/my-notes'} onClick={closeSidebar} expanded={sidebarOpen} />
            <SidebarItem to="/leaderboard" icon={Award} label="برترین‌ها" active={location.pathname === '/leaderboard'} onClick={closeSidebar} expanded={sidebarOpen} />
            <SidebarItem to="/my-qr" icon={QrCode} label="کارت دیجیتال" active={location.pathname === '/my-qr'} onClick={closeSidebar} expanded={sidebarOpen} />
        </nav>

        <div className={`border-t border-slate-100 flex-shrink-0 ${sidebarOpen ? 'p-4' : 'p-2'}`}>
            <Link to="/login" className={`
                flex w-full items-center gap-x-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors
                ${sidebarOpen ? 'px-4 py-3' : 'p-3 justify-center'}
            `}>
                <LogOut size={20} />
                <span className={`font-medium text-sm whitespace-nowrap transition-all duration-300 overflow-hidden ${sidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0 hidden'}`}>
                    خروج از حساب
                </span>
            </Link>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-30 flex-shrink-0 sticky top-0">
          <div className="flex items-center gap-3">
             <button onClick={toggleSidebar} className="text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Menu size={24} />
             </button>
             <span className="font-bold text-lg text-slate-800 lg:hidden">یونی‌نوت</span>
          </div>
          
          <Link to="/notifications" className="text-slate-600 p-2 relative hover:bg-slate-100 rounded-lg transition-colors">
             <Bell size={24} />
             <span className="absolute top-2 left-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </Link>
        </header>

        <div className="flex-1 overflow-auto p-4 lg:p-8">
           <div className="max-w-6xl mx-auto w-full">
            {children}
           </div>
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/my-notes" element={<MyNotesPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/note/:id" element={<NoteDetailsPage />} />
              <Route path="/course/:id" element={<CourseDetailsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/profile/edit" element={<ProfileEditPage />} />
              <Route path="/my-courses" element={<MyCoursesPage />} />
              <Route path="/my-courses/add" element={<AddCoursePage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/my-qr" element={<MyQRCodePage />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </HashRouter>
  );
}

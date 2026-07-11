
import React, { useState } from 'react';
import { Bell, Heart, MessageCircle, Info, BookOpen, Check, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock Notification Types
type NotificationType = 'LIKE' | 'COMMENT' | 'SYSTEM' | 'COURSE';

interface Notification {
    id: number;
    type: NotificationType;
    title: string;
    description: string;
    time: string;
    read: boolean;
    link?: string;
}

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState<Notification[]>([
        { id: 1, type: 'LIKE', title: 'لایک جدید', description: 'علی محمدی جزوه "ریاضی عمومی ۱" شما را پسندید.', time: '۵ دقیقه پیش', read: false, link: '/note/n1' },
        { id: 2, type: 'COMMENT', title: 'نظر جدید', description: 'سارا احمدی روی جزوه "فیزیک ۲" نظری ارسال کرد.', time: '۱ ساعت پیش', read: false, link: '/note/n3' },
        { id: 3, type: 'COURSE', title: 'جزوه جدید در درس', description: 'دکتر کمالی جزوه جدیدی در درس "هوش مصنوعی" بارگذاری کرد.', time: '۲ ساعت پیش', read: true, link: '/note/n2' },
        { id: 4, type: 'SYSTEM', title: 'به‌روزرسانی سیستم', description: 'نسخه جدید یونی‌نوت با قابلیت‌های هوش مصنوعی منتشر شد!', time: '۱ روز پیش', read: true },
        { id: 5, type: 'LIKE', title: 'لایک جدید', description: 'رضا حسینی جزوه "ساختمان داده" شما را پسندید.', time: '۲ روز پیش', read: true, link: '/note/n4' },
    ]);

    const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

    const filteredNotifications = filter === 'ALL' 
        ? notifications 
        : notifications.filter(n => !n.read);

    const markAsRead = (id: number) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: number) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case 'LIKE': return <Heart size={20} className="text-red-500 fill-red-50" />;
            case 'COMMENT': return <MessageCircle size={20} className="text-blue-500" />;
            case 'COURSE': return <BookOpen size={20} className="text-emerald-500" />;
            case 'SYSTEM': return <Info size={20} className="text-amber-500" />;
        }
    };

    const getBgColor = (type: NotificationType) => {
        switch (type) {
            case 'LIKE': return 'bg-red-50 border-red-100';
            case 'COMMENT': return 'bg-blue-50 border-blue-100';
            case 'COURSE': return 'bg-emerald-50 border-emerald-100';
            case 'SYSTEM': return 'bg-amber-50 border-amber-100';
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Bell className="text-blue-600" />
                        اعلان‌ها
                    </h1>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setFilter('ALL')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${filter === 'ALL' ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
                    >
                        همه
                    </button>
                    <button 
                        onClick={() => setFilter('UNREAD')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${filter === 'UNREAD' ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
                    >
                        خوانده نشده
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <span className="text-sm text-slate-500 font-medium">
                        {filteredNotifications.length} اعلان
                    </span>
                    {notifications.some(n => !n.read) && (
                        <button onClick={markAllAsRead} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                            <Check size={14} />
                            علامت‌گذاری همه به عنوان خوانده شده
                        </button>
                    )}
                </div>

                <div className="divide-y divide-slate-100">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map(notification => (
                            <div 
                                key={notification.id} 
                                className={`p-6 flex gap-4 transition-colors group ${notification.read ? 'bg-white' : 'bg-blue-50/30'}`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center border ${getBgColor(notification.type)}`}>
                                    {getIcon(notification.type)}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`font-bold text-slate-800 ${!notification.read && 'text-blue-800'}`}>
                                            {notification.title}
                                            {!notification.read && <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2 align-middle"></span>}
                                        </h4>
                                        <span className="text-xs text-slate-400 whitespace-nowrap">{notification.time}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-3">{notification.description}</p>
                                    
                                    <div className="flex items-center gap-4">
                                        {notification.link && (
                                            <Link 
                                                to={notification.link} 
                                                onClick={() => markAsRead(notification.id)}
                                                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                                            >
                                                مشاهده جزئیات
                                            </Link>
                                        )}
                                        {!notification.read && (
                                            <button 
                                                onClick={() => markAsRead(notification.id)}
                                                className="text-xs text-slate-400 hover:text-slate-600"
                                            >
                                                خواندن
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => deleteNotification(notification.id)}
                                            className="text-xs text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity mr-auto"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center text-slate-400">
                            <Bell size={48} className="mx-auto mb-4 opacity-20" />
                            <p>هیچ اعلانی برای نمایش وجود ندارد.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;

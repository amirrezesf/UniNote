
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ArrowLeft, MoreVertical, GraduationCap } from 'lucide-react';
import { MOCK_MY_COURSES } from '../constants';

const MyCoursesPage = () => {
    return (
        <div className="space-y-6">
             <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <GraduationCap className="text-blue-600" />
                        درس‌های من
                    </h1>
                    <p className="text-slate-500">لیست دروسی که در این ترم دنبال می‌کنید.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_MY_COURSES.map(course => (
                    <div key={course.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all group relative">
                        <Link to={`/course/${course.id}`} className="absolute inset-0 z-0"></Link>
                        <button className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 z-10">
                            <MoreVertical size={20} />
                        </button>

                        <div className={`w-14 h-14 rounded-2xl ${course.color} flex items-center justify-center mb-4`}>
                            <BookOpen size={28} />
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                        <p className="text-sm text-slate-500 mb-4">مدرس: {course.instructor}</p>

                        <div className="mb-4">
                            <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                                <span>پیشرفت دوره</span>
                                <span>{course.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                                    style={{ width: `${course.progress}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Clock size={14} />
                                <span>{course.nextSession}</span>
                            </div>
                            <span className="text-blue-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                                مشاهده کلاس
                                <ArrowLeft size={16} />
                            </span>
                        </div>
                    </div>
                ))}

                {/* Add New Course Card */}
                <Link to="/my-courses/add" className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 p-6 flex flex-col items-center justify-center text-slate-400 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all min-h-[200px]">
                    <div className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                        <span className="text-2xl font-bold">+</span>
                    </div>
                    <span className="font-bold">افزودن درس جدید</span>
                </Link>
            </div>
        </div>
    );
};

export default MyCoursesPage;

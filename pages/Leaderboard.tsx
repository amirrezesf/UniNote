
import React from 'react';
import { LEADERBOARD_DATA } from '../constants';
import { Award, Medal, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Link } from 'react-router-dom';

const LeaderboardPage = () => {
    // Colors for the chart bars
    const colors = ['#f59e0b', '#64748b', '#b45309', '#3b82f6', '#3b82f6'];

    return (
        <div className="space-y-8">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center justify-center gap-3">
                    <Trophy className="text-amber-500" size={32} />
                    برترین‌های یونی‌نوت
                </h1>
                <p className="text-slate-500">دانشجویان و اساتیدی که بیشترین مشارکت را در اشتراک دانش داشته‌اند.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Top 3 Cards */}
                 <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    {/* 2nd Place */}
                    <Link to={`/profile/${LEADERBOARD_DATA[1].user.id}`} className="order-2 md:order-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center relative mt-8 md:mt-0 hover:shadow-lg transition-all group">
                        <div className="absolute -top-4 w-8 h-8 bg-slate-300 text-white rounded-full flex items-center justify-center font-bold border-4 border-white">2</div>
                        <img src={LEADERBOARD_DATA[1].user.avatarUrl} alt="" className="w-20 h-20 rounded-full border-4 border-slate-100 mb-4 group-hover:scale-105 transition-transform" />
                        <h3 className="font-bold text-lg text-slate-800">{LEADERBOARD_DATA[1].user.name}</h3>
                        <p className="text-sm text-slate-500 mb-2">{LEADERBOARD_DATA[1].user.role === 'INSTRUCTOR' ? 'استاد' : 'دانشجو'}</p>
                        <div className="bg-slate-50 px-4 py-2 rounded-lg text-slate-700 font-bold">
                            {LEADERBOARD_DATA[1].totalPoints} امتیاز
                        </div>
                    </Link>

                    {/* 1st Place */}
                    <Link to={`/profile/${LEADERBOARD_DATA[0].user.id}`} className="order-1 md:order-2 bg-gradient-to-b from-amber-50 to-white p-8 rounded-2xl border-2 border-amber-200 shadow-lg flex flex-col items-center relative transform md:-translate-y-4 hover:shadow-xl transition-all group">
                        <div className="absolute -top-6 text-amber-500"><Medal size={48} /></div>
                        <img src={LEADERBOARD_DATA[0].user.avatarUrl} alt="" className="w-24 h-24 rounded-full border-4 border-amber-100 mb-4 group-hover:scale-105 transition-transform" />
                        <h3 className="font-bold text-xl text-slate-900">{LEADERBOARD_DATA[0].user.name}</h3>
                         <p className="text-sm text-slate-500 mb-2">{LEADERBOARD_DATA[0].user.role === 'INSTRUCTOR' ? 'استاد' : 'دانشجو'}</p>
                        <div className="bg-amber-100 text-amber-700 px-6 py-2 rounded-xl font-bold text-lg">
                            {LEADERBOARD_DATA[0].totalPoints} امتیاز
                        </div>
                    </Link>

                    {/* 3rd Place */}
                    <Link to={`/profile/${LEADERBOARD_DATA[2].user.id}`} className="order-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center relative hover:shadow-lg transition-all group">
                         <div className="absolute -top-4 w-8 h-8 bg-amber-700 text-white rounded-full flex items-center justify-center font-bold border-4 border-white">3</div>
                        <img src={LEADERBOARD_DATA[2].user.avatarUrl} alt="" className="w-20 h-20 rounded-full border-4 border-slate-100 mb-4 group-hover:scale-105 transition-transform" />
                        <h3 className="font-bold text-lg text-slate-800">{LEADERBOARD_DATA[2].user.name}</h3>
                         <p className="text-sm text-slate-500 mb-2">{LEADERBOARD_DATA[2].user.role === 'INSTRUCTOR' ? 'استاد' : 'دانشجو'}</p>
                        <div className="bg-amber-50 px-4 py-2 rounded-lg text-amber-800 font-bold">
                            {LEADERBOARD_DATA[2].totalPoints} امتیاز
                        </div>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List View */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="font-bold text-lg">رده‌بندی کلی</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-slate-50 text-slate-500 text-sm">
                                <tr>
                                    <th className="px-6 py-4 font-medium">رتبه</th>
                                    <th className="px-6 py-4 font-medium">کاربر</th>
                                    <th className="px-6 py-4 font-medium">تعداد جزوات</th>
                                    <th className="px-6 py-4 font-medium">مجموع امتیاز</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {LEADERBOARD_DATA.map((entry) => (
                                    <tr key={entry.rank} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-400">#{entry.rank}</td>
                                        <td className="px-6 py-4">
                                            <Link to={`/profile/${entry.user.id}`} className="flex items-center gap-3 group">
                                                <img src={entry.user.avatarUrl} className="w-8 h-8 rounded-full group-hover:scale-110 transition-transform" alt="" />
                                                <span className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">{entry.user.name}</span>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{entry.contributions}</td>
                                        <td className="px-6 py-4 font-bold text-slate-800">{entry.totalPoints}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Chart */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col">
                    <h3 className="font-bold text-lg mb-6">نمودار امتیازات</h3>
                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={LEADERBOARD_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="user.name" type="category" width={100} tick={{fontSize: 12, fontFamily: 'Vazirmatn'}} />
                                <Tooltip 
                                    cursor={{fill: 'transparent'}}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="totalPoints" radius={[0, 4, 4, 0]} barSize={20}>
                                    {LEADERBOARD_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;

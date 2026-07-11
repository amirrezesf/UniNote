
import React, { useState } from 'react';
import { QrCode, Search, UserPlus, CheckCircle, XCircle, ScanLine, Loader2 } from 'lucide-react';
import { MOCK_NOTES, LEADERBOARD_DATA } from '../constants';
import { User } from '../types';

const AddClassmatePage = () => {
    const [code, setCode] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [foundUser, setFoundUser] = useState<User | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Mock pool of users to search from
    const allUsers = [...LEADERBOARD_DATA.map(l => l.user)];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!code) return;
        
        setError('');
        setFoundUser(null);
        setSuccess(false);
        setIsLoading(true);

        // Simulate API search
        setTimeout(() => {
            setIsLoading(false);
            // Mock logic: randomly find a user or fail if code is short
            if (code.length < 5) {
                setError('کد وارد شده نامعتبر است.');
                return;
            }
            
            // Just pick a random user for demo purposes if code is "valid"
            const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
            setFoundUser(randomUser);
        }, 1000);
    };

    const handleAddStudent = () => {
        setIsLoading(true);
        // Simulate Add API
        setTimeout(() => {
            setIsLoading(false);
            setSuccess(true);
            setFoundUser(null);
            setCode('');
        }, 1500);
    };

    return (
        <div className="max-w-xl mx-auto py-8">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <UserPlus size={32} />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">افزودن دانشجو به کلاس</h1>
                <p className="text-slate-500 mt-2">کد اختصاصی دانشجو را وارد کنید یا QR کد او را اسکن نمایید.</p>
            </div>

            {success ? (
                <div className="bg-green-50 border border-green-200 rounded-3xl p-8 text-center animate-in zoom-in duration-300">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-800 mb-2">عملیات موفقیت‌آمیز بود</h2>
                    <p className="text-slate-600 mb-6">دانشجو با موفقیت به لیست کلاس اضافه شد.</p>
                    <button 
                        onClick={() => setSuccess(false)}
                        className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition-colors"
                    >
                        افزودن نفر بعدی
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
                    {/* Tabs / Scan Toggle */}
                    <div className="flex gap-4 mb-6">
                        <button 
                            onClick={() => setIsScanning(false)}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 ${!isScanning ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        >
                            <Search size={18} />
                            وارد کردن کد
                        </button>
                        <button 
                            onClick={() => setIsScanning(true)}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 ${isScanning ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        >
                            <QrCode size={18} />
                            اسکن QR
                        </button>
                    </div>

                    {isScanning ? (
                        <div className="aspect-square bg-slate-900 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center text-slate-400">
                            <ScanLine size={64} className="animate-pulse mb-4 text-blue-500" />
                            <p className="text-sm font-medium">دوربین را مقابل QR کد نگه دارید</p>
                            <div className="absolute inset-0 border-2 border-blue-500/50 rounded-2xl m-8 pointer-events-none">
                                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-blue-500 -mt-0.5 -ml-0.5"></div>
                                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-blue-500 -mt-0.5 -mr-0.5"></div>
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-blue-500 -mb-0.5 -ml-0.5"></div>
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-blue-500 -mb-0.5 -mr-0.5"></div>
                            </div>
                            {/* Simulate Scan Button */}
                            <button 
                                onClick={() => { setCode('U1-MOCK-SCAN'); setIsScanning(false); }}
                                className="absolute bottom-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs hover:bg-white/20 transition-colors"
                            >
                                شبیه‌سازی اسکن موفق
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSearch}>
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-slate-700 mb-2">کد اختصاصی دانشجو</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        placeholder="مثال: U1-8492"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-0 text-center font-mono text-lg tracking-widest uppercase placeholder:normal-case placeholder:tracking-normal placeholder:font-sans"
                                    />
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                </div>
                                {error && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                        <XCircle size={14} />
                                        {error}
                                    </p>
                                )}
                            </div>
                            <button 
                                type="submit" 
                                disabled={!code || isLoading}
                                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : 'جستجوی دانشجو'}
                            </button>
                        </form>
                    )}

                    {/* Result Card */}
                    {foundUser && !isScanning && (
                        <div className="mt-8 border-t border-slate-100 pt-6 animate-in slide-in-from-bottom-4 duration-500">
                            <p className="text-sm font-bold text-slate-400 mb-4">نتیجه جستجو:</p>
                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6">
                                <img src={foundUser.avatarUrl} alt="" className="w-16 h-16 rounded-xl object-cover" />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-900 text-lg">{foundUser.name}</h3>
                                    <p className="text-sm text-slate-500">{foundUser.university}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${foundUser.role === 'INSTRUCTOR' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {foundUser.role === 'INSTRUCTOR' ? 'استاد' : 'دانشجو'}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                    <CheckCircle size={20} />
                                </div>
                            </div>
                            
                            <div className="flex gap-3">
                                <button 
                                    onClick={handleAddStudent}
                                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                                >
                                    تایید و افزودن
                                </button>
                                <button 
                                    onClick={() => setFoundUser(null)}
                                    className="px-6 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                                >
                                    انصراف
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AddClassmatePage;

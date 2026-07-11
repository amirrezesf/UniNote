
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Award, Lock, User, Eye, EyeOff, ArrowLeft, LogIn } from 'lucide-react';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            if (email && password) {
                // Mock success - in real app, check credentials here
                setIsLoading(false);
                navigate('/');
            } else {
                setIsLoading(false);
                setError('لطفا نام کاربری و رمز عبور را وارد کنید.');
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-blue-600 rounded-b-[10%] z-0"></div>
            <div className="absolute top-10 left-10 text-white/10">
                <Award size={200} />
            </div>

            <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                <div className="p-8 pb-0 text-center">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                        <Award size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">خوش آمدید!</h1>
                    <p className="text-slate-500 text-sm">برای استفاده از یونی‌نوت وارد حساب خود شوید</p>
                </div>

                <form onSubmit={handleLogin} className="p-8 space-y-5">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl flex items-center gap-2">
                           <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                           {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 block">نام کاربری یا ایمیل</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-4 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-left dir-ltr"
                                placeholder="example@uni.ac.ir"
                            />
                            <User className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-slate-700 block">رمز عبور</label>
                            <Link to="/forgot-password" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                                رمز عبور را فراموش کرده‌اید؟
                            </Link>
                        </div>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-left dir-ltr"
                                placeholder="••••••••"
                            />
                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            <>
                                ورود به حساب
                                <LogIn size={20} />
                            </>
                        )}
                    </button>

                    <div className="text-center pt-2">
                        <p className="text-slate-500 text-sm">
                            حساب کاربری ندارید؟{' '}
                            <Link to="/register" className="text-blue-600 font-bold hover:underline">
                                ثبت نام کنید
                            </Link>
                        </p>
                    </div>
                </form>

                <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                    <Link to="/" className="text-slate-500 text-xs hover:text-slate-700 flex items-center justify-center gap-1">
                        بازگشت به صفحه اصلی
                        <ArrowLeft size={12} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

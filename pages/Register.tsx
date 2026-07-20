import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';
import { Award, Lock, User, Mail, Eye, EyeOff, AlertCircle, UserPlus } from 'lucide-react';

const RegisterPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { register, isLoading: authLoading } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const from = (location.state as { from?: Location })?.from?.pathname || '/';

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('رمز عبور و تکرار آن یکسان نیستند');
            return;
        }
        if (password.length < 6) {
            setError('رمز عبور باید حداقل ۶ کاراکتر باشد');
            return;
        }

        setIsLoading(true);
        try {
            await register({ email, name, password });
            navigate(from, { replace: true });
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'ثبت‌نام با خطا مواجه شد');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-indigo-600 rounded-b-[10%] z-0"></div>
            <div className="absolute top-10 left-10 text-white/10">
                <Award size={200} />
            </div>

            <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                <div className="p-8 pb-0 text-center">
                    <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
                        <Award size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">ساخت حساب جدید</h1>
                    <p className="text-slate-500 text-sm">به جامعه یونی‌نوت بپیوندید</p>
                </div>

                <form onSubmit={handleRegister} className="p-8 space-y-5">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl flex items-center gap-2">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 block">نام و نام خانوادگی</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                placeholder="نام خود را وارد کنید"
                                required
                            />
                            <User className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 block">ایمیل</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-left dir-ltr"
                                placeholder="example@uni.ac.ir"
                                required
                            />
                            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 block">رمز عبور</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-left dir-ltr"
                                placeholder="••••••••"
                                required
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

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 block">تکرار رمز عبور</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-left dir-ltr"
                                placeholder="••••••••"
                                required
                            />
                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || authLoading}
                        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            <>
                                ثبت‌نام
                                <UserPlus size={20} />
                            </>
                        )}
                    </button>

                    <div className="text-center pt-2">
                        <p className="text-slate-500 text-sm">
                            از قبل حساب دارید؟{' '}
                            <Link to="/login" className="text-indigo-600 font-bold hover:underline">
                                وارد شوید
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;

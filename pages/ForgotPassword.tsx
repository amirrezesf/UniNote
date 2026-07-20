import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';
import { Award, Lock, Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const { requestPasswordReset } = useAuth();

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await requestPasswordReset(email);
            setSuccess(true);
            setSuccessMessage('اگر ایمیل در سیستم ثبت باشد، لینک بازیابی رمز عبور برای شما ارسال خواهد شد.');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'خطا در ارسال ایمیل بازیابی');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="p-8 pb-0 text-center">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">ایمیل ارسال شد</h1>
                        <p className="text-slate-500 text-sm mb-6">{successMessage}</p>
                    </div>
                    <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                        <Link to="/login" className="text-blue-600 text-sm font-bold hover:underline flex items-center justify-center gap-1">
                            بازگشت به ورود
                            <ArrowLeft size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

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
                        <Lock size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">بازیابی رمز عبور</h1>
                    <p className="text-slate-500 text-sm">ایمیل خود را وارد کنید تا لینک بازیابی رمز عبور برای شما ارسال شود</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl flex items-center gap-2">
                            <Mail size={16} className="text-red-500" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 block">آدرس ایمیل</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-left dir-ltr"
                                placeholder="example@uni.ac.ir"
                                required
                                disabled={isLoading}
                            />
                            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                در حال ارسال...
                            </>
                        ) : (
                            'ارسال لینک بازیابی'
                        )}
                    </button>

                    <div className="text-center pt-2">
                        <p className="text-slate-500 text-sm">
                            به ورود برگردید؟{' '}
                            <Link to="/login" className="text-blue-600 font-bold hover:underline">
                                ورود
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
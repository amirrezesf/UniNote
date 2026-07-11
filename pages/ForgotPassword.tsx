
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Mail, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSent(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-indigo-900 rounded-b-[10%] z-0"></div>
            
            <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        {isSent ? <CheckCircle size={32} /> : <AlertCircle size={32} />}
                    </div>
                    
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                        {isSent ? 'ایمیل ارسال شد' : 'بازیابی رمز عبور'}
                    </h1>
                    
                    <p className="text-slate-500 text-sm mb-6">
                        {isSent 
                            ? `لینک بازیابی رمز عبور به ایمیل ${email} ارسال شد. لطفا صندوق ورودی خود را چک کنید.` 
                            : 'ایمیل خود را وارد کنید تا لینک تغییر رمز عبور برای شما ارسال شود.'}
                    </p>

                    {!isSent ? (
                        <form onSubmit={handleSubmit} className="space-y-6 text-right">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 block">آدرس ایمیل</label>
                                <div className="relative">
                                    <input 
                                        type="email" 
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-4 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-left dir-ltr"
                                        placeholder="example@uni.ac.ir"
                                    />
                                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'در حال ارسال...' : 'ارسال لینک بازیابی'}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                             <div className="p-4 bg-indigo-50 text-indigo-800 text-sm rounded-xl">
                                اگر ایمیلی دریافت نکردید، لطفا پوشه اسپم را چک کنید یا دوباره تلاش کنید.
                             </div>
                             <button 
                                onClick={() => setIsSent(false)}
                                className="text-indigo-600 font-bold text-sm hover:underline"
                             >
                                تلاش مجدد با ایمیل دیگر
                             </button>
                        </div>
                    )}
                </div>

                <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                    <Link to="/login" className="text-slate-600 text-sm font-bold hover:text-indigo-600 flex items-center justify-center gap-2">
                        <ArrowRight size={16} />
                        بازگشت به صفحه ورود
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;

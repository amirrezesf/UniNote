
import React from 'react';
import { CURRENT_USER } from '../constants';
import { QrCode, Copy, Share2, Download, ShieldCheck } from 'lucide-react';

const MyQRCodePage = () => {
    // Generate a consistent code based on ID
    const studentCode = `${CURRENT_USER.id.toUpperCase()}-${Math.floor(Math.random() * 8999 + 1000)}`;
    const qrData = `UNINOTE:${CURRENT_USER.id}:${studentCode}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}&color=2563eb`;

    const copyCode = () => {
        navigator.clipboard.writeText(studentCode);
        // Toast notification would go here
    };

    return (
        <div className="max-w-md mx-auto py-8">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-slate-900">کارت دیجیتال من</h1>
                <p className="text-slate-500">جهت احراز هویت یا عضویت در کلاس، این کد را به نماینده کلاس ارائه دهید.</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
                {/* Decorative Background */}
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="absolute -bottom-10 left-0 right-0 flex justify-center">
                        <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-lg">
                            <img src={CURRENT_USER.avatarUrl} alt="" className="w-full h-full rounded-xl object-cover" />
                        </div>
                    </div>
                </div>

                <div className="pt-12 pb-8 px-8 text-center">
                    <h2 className="text-xl font-bold text-slate-900 mb-1">{CURRENT_USER.name}</h2>
                    <p className="text-slate-500 text-sm mb-6 flex items-center justify-center gap-1">
                        {CURRENT_USER.university}
                        {CURRENT_USER.role === 'CLASS_REP' && <ShieldCheck size={14} className="text-blue-600" />}
                    </p>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 inline-block mb-6">
                        <img src={qrUrl} alt="QR Code" className="w-48 h-48 mix-blend-multiply opacity-90" />
                    </div>

                    <div className="mb-8">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">کد اختصاصی شما</p>
                        <div 
                            onClick={copyCode}
                            className="bg-slate-100 border border-slate-200 rounded-xl py-3 px-6 flex items-center justify-center gap-3 cursor-pointer hover:bg-slate-200 transition-colors group"
                        >
                            <span className="text-2xl font-mono font-bold text-slate-800 tracking-[0.2em]">{studentCode}</span>
                            <Copy size={18} className="text-slate-400 group-hover:text-blue-600" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                            <Share2 size={18} />
                            اشتراک‌گذاری
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
                            <Download size={18} />
                            ذخیره تصویر
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyQRCodePage;

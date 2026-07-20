import React from 'react';
import { DollarSign, TrendingUp, Download, Clock, Loader2, AlertCircle, BarChart3 } from 'lucide-react';
import { useEarnings, useEarningsHistory } from '../src/api/hooks/earnings';
import { useAuth } from '../src/context/AuthContext';
import { Link } from 'react-router-dom';
import { formatJalali } from '../src/utils/date';

export default function EarningsPage() {
  const { isAuthenticated } = useAuth();
  const { data: earnings, isLoading, error } = useEarnings();
  const { data: history } = useEarningsHistory();

  const formatPrice = (t: number) => t.toLocaleString('fa-IR') + ' تومان';

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500">
        <BarChart3 size={64} className="mb-4 text-slate-300" />
        <h2 className="text-xl font-bold text-slate-700 mb-2">لطفاً وارد حساب خود شوید</h2>
        <p className="mb-4">برای مشاهده درآمدها باید وارد شوید.</p>
        <Link to="/login" className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">ورود</Link>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-24"><Loader2 size={32} className="animate-spin text-blue-600" /></div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-red-500">
        <AlertCircle size={48} className="mb-4" />
        <p>خطا در دریافت اطلاعات درآمد</p>
      </div>
    );
  }

  if (!earnings) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">درآمد من</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600"><DollarSign size={22} /></div>
            <span className="text-sm text-slate-500">مجموع درآمد</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{formatPrice(earnings.totalEarned)}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600"><TrendingUp size={22} /></div>
            <span className="text-sm text-slate-500">قابل برداشت</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{formatPrice(earnings.pendingEarnings)}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600"><Download size={22} /></div>
            <span className="text-sm text-slate-500">تعداد فروش</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{earnings.totalDownloads}</p>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="font-bold text-lg text-slate-800 mb-4">فروش‌های اخیر</h2>
        {(!earnings.recentSales || earnings.recentSales.length === 0) ? (
          <div className="text-center py-8 text-slate-400">
            <p>هنوز فروشی ثبت نشده است.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {earnings.recentSales.map((sale, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <p className="font-medium text-slate-700">{sale.materialTitle}</p>
                  <p className="text-xs text-slate-400">{sale.buyerName}</p>
                </div>
                <div className="text-left">
                  <p className="font-bold text-emerald-600">{formatPrice(sale.amount)}</p>
                  <p className="text-xs text-slate-400">{formatJalali(sale.date)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History Table */}
      {history && history.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="font-bold text-lg text-slate-800 mb-4">تاریخچه فروش</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="text-right py-2 px-3">جزوه</th>
                  <th className="text-right py-2 px-3">خریدار</th>
                  <th className="text-left py-2 px-3">تاریخ</th>
                  <th className="text-left py-2 px-3">مبلغ</th>
                </tr>
              </thead>
              <tbody>
                {history.map((sale, idx) => (
                  <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-2 px-3 font-medium">{sale.materialTitle}</td>
                    <td className="py-2 px-3 text-slate-600">{sale.buyerName}</td>
                    <td className="py-2 px-3 text-slate-500">{formatJalali(sale.date)}</td>
                    <td className="py-2 px-3 font-bold text-emerald-600">{formatPrice(sale.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Package, Loader2, AlertCircle, ShoppingBag } from 'lucide-react';
import { usePurchases } from '../src/api/hooks/purchases';
import { useAuth } from '../src/context/AuthContext';
import { formatJalali } from '../src/utils/date';

export default function PurchasesPage() {
  const { isAuthenticated } = useAuth();
  const { data: purchases, isLoading, error } = usePurchases();

  const formatPrice = (t: number) => t.toLocaleString('fa-IR') + ' تومان';

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500">
        <Package size={64} className="mb-4 text-slate-300" />
        <h2 className="text-xl font-bold text-slate-700 mb-2">لطفاً وارد حساب خود شوید</h2>
        <p className="mb-4">برای مشاهده خریدهای خود باید وارد شوید.</p>
        <Link to="/login" className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
          ورود
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-red-500">
        <AlertCircle size={48} className="mb-4" />
        <p>خطا در دریافت لیست خریدها</p>
      </div>
    );
  }

  if (!purchases || purchases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500">
        <ShoppingBag size={64} className="mb-4 text-slate-300" />
        <h2 className="text-xl font-bold text-slate-700 mb-2">خریدی انجام نداده‌اید</h2>
        <p className="mb-4">هنوز هیچ جزوه‌ای خریداری نکرده‌اید.</p>
        <Link to="/browse" className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
          مرور جزوات
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">خریدهای من</h1>
        <p className="text-slate-500 text-sm">{purchases.length} جزوه خریداری شده</p>
      </div>

      <div className="space-y-3">
        {purchases.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-slate-100">
            <img
              src={p.material.thumbnailUrl}
              alt={p.material.title}
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <Link to={`/material/${p.material.id}`} className="font-semibold text-slate-800 hover:text-blue-600 truncate block">
                {p.material.title}
              </Link>
              <p className="text-xs text-slate-400">
                خریداری شده در {formatJalali(p.purchasedAt)}
              </p>
            </div>
            <div className="text-left text-sm">
              <p className="text-slate-500">{formatPrice(p.pricePaid)}</p>
            </div>
            <a
              href={p.fileUrl}
              download
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition text-sm font-medium"
            >
              <Download size={16} />
              دانلود
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Loader2, AlertCircle, Trash2, BookOpen, FileText, Library } from 'lucide-react';
import { useLibrary, useRemoveFromLibrary } from '../src/api/hooks/library';
import { useAuth } from '../src/context/AuthContext';
import MaterialTypeBadge from '../components/MaterialTypeBadge';
import { formatJalali } from '../src/utils/date';

export default function LibraryPage() {
  const { isAuthenticated } = useAuth();
  const { data: items, isLoading, error } = useLibrary();
  const removeFromLibrary = useRemoveFromLibrary();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500">
        <Library size={64} className="mb-4 text-slate-300" />
        <h2 className="text-xl font-bold text-slate-700 mb-2">لطفاً وارد حساب خود شوید</h2>
        <p className="mb-4">برای مشاهده کتابخانه خود باید وارد شوید.</p>
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
        <p>خطا در دریافت کتابخانه</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500">
        <Bookmark size={64} className="mb-4 text-slate-300" />
        <h2 className="text-xl font-bold text-slate-700 mb-2">کتابخانه شما خالی است</h2>
        <p className="mb-4">جزوات مورد علاقه خود را با کلیک روی نشان «بوکمارک» به کتابخانه اضافه کنید.</p>
        <Link to="/browse" className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
          مرور جزوات
        </Link>
      </div>
    );
  }

  const handleRemove = (materialId: string) => {
    removeFromLibrary.mutate(materialId);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">کتابخانه من</h1>
        <p className="text-slate-500 text-sm">{items.length} جزوه ذخیره شده</p>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group"
          >
            <Link to={`/material/${item.material.id}`} className="flex-shrink-0">
              <img
                src={item.material.thumbnailUrl}
                alt={item.material.title}
                className="w-16 h-16 rounded-xl object-cover"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link
                to={`/material/${item.material.id}`}
                className="font-semibold text-slate-800 hover:text-blue-600 truncate block"
              >
                {item.material.title}
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <MaterialTypeBadge type={item.material.materialType as any} size="sm" />
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  {item.material.fileType.toUpperCase()}
                </span>
                <span className="text-xs text-slate-400">
                  {item.material.uploaderName}
                </span>
              </div>
            </div>
            <div className="text-xs text-slate-400 flex-shrink-0 hidden sm:block">
              {formatJalali(item.createdAt)}
            </div>
            <button
              onClick={() => handleRemove(item.material.id)}
              disabled={removeFromLibrary.isPending}
              className="flex-shrink-0 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="حذف از کتابخانه"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMyMaterials } from '../src/api/hooks/materials';
import { useUpdateMaterial, useDeleteMaterial } from '../src/api/hooks/mutations';
import { Material, MaterialType, NoteStatus } from '../types';
import { FileText, Edit, Trash2, Eye, Clock, CheckCircle, XCircle, Plus, Save, X, Download } from 'lucide-react';
import MaterialTypeBadge from '../components/MaterialTypeBadge';
import EmptyState from '../components/EmptyState';
import { formatJalali } from '../src/utils/date';

const materialTypeLabels: Record<MaterialType, string> = {
  HANDOUT: 'جزوه',
  EXAM: 'نمونه سوال',
  NOTE: 'یادداشت',
  SLIDE: 'اسلاید',
  ASSIGNMENT: 'تکلیف',
};

const MyMaterialsPage = () => {
  const [filter, setFilter] = useState<'ALL' | NoteStatus>('ALL');
  const [editing, setEditing] = useState<Material | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });

  const { data: materials = [], isLoading, error, refetch } = useMyMaterials();

  const filtered = filter === 'ALL' ? materials : materials.filter(m => m.status === filter);

  const handleDelete = (id: string) => {
    if (window.confirm('آیا از حذف این منبع اطمینان دارید؟')) {
      const deleteMutation = useDeleteMaterial(id);
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          refetch();
        },
        onError: (err) => {
          alert(err.message || 'خطا در حذف منبع');
        },
      });
    }
  };

  const handleEditClick = (m: Material) => {
    setEditing(m);
    setEditForm({ title: m.title, description: m.description });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const updateMutation = useUpdateMaterial(editing.id);
    updateMutation.mutate(editForm, {
      onSuccess: () => {
        setEditing(null);
        refetch();
      },
      onError: (err) => {
        alert(err.message || 'خطا در ویرایش منبع');
      },
    });
  };

  const handleDownloadAll = () => {
    if (filtered.length === 0) { alert('هیچ موردی برای دانلود وجود ندارد.'); return; }
    alert(`در حال دانلود ${filtered.length} فایل...`);
  };

  const statusConfig = (status: NoteStatus) => {
    switch (status) {
      case NoteStatus.PUBLISHED: return { color: 'text-green-600 bg-green-50', icon: CheckCircle, label: 'منتشر شده' };
      case NoteStatus.PENDING: return { color: 'text-amber-600 bg-amber-50', icon: Clock, label: 'در انتظار تایید' };
      case NoteStatus.REJECTED: return { color: 'text-red-600 bg-red-50', icon: XCircle, label: 'رد شده' };
      default: return { color: 'text-slate-600 bg-slate-50', icon: FileText, label: 'نامشخص' };
    }
  };

  const filterBtn = (active: boolean, extra: string) =>
    `px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${active ? extra : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`;

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><FileText className="text-blue-600" /> مشارکت‌های من</h1>
          <p className="text-slate-500">مدیریت منابعی که بارگذاری کرده‌اید.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleDownloadAll} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
            <Download size={20} /> دانلود همه
          </button>
          <Link to="/upload" className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200">
            <Plus size={20} /> بارگذاری منبع جدید
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
        <button onClick={() => setFilter('ALL')} className={filterBtn(filter === 'ALL', 'bg-slate-800 text-white')}>همه ({materials.length})</button>
        <button onClick={() => setFilter(NoteStatus.PUBLISHED)} className={filterBtn(filter === NoteStatus.PUBLISHED, 'bg-green-600 text-white')}>منتشر شده ({materials.filter(m => m.status === NoteStatus.PUBLISHED).length})</button>
        <button onClick={() => setFilter(NoteStatus.PENDING)} className={filterBtn(filter === NoteStatus.PENDING, 'bg-amber-500 text-white')}>در انتظار ({materials.filter(m => m.status === NoteStatus.PENDING).length})</button>
        <button onClick={() => setFilter(NoteStatus.REJECTED)} className={filterBtn(filter === NoteStatus.REJECTED, 'bg-red-500 text-white')}>رد شده ({materials.filter(m => m.status === NoteStatus.REJECTED).length})</button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
              <div className="h-40 bg-slate-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="h-4 bg-slate-200 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <EmptyState icon={FileText} title="خطا در بارگذاری" description="لطفاً صفحه را بازآوری کنید." />
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(m => {
            const cfg = statusConfig(m.status);
            const StatusIcon = cfg.icon;
            return (
              <div key={m.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col">
                <div className="relative h-40 bg-slate-100">
                  <img src={m.thumbnailUrl} alt={m.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2"><MaterialTypeBadge type={m.materialType} /></div>
                  <div className={`absolute bottom-2 right-2 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${cfg.color} bg-white/90 backdrop-blur-sm shadow-sm`}>
                    <StatusIcon size={12} /> {cfg.label}
                  </div>
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-700 shadow-sm">{m.fileType.toUpperCase()}</div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">{m.title}</h3>
                  <p className="text-sm text-slate-500 mb-4">{materialTypeLabels[m.materialType]}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span className="flex items-center gap-1"><Eye size={14} /> {m.views}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> {formatJalali(m.createdAt)}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/material/${m.id}`} className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors" title="مشاهده"><Eye size={18} /></Link>
                      <button onClick={() => handleEditClick(m)} className="p-2 hover:bg-amber-50 text-slate-400 hover:text-amber-600 rounded-lg transition-colors" title="ویرایش"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(m.id)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors" title="حذف"><Trash2 size={18} /></button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title={filter === 'ALL' ? 'هنوز منبعی بارگذاری نکرده‌ید' : 'منبعی با این وضعیت یافت نشد'}
          description="با به اشتراک‌گذاری منابع خود، به دانشجویان دیگر کمک کنید و امتیاز کسب نمایید."
        >
          {filter === 'ALL' && (
            <Link to="/upload" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
              <Plus size={20} /> اولین منبع خود را بارگذاری کنید
            </Link>
          )}
        </EmptyState>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2"><Edit size={20} className="text-blue-600" /> ویرایش منبع</h3>
              <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-red-500 transition-colors p-1"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">عنوان منبع</label>
                <input type="text" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">توضیحات</label>
                <textarea rows={4} value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  <Save size={18} /> ذخیره تغییرات
                </button>
                <button type="button" onClick={() => setEditing(null)} className="px-6 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors">انصراف</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMaterialsPage;
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowLeft, CreditCard, Loader2, AlertCircle, ShoppingBag } from 'lucide-react';
import { useCart, useRemoveCartItem, useClearCart, useCheckout } from '../src/api/hooks/cart';
import { useAuth } from '../src/context/AuthContext';

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const { data: cart, isLoading, error } = useCart();
  const removeItem = useRemoveCartItem();
  const clearCart = useClearCart();
  const checkout = useCheckout();

  const formatPrice = (t: number) => t.toLocaleString('fa-IR') + ' تومان';

  const handleCheckout = async () => {
    const result = await checkout.mutateAsync();
    if (result.paymentUrl) {
      window.location.href = result.paymentUrl;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500">
        <ShoppingBag size={64} className="mb-4 text-slate-300" />
        <h2 className="text-xl font-bold text-slate-700 mb-2">لطفاً وارد حساب خود شوید</h2>
        <p className="mb-4">برای مشاهده سبد خرید باید وارد شوید.</p>
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
        <p>خطا در دریافت اطلاعات سبد خرید</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500">
        <ShoppingCart size={64} className="mb-4 text-slate-300" />
        <h2 className="text-xl font-bold text-slate-700 mb-2">سبد خرید خالی است</h2>
        <p className="mb-4">هنوز جزوه‌ای اضافه نکرده‌اید.</p>
        <Link to="/browse" className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
          مرور جزوات
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">سبد خرید</h1>
          <p className="text-slate-500 text-sm">{cart.itemCount} جزوه در سبد خرید</p>
        </div>
        <button
          onClick={() => clearCart.mutate()}
          disabled={clearCart.isPending}
          className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition text-sm"
        >
          <Trash2 size={16} />
          پاک کردن سبد
        </button>
      </div>

      {/* Cart Items */}
      <div className="space-y-3">
        {cart.items.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-slate-100">
            <img
              src={item.material.thumbnailUrl}
              alt={item.material.title}
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <Link to={`/material/${item.material.id}`} className="font-semibold text-slate-800 hover:text-blue-600 truncate block">
                {item.material.title}
              </Link>
              <p className="text-sm text-slate-500">جزوه پولی</p>
            </div>
            <div className="text-left">
              <p className="font-bold text-blue-600">{formatPrice(item.priceAtAdd)}</p>
            </div>
            <button
              onClick={() => removeItem.mutate(item.id)}
              disabled={removeItem.isPending}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-600">مجموع</span>
          <span className="text-2xl font-bold text-slate-800">{formatPrice(cart.totalTomans)}</span>
        </div>
        <button
          onClick={handleCheckout}
          disabled={checkout.isPending}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
        >
          {checkout.isPending ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <CreditCard size={20} />
          )}
          {checkout.isPending ? 'در حال اتصال به درگاه...' : 'پرداخت'}
        </button>
        {checkout.error && (
          <p className="text-red-500 text-sm mt-2 text-center">
            {(checkout.error as any)?.response?.data?.detail || 'خطا در اتصال به درگاه پرداخت'}
          </p>
        )}
      </div>
    </div>
  );
}
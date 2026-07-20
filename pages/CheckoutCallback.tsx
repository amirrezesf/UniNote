import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ShoppingCart } from 'lucide-react';
import { useVerifyPayment } from '../src/api/hooks/cart';
import { useQueryClient } from '@tanstack/react-query';
import { qk } from '../src/api/keys';

type VerifyState = 'pending' | 'success' | 'failed' | 'idle';

const CheckoutCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const verify = useVerifyPayment();
  const qc = useQueryClient();
  const startedRef = useRef(false);

  const [state, setState] = useState<VerifyState>('idle');
  const [message, setMessage] = useState<string>('');
  const [refId, setRefId] = useState<string>('');

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const authority = searchParams.get('Authority') || '';
    const statusParam = searchParams.get('Status') || '';

    // Quick local guard; backend does the authoritative check.
    if (statusParam !== 'OK' || !authority) {
      setState('failed');
      setMessage('پرداخت ناموفق یا لغو شد.');
      return;
    }

    setState('pending');
    verify.mutate(
      { Authority: authority, Status: statusParam },
      {
        onSuccess: (data) => {
          // Invalidate queries so the post-payment UI is fresh.
          qc.invalidateQueries({ queryKey: qk.cart() });
          qc.invalidateQueries({ queryKey: qk.purchases() });
          if (data.success) {
            setState('success');
            setMessage(data.message || 'پرداخت با موفقیت انجام شد.');
            setRefId(data.refId || '');
          } else {
            setState('failed');
            setMessage(data.message || 'تأیید پرداخت ناموفق بود.');
          }
        },
        onError: (err: any) => {
          const detail = err?.response?.data?.message || err?.response?.data?.detail || 'خطا در ارتباط با سرور.';
          setState('failed');
          setMessage(detail);
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-md mx-auto text-center py-12 px-4">
      {state === 'pending' && (
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="animate-spin text-blue-600" />
          <h1 className="text-xl font-bold text-slate-800">در حال تأیید پرداخت…</h1>
          <p className="text-sm text-slate-500">لطفاً صبر کنید. اتصال به درگاه بانکی.</p>
        </div>
      )}

      {state === 'success' && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">پرداخت موفق بود</h1>
          <p className="text-slate-600">{message}</p>
          {refId && (
            <p className="text-xs text-slate-400">کد پیگیری: <span className="font-mono">{refId}</span></p>
          )}
          <div className="flex gap-3 mt-4 w-full">
            <button
              onClick={() => qc.invalidateQueries({ queryKey: qk.purchases() }) || navigate('/purchases')}
              className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              مشاهده خریدهای من
            </button>
            <Link
              to="/"
              className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors"
            >
              بازگشت به خانه
            </Link>
          </div>
        </div>
      )}

      {state === 'failed' && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
            <XCircle size={48} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">پرداخت ناموفق</h1>
          <p className="text-slate-600">{message}</p>
          <div className="flex gap-3 mt-4 w-full">
            <Link
              to="/cart"
              className="flex-1 bg-amber-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-amber-600 transition-colors"
            >
              <ShoppingCart size={20} /> بازگشت به سبد خرید
            </Link>
            <Link
              to="/"
              className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors"
            >
              بازگشت به خانه
            </Link>
          </div>
        </div>
      )}

      {state === 'idle' && (
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="animate-spin text-slate-400" />
          <p className="text-sm text-slate-500">در انتظار…</p>
        </div>
      )}
    </div>
  );
};

export default CheckoutCallbackPage;

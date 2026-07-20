import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMe, useUpdateProfile } from '../src/api/auth';
import { Save, User as UserIcon, Lock, AlertCircle, Camera, X, ZoomIn, Check, Eye, User } from 'lucide-react';

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const { data: user, isLoading: userLoading } = useMe();
  const updateProfile = useUpdateProfile();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Image Cropping State
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatarUrl(user.avatarUrl);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('نام نمی‌تواند خالی باشد');
      return;
    }
    setIsLoading(true);
    setError('');

    updateProfile.mutate(
      { name: name.trim(), avatar: avatarUrl },
      {
        onSuccess: () => {
          setIsLoading(false);
          navigate('/profile');
        },
        onError: (err) => {
          setIsLoading(false);
          setError(err.message || 'خطا در بروزرسانی پروفایل');
        },
      }
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setTempImageSrc(reader.result as string);
        setShowCropModal(true);
        setZoom(1);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = () => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = imageRef.current;

    if (!ctx) return;

    const size = 300;
    canvas.width = size;
    canvas.height = size;

    const scale = zoom;
    const scaledWidth = image.naturalWidth * scale;
    const scaledHeight = image.naturalHeight * scale;

    const centerParams = {
      x: (size - scaledWidth) / 2,
      y: (size - scaledHeight) / 2,
    };

    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(image, centerParams.x, centerParams.y, scaledWidth, scaledHeight);

    const croppedDataUrl = canvas.toDataURL('image/jpeg');
    setAvatarUrl(croppedDataUrl);
    setShowCropModal(false);
    setTempImageSrc(null);
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">ورود کنید</h2>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto relative">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">ویرایش پروفایل</h1>
      <p className="text-slate-500 mb-8">اطلاعات شخصی خود را بروزرسانی کنید.</p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        {/* Avatar Preview */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <img src={avatarUrl} alt="Preview" className="w-28 h-28 rounded-full object-cover border-4 border-slate-100 mb-4 group-hover:border-blue-200 transition-colors" />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity mb-4">
              <Camera className="text-white" />
            </div>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-sm text-blue-600 font-bold hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
          >
            تغییر تصویر پروفایل
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <UserIcon size={16} />
            نام و نام خانوادگی
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 relative group">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              دانشگاه
              <Lock size={14} className="text-slate-400" />
            </label>
            <input
              type="text"
              value={user.university || 'تعیین نشده'}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
            />
            <div className="absolute top-full left-0 right-0 hidden group-hover:block z-10 p-2">
              <div className="bg-slate-800 text-white text-xs p-2 rounded-lg shadow-lg flex items-center gap-2">
                <AlertCircle size={14} />
                تغییر دانشگاه نیازمند تایید مجدد است.
              </div>
            </div>
          </div>
          <div className="space-y-2 relative group">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              رشته تحصیلی
              <Lock size={14} className="text-slate-400" />
            </label>
            <input
              type="text"
              value={user.fieldOfStudy || 'تعیین نشده'}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
            />
            <div className="absolute top-full left-0 right-0 hidden group-hover:block z-10 p-2">
              <div className="bg-slate-800 text-white text-xs p-2 rounded-lg shadow-lg flex items-center gap-2">
                <AlertCircle size={14} />
                تغییر رشته نیازمند مکاتبات با آموزش است.
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">بیوگرافی (اختیاری)</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="کمی درباره خودتان بنویسید..."
          />
        </div>

        <div className="pt-4 flex gap-4">
          <button
            type="submit"
            disabled={isLoading || updateProfile.isPending}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-50"
          >
            {isLoading || updateProfile.isPending ? 'در حال ذخیره...' : (
              <>
                <Save size={18} />
                ذخیره تغییرات
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
          >
            انصراف
          </button>
        </div>
      </form>

      {/* Crop Modal */}
      {showCropModal && tempImageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">برش تصویر</h3>
              <button onClick={() => setShowCropModal(false)} className="text-slate-500 hover:text-red-500">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 flex flex-col items-center">
              <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-blue-500 shadow-xl mb-6 bg-slate-100">
                <img
                  ref={imageRef}
                  src={tempImageSrc}
                  alt="Crop target"
                  className="absolute max-w-none origin-center transition-transform duration-100"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) scale(${zoom})`,
                  }}
                />
              </div>

              <div className="w-full flex items-center gap-4 mb-2">
                <ZoomIn size={20} className="text-slate-400" />
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button
                onClick={handleCropComplete}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Check size={18} />
                اعمال تصویر
              </button>
              <button
                onClick={() => setShowCropModal(false)}
                className="px-6 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50"
              >
                انصراف
              </button>
            </div>
          </div>
          {/* Hidden Canvas for Processing */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
};

export default ProfileEditPage;
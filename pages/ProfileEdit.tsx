
import React, { useState, useRef, useEffect } from 'react';
import { CURRENT_USER } from '../constants';
import { Save, User as UserIcon, Lock, AlertCircle, Camera, X, ZoomIn, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileEditPage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState(CURRENT_USER.name);
    const [avatarUrl, setAvatarUrl] = useState(CURRENT_USER.avatarUrl);
    const [isLoading, setIsLoading] = useState(false);
    
    // Image Cropping State
    const [showCropModal, setShowCropModal] = useState(false);
    const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API update
        setTimeout(() => {
            setIsLoading(false);
            navigate('/profile');
        }, 1500);
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

        // Calculate the crop area based on zoom
        // We assume a square crop centered on the image
        const size = 300; // Output size
        canvas.width = size;
        canvas.height = size;

        const scale = zoom;
        const scaledWidth = image.naturalWidth * scale;
        const scaledHeight = image.naturalHeight * scale;

        const offsetX = (scaledWidth - size) / 2;
        const offsetY = (scaledHeight - size) / 2;

        ctx.clearRect(0, 0, size, size);
        
        // Draw the image centered and scaled
        // drawImage(image, sourceX, sourceY, sourceW, sourceH, destX, destY, destW, destH)
        // A simpler approach for the "Zoom from center" effect without complex panning logic for this demo:
        // We draw the image at a negative offset based on zoom
        
        const centerParams = {
            x: (size - scaledWidth) / 2,
            y: (size - scaledHeight) / 2
        };

        ctx.drawImage(image, centerParams.x, centerParams.y, scaledWidth, scaledHeight);

        const croppedDataUrl = canvas.toDataURL('image/jpeg');
        setAvatarUrl(croppedDataUrl);
        setShowCropModal(false);
        setTempImageSrc(null);
    };

    return (
        <div className="max-w-2xl mx-auto relative">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">ویرایش پروفایل</h1>
            <p className="text-slate-500 mb-8">اطلاعات شخصی خود را بروزرسانی کنید.</p>

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
                            value={CURRENT_USER.university || 'تعیین نشده'}
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
                            value={CURRENT_USER.fieldOfStudy || 'تعیین نشده'}
                            disabled
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                        />
                         <div className="absolute top-full left-0 right-0 hidden group-hover:block z-10 p-2">
                            <div className="bg-slate-800 text-white text-xs p-2 rounded-lg shadow-lg flex items-center gap-2">
                                <AlertCircle size={14} />
                                تغییر رشته نیازمند مکاتبه با آموزش است.
                            </div>
                         </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">بیوگرافی (اختیاری)</label>
                    <textarea 
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="کمی درباره خودتان بنویسید..."
                    />
                </div>

                <div className="pt-4 flex gap-4">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                    >
                        {isLoading ? 'در حال ذخیره...' : (
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
                                        transform: `translate(-50%, -50%) scale(${zoom})` 
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

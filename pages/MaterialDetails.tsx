import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMaterial, useComments } from '../src/api/hooks/materials';
import { useMaterialSummary, useMaterialQuiz } from '../src/api/hooks/ai';
import { useRateMaterial, useToggleLike, useTrackView, useAddComment } from '../src/api/hooks/mutations';
import { useTeacher, useField, useCourse, useUniversity } from '../src/api/hooks/directory';
import { useAddToCart, usePreview, useValidate } from '../src/api/hooks/cart';
import { useToggleLibrary } from '../src/api/hooks/library';
import { UserRole, type Comment as AppComment } from '../types';
import { formatJalali } from '../src/utils/date';
import {
  Download, Share2, Star, Eye, MessageCircle, Sparkles, FileText, BrainCircuit, ThumbsUp, Check, BadgeCheck,
  Layers, GraduationCap, BookOpen, Building2, ShoppingCart, Lock, ShieldCheck, X, CheckCircle2, XCircle, Loader2, AlertCircle, Bookmark,
} from 'lucide-react';
import MaterialTypeBadge from '../components/MaterialTypeBadge';
import EntityBreadcrumb from '../components/EntityBreadcrumb';

const MaterialDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: material, isLoading: materialLoading, isError: materialError } = useMaterial(id || '');
  const { data: comments = [], isLoading: commentsLoading } = useComments(id || '');
  const { data: teacher } = useTeacher(material?.teacherId || '');
  const { data: field } = useField(material?.fieldId || '');
  const { data: course } = useCourse(material?.courseId || '');
  const { data: university } = useUniversity(material?.universityId || '');

  const [aiSummary, setAiSummary] = React.useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = React.useState(false);
  const [aiQuiz, setAiQuiz] = React.useState<string[] | null>(null);
  const [loadingQuiz, setLoadingQuiz] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);
  const [userRating, setUserRating] = React.useState(0);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [commentText, setCommentText] = React.useState('');

  const { mutate: generateSummary, isPending: summaryPending } = useMaterialSummary(id || '');
  const { mutate: generateQuiz, isPending: quizPending } = useMaterialQuiz(id || '');
  const { mutate: rateMaterial, isPending: ratingPending } = useRateMaterial(id || '');
  const { mutate: toggleLike, isPending: likePending } = useToggleLike(id || '');
  const { mutate: trackView } = useTrackView(id || '');
  const { mutate: addComment, isPending: commentPending } = useAddComment(id || '');
  const addToCart = useAddToCart();
  const [showPreview, setShowPreview] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const preview = usePreview(id || '');
  const validate = useValidate(id || '');
  const toggleLibrary = useToggleLibrary();

  const [inLibrary, setInLibrary] = useState(!!material?.inLibrary);
  const [hasValidated, setHasValidated] = useState(!!material?.hasValidated);
  useEffect(() => {
    setInLibrary(!!material?.inLibrary);
  }, [material?.inLibrary]);
  useEffect(() => {
    setHasValidated(!!material?.hasValidated);
  }, [material?.hasValidated]);

  const handleShowPreview = () => {
    setShowPreview(true);
  };

  const handleValidate = (isValid: boolean) => {
    setValidationError(null);
    validate.mutate({ isValid }, {
      onSuccess: () => {
        // Only positive validations unlock the "Add to cart" gate.
        // Negative validations are recorded but do NOT grant purchase rights.
        if (isValid) setHasValidated(true);
      },
      onError: (err: any) => {
        const detail = err?.response?.data?.detail || 'خطا در ثبت ارزیابی';
        setValidationError(detail);
      },
    });
  };

  const handleAddToCart = () => {
    addToCart.mutate({ materialId: material?.id || '' });
  };

  // Track view on mount (once)
  useEffect(() => {
    if (material && !materialLoading) {
      trackView();
    }
  }, [material, materialLoading]);

  // Handle AI summary generation
  const handleGenerateSummary = () => {
    setLoadingSummary(true);
    generateSummary(undefined, {
      onSuccess: (summary) => {
        setAiSummary(summary);
        setLoadingSummary(false);
      },
      onError: () => {
        setLoadingSummary(false);
      },
    });
  };

  // Handle AI quiz generation
  const handleGenerateQuiz = () => {
    setLoadingQuiz(true);
    generateQuiz(undefined, {
      onSuccess: (questions) => {
        setAiQuiz(questions);
        setLoadingQuiz(false);
      },
      onError: () => {
        setLoadingQuiz(false);
      },
    });
  };

  // Handle rating
  const handleRate = (rating: number) => {
    setUserRating(rating);
    rateMaterial(rating);
  };

  // Handle like
  const handleLike = () => {
    toggleLike();
  };

  // Handle share
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Handle library toggle
  const handleToggleLibrary = () => {
    toggleLibrary.mutate(material!.id, {
      onSuccess: (data) => {
        setInLibrary(data.inLibrary);
      },
    });
  };

  // Handle comment submission
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(commentText, {
      onSuccess: () => {
        setCommentText('');
      },
    });
  };

  if (materialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (materialError || !material) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-gray-100">منبع مورد نظر یافت نشد.</h2>
        <Link to="/browse" className="text-blue-600 dark:text-blue-400 hover:underline mt-4 inline-block">بازگشت به کاوش</Link>
      </div>
    );
  }

  const isVerifiedUploader = material.uploader.role === UserRole.INSTRUCTOR;

  return (
    <div className="space-y-6">
      <EntityBreadcrumb
        items={[
          ...(field ? [{ label: field.name, to: `/field/${field.id}` }] : []),
          ...(teacher ? [{ label: teacher.name, to: `/teacher/${teacher.id}` }] : []),
          ...(course ? [{ label: course.title, to: `/course/${course.id}` }] : []),
          { label: material.title },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Info */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <MaterialTypeBadge type={material.materialType} size="md" />
                  {course && (
                    <Link to={`/course/${course.id}`} className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-bold hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors">
                      {course.title}
                    </Link>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{material.title}</h1>
              </div>
              <button onClick={handleShare} className={`p-2 transition-all rounded-full ${isCopied ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-gray-700'}`} title="اشتراک گذاری لینک">
                {isCopied ? <Check size={24} /> : <Share2 size={24} />}
              </button>
              <button
                onClick={handleToggleLibrary}
                disabled={toggleLibrary.isPending}
                className={`p-2 transition-all rounded-full ${inLibrary ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-gray-700'}`}
                title={inLibrary ? 'حذف از کتابخانه' : 'افزودن به کتابخانه'}
              >
                <Bookmark size={24} fill={inLibrary ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-gray-500 mb-6">
              <Link to={`/profile/${material.uploader.id}`} className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <img src={material.uploader.avatarUrl} alt="" className="w-6 h-6 rounded-full" />
                <span className="font-bold">{material.uploader.name}</span>
                {isVerifiedUploader && <BadgeCheck size={15} className="text-blue-600 dark:text-blue-400 fill-blue-100" />}
              </Link>
              <div className="flex items-center gap-1">
                <Star size={16} className="text-amber-500 dark:text-amber-400 fill-amber-500" />
                <span className="font-bold text-slate-800 dark:text-gray-200">{material.rating || '—'}</span>
              </div>
              <div className="flex items-center gap-1"><Eye size={16} /><span>{material.views} بازدید</span></div>
              <div className="flex items-center gap-1"><ThumbsUp size={16} /><span>{material.likes} لایک</span></div>
              <div>{formatJalali(material.createdAt)}</div>
            </div>

            {/* Directory metadata row */}
            <div className="flex flex-wrap gap-2 mb-6">
              {field && (
                <Link to={`/field/${field.id}`} className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-800/30 transition-colors">
                  <Layers size={14} /> {field.name}
                </Link>
              )}
              {teacher && (
                <Link to={`/teacher/${teacher.id}`} className="flex items-center gap-1 bg-slate-50 dark:bg-gray-800/50 text-slate-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <GraduationCap size={14} /> {teacher.name}
                  {teacher.isVerified && <BadgeCheck size={13} className="text-blue-600 dark:text-blue-400 fill-blue-100" />}
                </Link>
              )}
              {course && (
                <Link to={`/course/${course.id}`} className="flex items-center gap-1 bg-slate-50 dark:bg-gray-800/50 text-slate-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <BookOpen size={14} /> {course.title}
                </Link>
              )}
              {university && (
                <Link to={`/university/${university.id}`} className="flex items-center gap-1 bg-slate-50 dark:bg-gray-800/50 text-slate-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Building2 size={14} /> {university.name}
                </Link>
              )}
            </div>

            {/* Download / Premium flow */}
            {material.isPremium && !material.hasPurchased ? (
              <div className="space-y-4">
                {/* Price tag */}
                <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/30 rounded-xl px-4 py-3 border border-amber-100 dark:border-amber-800/50">
                  <span className="text-amber-800 dark:text-amber-300 text-sm font-medium">قیمت این جزوه:</span>
                  <span className="text-xl font-bold text-amber-700 dark:text-amber-300">
                    {material.priceTomans?.toLocaleString('fa-IR')} تومان
                  </span>
                </div>

                {/* Validation status indicator */}
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-500">
                  <ShieldCheck size={14} className={material.isPremiumActive || hasValidated ? 'text-emerald-500 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400'} />
                  <span>
                    {material.isPremiumActive
                      ? 'این جزوه توسط کاربران تأیید شده است و قابل خریداری است.'
                      : hasValidated
                        ? 'شما این جزوه را تأیید کرده‌اید — اکنون می‌توانید آن را به سبد خرید اضافه کنید.'
                        : `این جزوه پس از ${Math.max(0, 3 - (material.validationsCount || 0))} تأیید کاربران قابل خرید می‌شود. برای کمک به تأیید، پیش‌نمایش را ببینید.`}
                  </span>
                </div>

                {/* If material is not yet active: show preview→validate flow */}
                {!material.isPremiumActive && !showPreview && (
                  <button
                    onClick={handleShowPreview}
                    className="w-full bg-slate-800 dark:bg-gray-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-900 dark:hover:bg-gray-900 transition-colors"
                  >
                    <Eye size={20} /> نمایش پیش‌نمایش
                  </button>
                )}

                {/* Preview panel + validate question */}
                {showPreview && (
                  <div className="space-y-3 bg-slate-50 dark:bg-gray-800/50 rounded-xl p-4 border border-slate-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-800 dark:text-gray-100 text-sm">پیش‌نمایش جزوه</h4>
                      <button onClick={() => setShowPreview(false)} className="text-slate-400 dark:text-gray-500 hover:text-red-500 dark:hover:red-400 p-1">
                        <X size={18} />
                      </button>
                    </div>
                    {preview.isLoading && (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 size={24} className="animate-spin text-slate-500 dark:text-gray-500" />
                      </div>
                    )}
                    {preview.error && (
                      <div className="flex items-center justify-center gap-2 py-8 text-red-500 dark:text-red-400 text-sm">
                        <AlertCircle size={20} />
                        خطا در دریافت پیش‌نمایش
                      </div>
                    )}
                    {preview.data?.previewUrl && (
                      <iframe
                        src={preview.data.previewUrl}
                        className="w-full h-[500px] bg-white dark:bg-gray-900 rounded-lg border border-slate-200 dark:border-gray-700"
                        title="پیش‌نمایش جزوه"
                      />
                    )}

                    {/* Validation question */}
                    {!hasValidated ? (
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-slate-200 dark:border-gray-700">
                        <p className="text-sm text-slate-700 dark:text-gray-300 mb-3 text-center">
                          آیا محتوای این پیش‌نمایش با عنوان و توضیحات جزوه مطابقت دارد؟
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleValidate(true)}
                            disabled={validate.isPending}
                            className="flex-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-emerald-100 dark:hover:bg-emerald-800/30 transition-colors disabled:opacity-50"
                          >
                            <CheckCircle2 size={18} /> بله، معتبر است
                          </button>
                          <button
                            onClick={() => handleValidate(false)}
                            disabled={validate.isPending}
                            className="flex-1 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-800/30 transition-colors disabled:opacity-50"
                          >
                            <XCircle size={18} /> خیر، نامعتبر است
                          </button>
                        </div>
                        {validate.isPending && (
                          <p className="text-center text-xs text-slate-500 dark:text-gray-500 mt-2">در حال ثبت ارزیابی...</p>
                        )}
                        {validationError && (
                          <p className="text-center text-xs text-red-500 dark:text-red-400 mt-2">{validationError}</p>
                        )}
                      </div>
                    ) : (
                      <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg p-3 text-sm text-center flex items-center justify-center gap-2">
                        <CheckCircle2 size={18} />
                        با تشکر از ارزیابی شما! نظرات شما به کیفیت پلتفرم کمک می‌کند.
                      </div>
                    )}
                  </div>
                )}

                {/* Add to cart — enabled once material is active OR user has validated */}
                <button
                  onClick={handleAddToCart}
                  disabled={addToCart.isPending || (!material.isPremiumActive && !hasValidated)}
                  className="w-full bg-amber-500 dark:bg-amber-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-amber-600 dark:hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title={!material.isPremiumActive && !hasValidated ? 'این جزوه هنوز قابل خرید نیست — ابتدا پیش‌نمایش را تأیید کنید' : 'افزودن به سبد خرید'}
                >
                  {addToCart.isPending ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <ShoppingCart size={20} />
                  )}
                  {addToCart.isPending
                    ? 'در حال افزودن...'
                    : material.isPremiumActive || hasValidated
                      ? 'افزودن به سبد خرید'
                      : 'فعلاً قابل خرید نیست'}
                </button>
                {addToCart.error && (
                  <p className="text-red-500 dark:text-red-400 text-sm text-center">
                    {(addToCart.error as any)?.response?.data?.detail || 'خطا در افزودن به سبد خرید'}
                  </p>
                )}
                {addToCart.isSuccess && (
                  <p className="text-emerald-600 dark:text-emerald-400 text-sm text-center flex items-center justify-center gap-1">
                    <CheckCircle2 size={16} /> به سبد خرید اضافه شد!
                  </p>
                )}
              </div>
            ) : material.isPremium && material.hasPurchased ? (
              <a href={material.fileUrl} target="_blank" rel="noopener noreferrer" className="flex-1 bg-emerald-600 dark:bg-emerald-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-700 dark:hover:bg-emerald-800 transition-colors">
                <Download size={20} /> دانلود (خریداری شده)
              </a>
            ) : (
              <a href={material.fileUrl} target="_blank" rel="noopener noreferrer" className="flex-1 bg-blue-600 dark:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors">
                <Download size={20} /> دانلود فایل کامل
              </a>
            )}

            {/* Rating button (always available) */}
            <button onClick={() => document.getElementById('rating-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex-1 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors">
              <Star size={20} className="text-amber-500 dark:text-amber-400 mr-2" /> امتیازدهی
            </button>
          </div>

          {/* Description & Preview */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">توضیحات</h2>
            <p className="text-slate-500 dark:text-gray-500 text-base line-clamp-4 mb-6">{material.description}</p>

            {material.description.length > 200 && (
              <div className="flex justify-end">
                <button onClick={() => alert('فعلا فقط متن کامل نمایش داده می‌شود.')} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  بیشتر...
                </button>
              </div>
            )}

            {/* AI Summary */}
            <div className="mt-6">
              <button
                onClick={handleGenerateSummary}
                disabled={summaryPending}
                className="flex w-full items-center justify-between px-4 py-3 bg-slate-50 dark:bg-gray-800/50 rounded-xl border border-slate-200 dark:border-gray-700 text-left font-medium text-slate-800 dark:text-gray-200 transition-colors hover:bg-slate-100 dark:hover:bg-gray-700/30 disabled:opacity-50"
              >
                <span>خلاصه هوش مصنوعی</span>
                {summaryPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <sparkles size={16} />}
              </button>
              {aiSummary && (
                <div className="mt-4 p-4 bg-slate-50 dark:bg-gray-800/30 rounded-xl border border-slate-200 dark:border-gray-700">
                  <p className="text-slate-700 dark:text-gray-400">{aiSummary}</p>
                </div>
              )}
            </div>

            {/* AI Quiz */}
            <div className="mt-6">
              <button
                onClick={handleGenerateQuiz}
                disabled={quizPending}
                className="flex w-full items-center justify-between px-4 py-3 bg-slate-50 dark:bg-gray-800/50 rounded-xl border border-slate-200 dark:border-gray-700 text-left font-medium text-slate-800 dark:text-gray-200 transition-colors hover:bg-slate-100 dark:hover:bg-gray-700/30 disabled:opacity-50"
              >
                <span>تولید سوالات تمرینی</span>
                {quizPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles size={16} />}
              </button>
              {aiQuiz && (
                <div className="mt-4 p-4 bg-slate-50 dark:bg-gray-800/30 rounded-xl border border-slate-200 dark:border-gray-700 space-y-2">
                  <p className="font-medium text-slate-800 dark:text-gray-200 mb-2">5 سؤالolé تولید شده:</p>
                  {aiQuiz.map((q, i) => (
                    <p key={i} className="text-slate-700 dark:text-gray-400 pl-4">{i + 1}. {q}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Rating Section */}
          <section id="rating-section" className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">امتیازدهی به این منبع</h2>
            <div className="flex items-center justify-center mb-6 space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className={`p-2 rounded-full transition-all ${star <= userRating ? 'text-amber-500 dark:text-amber-400' : star <= hoverRating ? 'text-amber-300 dark:text-amber-400/50' : 'text-slate-300 dark:text-gray-500/50'}`}
                >
                  <Star size={24} />
                </button>
              ))}
            </div>
            <p className="text-center text-slate-500 dark:text-gray-500 text-sm">
              평균 rating: <span className="font-bold text-amber-500 dark:text-amber-400">{material.rating?.toFixed(1) || '0.0'}</span> ({material.ratingCount || 0} رأی)
            </p>
          </section>

          {/* Comments */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">نظرات ({comments.length})</h2>

            {commentsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : comments.length === 0 ? (
              <p className="text-center text-slate-500 dark:text-gray-500 py-8">هنوز نظری ثبت نشده است. اولین نفر باشید!</p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-gray-800/30 rounded-xl border border-slate-200 dark:border-gray-700">
                    <div className="flex-shrink-0">
                      <img src={comment.user.avatarUrl} alt="" className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-slate-800 dark:text-gray-200">{comment.user.name}</div>
                          <div className="flex items-center gap-1 text-sm">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} size={12} className={star <= comment.rating ? 'text-amber-500 dark:text-amber-400' : 'text-slate-300 dark:text-gray-500/50'} />
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-slate-400 dark:text-gray-500">{new Date(comment.createdAt).toLocaleDateString('fa-IR')}</div>
                      </div>
                      <p className="text-slate-700 dark:text-gray-400 leading-relaxed">{comment.text}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <button className="flex items-center gap-1 text-slate-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">
                          <ThumbsUp size={14} /> {comment.likes || 0}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmitComment} className="relative mt-4">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="نظر خود را بنویسید..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-gray-800/30 rounded-xl border border-slate-200 dark:border-gray-700 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-sm disabled:opacity-50"
                disabled={commentPending}
              />
              <button type="submit" disabled={commentPending || !commentText.trim()} className="absolute left-2 top-1/2 -translate-y/2 -translate-y-1/2 text-blue-600 dark:text-blue-400 p-1 disabled:opacity-50">
                <Share2 size={16} className="rotate-180" />
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* AI Features */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">ویژگی‌های هوش مصنوعی</h3>
            <div className="space-y-3">
              <button
                onClick={handleGenerateSummary}
                disabled={summaryPending}
                className="w-full text-left px-4 py-3 bg-slate-50 dark:bg-gray-800/30 rounded-lg border border-slate-200 dark:border-gray-700 text-slate-800 dark:text-gray-200 font-medium transition-colors hover:bg-slate-100 dark:hover:bg-gray-700/30 disabled:opacity-50 flex items-center justify-between"
              >
                <span>خلاصه هوش مصنوعی</span>
                {summaryPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles size={16} />}
              </button>
              <button
                onClick={handleGenerateQuiz}
                disabled={quizPending}
                className="w-full text-left px-4 py-3 bg-slate-50 dark:bg-gray-800/30 rounded-lg border border-slate-200 dark:border-gray-700 text-slate-800 dark:text-gray-200 font-medium transition-colors hover:bg-slate-100 dark:hover:bg-gray-700/30 disabled:opacity-50 flex items-center justify-between"
              >
                <span>تولید تست تمرینی</span>
                {quizPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles size={16} />}
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">عملیات سریع</h3>
            <div className="space-y-3">
              <button
                onClick={handleLike}
                disabled={likePending}
                className={`w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-gray-800/30 rounded-lg border border-slate-200 dark:border-gray-700 text-left font-medium transition-colors hover:bg-slate-100 dark:hover:bg-gray-700/30 disabled:opacity-50 ${material.likes > 0 ? 'text-red-500 dark:text-red-400' : 'text-slate-800 dark:text-gray-200'}`}
              >
                <span>لایک</span>
                <div className="flex items-center gap-2">
                  {likePending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsUp size={16} />}
                  <span className="font-medium">{material.likes}</span>
                </div>
              </button>
              <button
                onClick={handleToggleLibrary}
                disabled={toggleLibrary.isPending}
                className={`w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-gray-800/30 rounded-lg border border-slate-200 dark:border-gray-700 text-left font-medium transition-colors hover:bg-slate-100 dark:hover:bg-gray-700/30 disabled:opacity-50 ${inLibrary ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-gray-200'}`}
              >
                <span>كتابخانه</span>
                <div className="flex items-center gap-2">
                  {toggleLibrary.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bookmark size={16} />}
                  <span className="font-medium">{inLibrary ? 'در کتابخانه' : 'افزودن'}</span>
                </div>
              </button>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">آمار</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>امتیاز متوسط</span>
                <span className="font-bold text-amber-500 dark:text-amber-400">{material.rating?.toFixed(1) || '0.0'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>تعداد ارزیابی‌ها</span>
                <span className="font-bold text-slate-800 dark:text-gray-200">{material.ratingCount || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>بازدیدها</span>
                <span className="font-bold text-slate-800 dark:text-gray-200">{material.views}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>لایک‌ها</span>
                <span className="font-bold text-slate-800 dark:text-gray-200">{material.likes}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>تأییدات</span>
                <span className="font-bold text-slate-800 dark:text-gray-200">{material.validationsCount || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialDetailsPage;
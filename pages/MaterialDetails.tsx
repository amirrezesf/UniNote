import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMaterialById, getTeacherById, getFieldById, getCourseById, getUniversityById } from '../constants';
import { generateNoteSummary, generateSampleQuestions } from '../services/geminiService';
import { UserRole } from '../types';
import {
  Download, Share2, Star, Eye, MessageCircle, Sparkles, FileText, BrainCircuit, ThumbsUp, Check, BadgeCheck,
  Layers, GraduationCap, BookOpen, Building2, ChevronLeft,
} from 'lucide-react';
import MaterialTypeBadge from '../components/MaterialTypeBadge';
import EntityBreadcrumb from '../components/EntityBreadcrumb';

const MaterialDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const material = getMaterialById(id);

  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [aiQuiz, setAiQuiz] = useState<string[] | null>(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  if (!material) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">منبع مورد نظر یافت نشد.</h2>
        <Link to="/browse" className="text-blue-600 hover:underline mt-4 inline-block">بازگشت به کاوش</Link>
      </div>
    );
  }

  const teacher = getTeacherById(material.teacherId);
  const field = getFieldById(material.fieldId);
  const course = getCourseById(material.courseId);
  const university = getUniversityById(material.universityId);
  const isVerifiedUploader = material.uploader.role === UserRole.INSTRUCTOR;

  const handleGenerateSummary = async () => {
    setLoadingSummary(true);
    setAiSummary(await generateNoteSummary(material.title, material.description));
    setLoadingSummary(false);
  };

  const handleGenerateQuiz = async () => {
    setLoadingQuiz(true);
    setAiQuiz(await generateSampleQuestions(material.title));
    setLoadingQuiz(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

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
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <MaterialTypeBadge type={material.materialType} size="md" />
                  {course && (
                    <Link to={`/course/${course.id}`} className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors">
                      {course.title}
                    </Link>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-slate-900">{material.title}</h1>
              </div>
              <button onClick={handleShare} className={`p-2 transition-all rounded-full ${isCopied ? 'bg-green-100 text-green-600' : 'text-slate-400 hover:text-blue-600 hover:bg-slate-50'}`} title="اشتراک گذاری لینک">
                {isCopied ? <Check size={24} /> : <Share2 size={24} />}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 mb-6">
              <Link to={`/profile/${material.uploader.id}`} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <img src={material.uploader.avatarUrl} alt="" className="w-6 h-6 rounded-full" />
                <span className="font-bold">{material.uploader.name}</span>
                {isVerifiedUploader && <BadgeCheck size={15} className="text-blue-600 fill-blue-100" />}
              </Link>
              <div className="flex items-center gap-1">
                <Star size={16} className="text-amber-500 fill-amber-500" />
                <span className="font-bold text-slate-800">{material.rating || '—'}</span>
              </div>
              <div className="flex items-center gap-1"><Eye size={16} /><span>{material.views} بازدید</span></div>
              <div>{material.createdAt}</div>
            </div>

            {/* Directory metadata row */}
            <div className="flex flex-wrap gap-2 mb-6">
              {field && (
                <Link to={`/field/${field.id}`} className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
                  <Layers size={14} /> {field.name}
                </Link>
              )}
              {teacher && (
                <Link to={`/teacher/${teacher.id}`} className="flex items-center gap-1 bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <GraduationCap size={14} /> {teacher.name}
                  {teacher.isVerified && <BadgeCheck size={13} className="text-blue-600 fill-blue-100" />}
                </Link>
              )}
              {course && (
                <Link to={`/course/${course.id}`} className="flex items-center gap-1 bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <BookOpen size={14} /> {course.title}
                </Link>
              )}
              {university && (
                <Link to={`/university/${university.id}`} className="flex items-center gap-1 bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <Building2 size={14} /> {university.name}
                </Link>
              )}
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                <Download size={20} /> دانلود فایل کامل
              </button>
              <button onClick={() => document.getElementById('rating-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                <Star size={20} /> امتیازدهی
              </button>
            </div>
          </div>

          {/* Preview Mock */}
          <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-lg h-[600px] relative flex flex-col items-center justify-center text-slate-400">
            <FileText size={64} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">پیش‌نمایش سند</p>
            <p className="text-sm opacity-70 mb-8">{material.fileType.toUpperCase()} File Preview</p>
            <button className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm transition-colors">باز کردن در پنجره جدید</button>
          </div>

          {/* AI Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-4 text-indigo-800 font-bold"><Sparkles size={20} /><h3>خلاصه هوشمند</h3></div>
              {aiSummary ? (
                <p className="text-sm text-indigo-900 leading-relaxed text-justify animate-in fade-in duration-500">{aiSummary}</p>
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs text-indigo-400 mb-4">تولید خلاصه با استفاده از Gemini AI</p>
                  <button onClick={handleGenerateSummary} disabled={loadingSummary} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50">
                    {loadingSummary ? 'در حال پردازش...' : 'تولید خلاصه'}
                  </button>
                </div>
              )}
            </div>

            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-4 text-emerald-800 font-bold"><BrainCircuit size={20} /><h3>کوئیز ساز</h3></div>
              {aiQuiz ? (
                <ul className="space-y-2 text-sm text-emerald-900">
                  {aiQuiz.map((q, i) => (<li key={i} className="flex gap-2"><span className="font-bold">{i + 1}.</span>{q}</li>))}
                </ul>
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs text-emerald-600 mb-4">طراحی سوالات تستی برای تمرین</p>
                  <button onClick={handleGenerateQuiz} disabled={loadingQuiz} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 transition-colors disabled:opacity-50">
                    {loadingQuiz ? 'در حال طراحی...' : 'طراحی سوال'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 lg:sticky lg:top-4">
          <div id="rating-section" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 text-center">ثبت امتیاز شما</h3>
            <div className="flex justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onClick={() => setUserRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className="transition-transform hover:scale-110 focus:outline-none">
                  <Star size={32} className={`${star <= (hoverRating || userRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} transition-colors`} />
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-slate-500">{userRating > 0 ? `شما امتیاز ${userRating} را ثبت کردید.` : 'برای امتیاز دهی روی ستاره‌ها کلیک کنید'}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><MessageCircle size={20} /> نظرات دانشجویان</h3>
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-3 text-sm">
                  <img src={`https://picsum.photos/seed/u${i}/50`} className="w-8 h-8 rounded-full" alt="" />
                  <div>
                    <div className="bg-slate-50 p-3 rounded-2xl rounded-tr-none">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-700">کاربر مهمان</span>
                        <span className="text-xs text-slate-400">۲ روز پیش</span>
                      </div>
                      <p className="text-slate-600">منبع بسیار مفیدی بود، ممنون از اشتراک‌گذاری.</p>
                    </div>
                    <button className="text-xs text-slate-400 mt-1 mr-2 hover:text-blue-600 flex items-center gap-1"><ThumbsUp size={12} /> مفید بود (۲)</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative">
              <input type="text" placeholder="نظر خود را بنویسید..." className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm" />
              <button className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-600 p-1"><Share2 size={16} className="rotate-180" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialDetailsPage;

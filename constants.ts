
import {
  Material,
  NoteStatus,
  User,
  UserRole,
  LeaderboardEntry,
  University,
  Field,
  Teacher,
  Course,
} from './types';

// ---------------------------------------------------------------------------
// Users (uploaders / contributors)
// ---------------------------------------------------------------------------

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'علی محمدی',
  role: UserRole.STUDENT,
  avatarUrl: 'https://picsum.photos/seed/u1/200',
  points: 1250,
  university: 'دانشگاه تهران',
  fieldOfStudy: 'مهندسی کامپیوتر',
};

const USER_SARA: User = { id: 'u2', name: 'سارا احمدی', role: UserRole.STUDENT, avatarUrl: 'https://picsum.photos/seed/u2/200', points: 450, university: 'دانشگاه تهران', fieldOfStudy: 'مهندسی کامپیوتر' };
const USER_KAMALI: User = { id: 'u3', name: 'دکتر کمالی', role: UserRole.INSTRUCTOR, avatarUrl: 'https://picsum.photos/seed/u3/200', points: 9000, university: 'دانشگاه صنعتی شریف', fieldOfStudy: 'هوش مصنوعی' };
const USER_REZA: User = { id: 'u4', name: 'رضا حسینی', role: UserRole.STUDENT, avatarUrl: 'https://picsum.photos/seed/u4/200', points: 300, university: 'دانشگاه امیرکبیر', fieldOfStudy: 'فیزیک' };
const USER_MOHAMMAD: User = { id: 'u5', name: 'محمد نوری', role: UserRole.STUDENT, avatarUrl: 'https://picsum.photos/seed/u5/200', points: 320, university: 'دانشگاه صنعتی شریف', fieldOfStudy: 'مهندسی برق' };

export const MOCK_USERS: User[] = [CURRENT_USER, USER_SARA, USER_KAMALI, USER_REZA, USER_MOHAMMAD];

// ---------------------------------------------------------------------------
// Directory entities
// ---------------------------------------------------------------------------

export const UNIVERSITIES: University[] = [
  { id: 'uni1', name: 'دانشگاه تهران', city: 'تهران', logoUrl: 'https://picsum.photos/seed/uni1/200' },
  { id: 'uni2', name: 'دانشگاه صنعتی شریف', city: 'تهران', logoUrl: 'https://picsum.photos/seed/uni2/200' },
  { id: 'uni3', name: 'دانشگاه امیرکبیر', city: 'تهران', logoUrl: 'https://picsum.photos/seed/uni3/200' },
];

export const FIELDS: Field[] = [
  { id: 'fld1', name: 'مهندسی کامپیوتر' },
  { id: 'fld2', name: 'ریاضیات' },
  { id: 'fld3', name: 'فیزیک' },
  { id: 'fld4', name: 'مهندسی برق' },
];

export const TEACHERS: Teacher[] = [
  { id: 't1', name: 'دکتر کمالی', universityId: 'uni2', fieldIds: ['fld1'], avatarUrl: 'https://picsum.photos/seed/u3/200', isVerified: true, bio: 'استاد هوش مصنوعی و ساختمان داده‌ها در دانشگاه صنعتی شریف با بیش از ۱۵ سال سابقه تدریس.' },
  { id: 't2', name: 'دکتر رضایی', universityId: 'uni1', fieldIds: ['fld2'], avatarUrl: 'https://picsum.photos/seed/u6/200', isVerified: true, bio: 'استاد ریاضیات دانشگاه تهران، متخصص در آنالیز ریاضی و حسابان.' },
  { id: 't3', name: 'دکتر حسابی', universityId: 'uni3', fieldIds: ['fld3'], avatarUrl: 'https://picsum.photos/seed/u7/200', isVerified: true, bio: 'استاد فیزیک دانشگاه امیرکبیر، پژوهشگر حوزه الکترومغناطیس.' },
  { id: 't4', name: 'دکتر شریفی', universityId: 'uni1', fieldIds: ['fld1', 'fld4'], avatarUrl: 'https://picsum.photos/seed/u8/200', isVerified: false, bio: 'استاد مهندسی نرم‌افزار و مدارهای منطقی در دانشگاه تهران.' },
  { id: 't5', name: 'دکتر موسوی', universityId: 'uni2', fieldIds: ['fld4'], avatarUrl: 'https://picsum.photos/seed/t5/200', isVerified: false, bio: 'استاد مهندسی برق دانشگاه صنعتی شریف، متخصص مدارهای الکتریکی.' },
  { id: 't6', name: 'دکتر کریمی', universityId: 'uni1', fieldIds: ['fld2'], avatarUrl: 'https://picsum.photos/seed/t6/200', isVerified: true, bio: 'استاد ریاضیات کاربردی دانشگاه تهران، متخصص معادلات دیفرانسیل.' },
];

export const COURSES: Course[] = [
  { id: 'crs1', title: 'ساختمان داده‌ها', code: 'CS-202', fieldId: 'fld1', teacherId: 't1', universityId: 'uni2', description: 'آشنایی با انواع ساختمان‌های داده نظیر آرایه، لیست پیوندی، درخت، گراف و الگوریتم‌های مرتب‌سازی و جستجو.' },
  { id: 'crs2', title: 'هوش مصنوعی', code: 'CS-305', fieldId: 'fld1', teacherId: 't1', universityId: 'uni2', description: 'مبانی هوش مصنوعی، عامل‌های هوشمند، روش‌های جستجو، منطق فازی و یادگیری ماشین مقدماتی.' },
  { id: 'crs3', title: 'ریاضی عمومی ۱', code: 'MATH-101', fieldId: 'fld2', teacherId: 't2', universityId: 'uni1', description: 'بررسی مفاهیم پایه ریاضیات شامل حد، پیوستگی، مشتق و انتگرال و کاربردهای آن‌ها.' },
  { id: 'crs4', title: 'معادلات دیفرانسیل', code: 'MATH-203', fieldId: 'fld2', teacherId: 't6', universityId: 'uni1', description: 'حل معادلات دیفرانسیل مرتبه اول و دوم، دستگاه معادلات و تبدیل لاپلاس.' },
  { id: 'crs5', title: 'فیزیک ۲', code: 'PHYS-102', fieldId: 'fld3', teacherId: 't3', universityId: 'uni3', description: 'مباحث الکتریسیته و مغناطیس، میدان‌های الکتریکی، پتانسیل، خازن‌ها و جریان‌های الکتریکی.' },
  { id: 'crs6', title: 'مدارهای منطقی', code: 'EE-204', fieldId: 'fld4', teacherId: 't4', universityId: 'uni1', description: 'طراحی سیستم‌های دیجیتال، جبر بولی، گیت‌های منطقی، مدارهای ترکیبی و ترتیبی.' },
  { id: 'crs7', title: 'مدارهای الکتریکی', code: 'EE-210', fieldId: 'fld4', teacherId: 't5', universityId: 'uni2', description: 'قوانین کیرشهف، تحلیل مدارهای مقاومتی، خازن و سلف و پاسخ گذرا.' },
  { id: 'crs8', title: 'مهندسی نرم‌افزار', code: 'CS-401', fieldId: 'fld1', teacherId: 't4', universityId: 'uni1', description: 'فرآیندهای تولید نرم‌افزار، تحلیل و طراحی شیءگرا، الگوهای طراحی و مدیریت پروژه.' },
];

// ---------------------------------------------------------------------------
// Materials — the shared unit (formerly "Note")
// ---------------------------------------------------------------------------

const mat = (m: Omit<Material, 'visibility'>): Material => ({ ...m, visibility: 'PUBLIC' });

export const MATERIALS: Material[] = [
  // Teacher t1 (کمالی) — course crs1, uploaded by MULTIPLE students (aggregation demo)
  mat({ id: 'm1', title: 'جزوه کامل ساختمان داده‌ها', description: 'خلاصه‌نویسی دقیق کلاس دکتر کمالی، شامل درخت‌ها، گراف و پیچیدگی الگوریتم‌ها.', materialType: 'HANDOUT', uploader: USER_SARA, fieldId: 'fld1', courseId: 'crs1', teacherId: 't1', universityId: 'uni2', term: 'پاییز ۱۴۰۲', fileType: 'pdf', fileUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/ds1/400/300', status: NoteStatus.PUBLISHED, likes: 120, views: 1500, rating: 4.8, createdAt: '۱۴۰۲/۰۸/۱۵', tags: ['ساختمان داده', 'درخت', 'گراف'] }),
  mat({ id: 'm2', title: 'نمونه سوالات پایان‌ترم ساختمان داده', description: 'مجموعه سوالات امتحانی سه ترم اخیر دکتر کمالی همراه با پاسخ تشریحی.', materialType: 'EXAM', uploader: USER_REZA, fieldId: 'fld1', courseId: 'crs1', teacherId: 't1', universityId: 'uni2', term: 'پاییز ۱۴۰۲', fileType: 'pdf', fileUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/ds2/400/300', status: NoteStatus.PUBLISHED, likes: 95, views: 1120, rating: 4.6, createdAt: '۱۴۰۲/۱۰/۰۵', tags: ['نمونه سوال', 'امتحان'] }),
  mat({ id: 'm3', title: 'یادداشت‌های کلاسی مرتب‌سازی', description: 'خلاصه جلسات مربوط به الگوریتم‌های مرتب‌سازی.', materialType: 'NOTE', uploader: CURRENT_USER, fieldId: 'fld1', courseId: 'crs1', teacherId: 't1', universityId: 'uni2', term: 'پاییز ۱۴۰۲', fileType: 'docx', fileUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/ds3/400/300', status: NoteStatus.PUBLISHED, likes: 40, views: 380, rating: 4.1, createdAt: '۱۴۰۲/۰۹/۱۰', tags: ['مرتب‌سازی', 'یادداشت'] }),

  // Teacher t1 (کمالی) — course crs2
  mat({ id: 'm4', title: 'اسلایدهای درس هوش مصنوعی', description: 'نسخه کامل اسلایدهای رسمی درس به همراه یادداشت‌های کلاسی.', materialType: 'SLIDE', uploader: USER_KAMALI, fieldId: 'fld1', courseId: 'crs2', teacherId: 't1', universityId: 'uni2', term: 'بهار ۱۴۰۳', fileType: 'pptx', fileUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/ai1/400/300', status: NoteStatus.PUBLISHED, likes: 85, views: 890, rating: 4.5, createdAt: '۱۴۰۳/۰۲/۱۰', tags: ['هوش مصنوعی', 'اسلاید'] }),
  mat({ id: 'm5', title: 'سری تمرین‌های جستجوی هوشمند', description: 'تمرین‌های حل‌شده الگوریتم‌های جستجوی A* و مینیمکس.', materialType: 'ASSIGNMENT', uploader: USER_MOHAMMAD, fieldId: 'fld1', courseId: 'crs2', teacherId: 't1', universityId: 'uni2', term: 'بهار ۱۴۰۳', fileType: 'pdf', fileUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/ai2/400/300', status: NoteStatus.PUBLISHED, likes: 52, views: 470, rating: 4.3, createdAt: '۱۴۰۳/۰۳/۰۱', tags: ['تمرین', 'جستجو'] }),

  // Teacher t2 (رضایی) — course crs3
  mat({ id: 'm6', title: 'جزوه ریاضی عمومی ۱', description: 'خلاصه‌نویسی کلاس دکتر رضایی، شامل حل تمرین‌های فصل انتگرال و مشتق.', materialType: 'HANDOUT', uploader: USER_SARA, fieldId: 'fld2', courseId: 'crs3', teacherId: 't2', universityId: 'uni1', term: 'پاییز ۱۴۰۲', fileType: 'pdf', fileUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/math1/400/300', status: NoteStatus.PUBLISHED, likes: 110, views: 1340, rating: 4.7, createdAt: '۱۴۰۲/۰۸/۲۰', tags: ['ریاضی', 'انتگرال', 'مشتق'] }),
  mat({ id: 'm7', title: 'نمونه سوال میان‌ترم ریاضی ۱', description: 'سوالات میان‌ترم به همراه بارم‌بندی و پاسخنامه.', materialType: 'EXAM', uploader: USER_REZA, fieldId: 'fld2', courseId: 'crs3', teacherId: 't2', universityId: 'uni1', term: 'پاییز ۱۴۰۲', fileType: 'pdf', fileUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/math2/400/300', status: NoteStatus.PUBLISHED, likes: 78, views: 900, rating: 4.4, createdAt: '۱۴۰۲/۰۹/۲۵', tags: ['نمونه سوال', 'میان‌ترم'] }),

  // Teacher t6 (کریمی) — course crs4
  mat({ id: 'm8', title: 'خلاصه تبدیل لاپلاس', description: 'یادداشت‌های فشرده مبحث تبدیل لاپلاس و کاربردها.', materialType: 'NOTE', uploader: CURRENT_USER, fieldId: 'fld2', courseId: 'crs4', teacherId: 't6', universityId: 'uni1', term: 'بهار ۱۴۰۳', fileType: 'pdf', fileUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/math3/400/300', status: NoteStatus.PUBLISHED, likes: 34, views: 300, rating: 4.0, createdAt: '۱۴۰۳/۰۲/۱۸', tags: ['لاپلاس', 'معادلات'] }),

  // Teacher t3 (حسابی) — course crs5
  mat({ id: 'm9', title: 'فیزیک ۲ - الکتریسیته و مغناطیس', description: 'دست‌نویس تمیز با کیفیت اسکن بالا از کلاس دکتر حسابی.', materialType: 'HANDOUT', uploader: USER_REZA, fieldId: 'fld3', courseId: 'crs5', teacherId: 't3', universityId: 'uni3', term: 'پاییز ۱۴۰۲', fileType: 'pdf', fileUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/phys1/400/300', status: NoteStatus.PUBLISHED, likes: 45, views: 300, rating: 4.2, createdAt: '۱۴۰۲/۰۸/۰۱', tags: ['فیزیک', 'الکتریسیته'] }),
  mat({ id: 'm10', title: 'اسلایدهای میدان مغناطیسی', description: 'اسلایدهای درس با نمودارها و مثال‌های تشریحی.', materialType: 'SLIDE', uploader: USER_MOHAMMAD, fieldId: 'fld3', courseId: 'crs5', teacherId: 't3', universityId: 'uni3', term: 'پاییز ۱۴۰۲', fileType: 'pptx', fileUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/phys2/400/300', status: NoteStatus.PUBLISHED, likes: 28, views: 210, rating: 3.9, createdAt: '۱۴۰۲/۰۹/۰۵', tags: ['مغناطیس', 'اسلاید'] }),

  // Teacher t4 (شریفی) — courses crs6 & crs8
  mat({ id: 'm11', title: 'جزوه مدارهای منطقی', description: 'جبر بولی، نقشه کارنو و طراحی مدارهای ترکیبی.', materialType: 'HANDOUT', uploader: CURRENT_USER, fieldId: 'fld4', courseId: 'crs6', teacherId: 't4', universityId: 'uni1', term: 'زمستان ۱۴۰۲', fileType: 'pdf', fileUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/logic1/400/300', status: NoteStatus.PUBLISHED, likes: 60, views: 540, rating: 4.3, createdAt: '۱۴۰۲/۱۱/۱۲', tags: ['مدار منطقی', 'کارنو'] }),
  mat({ id: 'm12', title: 'تمرین‌های الگوهای طراحی', description: 'مجموعه تمرین‌های عملی الگوهای طراحی نرم‌افزار.', materialType: 'ASSIGNMENT', uploader: USER_SARA, fieldId: 'fld1', courseId: 'crs8', teacherId: 't4', universityId: 'uni1', term: 'بهار ۱۴۰۳', fileType: 'docx', fileUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/se1/400/300', status: NoteStatus.PUBLISHED, likes: 41, views: 360, rating: 4.1, createdAt: '۱۴۰۳/۰۲/۲۲', tags: ['تمرین', 'الگوی طراحی'] }),
  mat({ id: 'm13', title: 'خلاصه فرآیندهای تولید نرم‌افزار', description: 'یادداشت جلسات مربوط به مدل‌های آبشاری و چابک.', materialType: 'NOTE', uploader: USER_MOHAMMAD, fieldId: 'fld1', courseId: 'crs8', teacherId: 't4', universityId: 'uni1', term: 'بهار ۱۴۰۳', fileType: 'pdf', fileUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/se2/400/300', status: NoteStatus.PUBLISHED, likes: 33, views: 290, rating: 4.0, createdAt: '۱۴۰۳/۰۳/۱۰', tags: ['نرم‌افزار', 'چابک'] }),

  // Teacher t5 (موسوی) — course crs7
  mat({ id: 'm14', title: 'جزوه مدارهای الکتریکی', description: 'قوانین کیرشهف و تحلیل مدارهای مقاومتی همراه با مثال.', materialType: 'HANDOUT', uploader: USER_REZA, fieldId: 'fld4', courseId: 'crs7', teacherId: 't5', universityId: 'uni2', term: 'پاییز ۱۴۰۲', fileType: 'pdf', fileUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/ee1/400/300', status: NoteStatus.PUBLISHED, likes: 47, views: 420, rating: 4.2, createdAt: '۱۴۰۲/۰۸/۲۸', tags: ['مدار الکتریکی', 'کیرشهف'] }),

  // Current user's pending contribution
  mat({ id: 'm15', title: 'ساختمان داده‌ها (پیش‌نویس)', description: 'هنوز کامل نیست، در انتظار بازبینی.', materialType: 'NOTE', uploader: CURRENT_USER, fieldId: 'fld1', courseId: 'crs1', teacherId: 't1', universityId: 'uni2', term: 'زمستان ۱۴۰۲', fileType: 'docx', fileUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/ds4/400/300', status: NoteStatus.PENDING, likes: 0, views: 10, rating: 0, createdAt: '۱۴۰۲/۱۱/۲۰', tags: ['پیش‌نویس'] }),
];

export const LEADERBOARD_DATA: LeaderboardEntry[] = [
  { rank: 1, user: USER_KAMALI, totalPoints: 9000, contributions: 45 },
  { rank: 2, user: CURRENT_USER, totalPoints: 1250, contributions: 12 },
  { rank: 3, user: USER_SARA, totalPoints: 450, contributions: 5 },
  { rank: 4, user: USER_MOHAMMAD, totalPoints: 320, contributions: 3 },
  { rank: 5, user: USER_REZA, totalPoints: 300, contributions: 2 },
];

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------

const publishedOnly = (m: Material) => m.status === NoteStatus.PUBLISHED;

export const getUniversityById = (id?: string): University | undefined =>
  id ? UNIVERSITIES.find(u => u.id === id) : undefined;

export const getFieldById = (id?: string): Field | undefined =>
  id ? FIELDS.find(f => f.id === id) : undefined;

export const getTeacherById = (id?: string): Teacher | undefined =>
  id ? TEACHERS.find(t => t.id === id) : undefined;

export const getCourseById = (id?: string): Course | undefined =>
  id ? COURSES.find(c => c.id === id) : undefined;

export const getMaterialById = (id?: string): Material | undefined =>
  id ? MATERIALS.find(m => m.id === id) : undefined;

/** All published materials belonging to a teacher's courses — ANY uploader. */
export const getMaterialsByTeacher = (teacherId: string): Material[] =>
  MATERIALS.filter(m => m.teacherId === teacherId && publishedOnly(m));

export const getMaterialsByCourse = (courseId: string): Material[] =>
  MATERIALS.filter(m => m.courseId === courseId && publishedOnly(m));

export const getMaterialsByField = (fieldId: string): Material[] =>
  MATERIALS.filter(m => m.fieldId === fieldId && publishedOnly(m));

export const getMaterialsByUniversity = (universityId: string): Material[] =>
  MATERIALS.filter(m => m.universityId === universityId && publishedOnly(m));

export const getCoursesByTeacher = (teacherId: string): Course[] =>
  COURSES.filter(c => c.teacherId === teacherId);

export const getCoursesByField = (fieldId: string): Course[] =>
  COURSES.filter(c => c.fieldId === fieldId);

export const getCoursesByUniversity = (universityId: string): Course[] =>
  COURSES.filter(c => c.universityId === universityId);

export const getTeachersByUniversity = (universityId: string): Teacher[] =>
  TEACHERS.filter(t => t.universityId === universityId);

export const getTeachersByField = (fieldId: string): Teacher[] =>
  TEACHERS.filter(t => t.fieldIds.includes(fieldId));

/** Fields that have at least one course or teacher at the given university. */
export const getFieldsByUniversity = (universityId: string): Field[] => {
  const fieldIds = new Set<string>();
  getCoursesByUniversity(universityId).forEach(c => fieldIds.add(c.fieldId));
  getTeachersByUniversity(universityId).forEach(t => t.fieldIds.forEach(f => fieldIds.add(f)));
  return FIELDS.filter(f => fieldIds.has(f.id));
};

export const getUserById = (id?: string): User | undefined => {
  if (!id) return undefined;
  const known = MOCK_USERS.find(u => u.id === id);
  if (known) return known;
  const uploader = MATERIALS.find(m => m.uploader.id === id)?.uploader;
  if (uploader) return uploader;
  return LEADERBOARD_DATA.find(l => l.user.id === id)?.user;
};

/** If a contributor account corresponds to a verified teacher entity, return it. */
export const getTeacherForUser = (user?: User): Teacher | undefined => {
  if (!user || user.role !== UserRole.INSTRUCTOR) return undefined;
  return TEACHERS.find(t => t.name === user.name);
};

// ---------------------------------------------------------------------------
// Material type labels / theming
// ---------------------------------------------------------------------------

export const MATERIAL_TYPE_LABELS: Record<Material['materialType'], string> = {
  HANDOUT: 'جزوه',
  EXAM: 'نمونه سوال',
  NOTE: 'یادداشت',
  SLIDE: 'اسلاید',
  ASSIGNMENT: 'تمرین',
};

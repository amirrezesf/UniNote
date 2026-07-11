
import { Note, NoteStatus, User, UserRole, LeaderboardEntry } from './types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'علی محمدی',
  role: UserRole.CLASS_REP,
  avatarUrl: 'https://picsum.photos/seed/u1/200',
  points: 1250,
  university: 'دانشگاه تهران',
  fieldOfStudy: 'مهندسی کامپیوتر'
};

export const MOCK_INSTRUCTORS: User[] = [
  { id: 'u3', name: 'دکتر کمالی', role: UserRole.INSTRUCTOR, avatarUrl: 'https://picsum.photos/seed/u3/200', points: 9000, university: 'دانشگاه شریف', fieldOfStudy: 'هوش مصنوعی' },
  { id: 'u6', name: 'دکتر رضایی', role: UserRole.INSTRUCTOR, avatarUrl: 'https://picsum.photos/seed/u6/200', points: 5000, university: 'دانشگاه تهران', fieldOfStudy: 'ریاضیات' },
  { id: 'u7', name: 'دکتر حسابی', role: UserRole.INSTRUCTOR, avatarUrl: 'https://picsum.photos/seed/u7/200', points: 8000, university: 'دانشگاه امیرکبیر', fieldOfStudy: 'فیزیک' },
  { id: 'u8', name: 'دکتر شریفی', role: UserRole.INSTRUCTOR, avatarUrl: 'https://picsum.photos/seed/u8/200', points: 6500, university: 'دانشگاه تهران', fieldOfStudy: 'نرم‌افزار' },
];

export const MOCK_MY_COURSES = [
  { id: 'c1', title: 'ریاضی عمومی ۱', progress: 75, nextSession: 'دوشنبه ۱۰:۰۰', instructor: 'دکتر رضایی', color: 'bg-blue-100 text-blue-600' },
  { id: 'c2', title: 'ساختمان داده‌ها', progress: 45, nextSession: 'سه‌شنبه ۱۴:۰۰', instructor: 'دکتر کمالی', color: 'bg-emerald-100 text-emerald-600' },
  { id: 'c3', title: 'فیزیک ۲', progress: 30, nextSession: 'شنبه ۰۸:۰۰', instructor: 'دکتر حسابی', color: 'bg-amber-100 text-amber-600' },
  { id: 'c4', title: 'هوش مصنوعی', progress: 90, nextSession: 'چهارشنبه ۱۶:۰۰', instructor: 'دکتر شریفی', color: 'bg-purple-100 text-purple-600' },
  { id: 'c5', title: 'مدارهای منطقی', progress: 10, nextSession: 'یک‌شنبه ۱۰:۰۰', instructor: 'دکتر محمدی', color: 'bg-rose-100 text-rose-600' },
];

export const MOCK_NOTES: Note[] = [
  {
    id: 'n1',
    title: 'جزوه کامل ریاضی عمومی ۱',
    description: 'خلاصه‌نویسی دقیق کلاس‌های دکتر رضایی، شامل حل تمرین‌های فصل انتگرال و مشتق.',
    author: { id: 'u2', name: 'سارا احمدی', role: UserRole.STUDENT, avatarUrl: 'https://picsum.photos/seed/u2/200', points: 450 },
    course: 'ریاضی عمومی ۱',
    fieldOfStudy: 'مهندسی کامپیوتر',
    university: 'دانشگاه تهران',
    teacher: 'دکتر رضایی',
    term: 'پاییز ۱۴۰۲',
    fileType: 'pdf',
    fileUrl: '#',
    thumbnailUrl: 'https://picsum.photos/seed/math/400/300',
    status: NoteStatus.PUBLISHED,
    likes: 120,
    views: 1500,
    rating: 4.8,
    createdAt: '۱۴۰۲/۰۸/۱۵',
    tags: ['ریاضی', 'انتگرال', 'خلاصه'],
    visibility: 'PUBLIC'
  },
  {
    id: 'n2',
    title: 'اسلایدهای درس هوش مصنوعی',
    description: 'نسخه کامل اسلایدها به همراه یادداشت‌های کلاسی.',
    author: { id: 'u3', name: 'دکتر کمالی', role: UserRole.INSTRUCTOR, avatarUrl: 'https://picsum.photos/seed/u3/200', points: 9000 },
    course: 'هوش مصنوعی',
    fieldOfStudy: 'مهندسی کامپیوتر',
    university: 'دانشگاه صنعتی شریف',
    teacher: 'دکتر کمالی',
    term: 'بهار ۱۴۰۳',
    fileType: 'pptx',
    fileUrl: '#',
    thumbnailUrl: 'https://picsum.photos/seed/ai/400/300',
    status: NoteStatus.PUBLISHED,
    likes: 85,
    views: 890,
    rating: 4.5,
    createdAt: '۱۴۰۳/۰۲/۱۰',
    tags: ['AI', 'ماشین لرنینگ', 'جستجو'],
    visibility: 'PUBLIC'
  },
  {
    id: 'n3',
    title: 'فیزیک ۲ - الکتریسیته و مغناطیس',
    description: 'دست‌نویس تمیز با کیفیت اسکن بالا.',
    author: { id: 'u4', name: 'رضا حسینی', role: UserRole.STUDENT, avatarUrl: 'https://picsum.photos/seed/u4/200', points: 300 },
    course: 'فیزیک ۲',
    fieldOfStudy: 'فیزیک',
    university: 'دانشگاه امیرکبیر',
    term: 'پاییز ۱۴۰۲',
    fileType: 'pdf',
    fileUrl: '#',
    thumbnailUrl: 'https://picsum.photos/seed/physics/400/300',
    status: NoteStatus.PUBLISHED,
    likes: 45,
    views: 300,
    rating: 4.2,
    createdAt: '۱۴۰۲/۰۸/۰۱',
    tags: ['فیزیک', 'الکتریسیته'],
    visibility: 'CLASS'
  },
  {
    id: 'n4',
    title: 'ساختمان داده‌ها (پیش‌نویس)',
    description: 'هنوز کامل نیست، نیاز به بررسی استاد دارد.',
    author: CURRENT_USER,
    course: 'ساختمان داده',
    fieldOfStudy: 'مهندسی کامپیوتر',
    term: 'زمستان ۱۴۰۲',
    fileType: 'docx',
    fileUrl: '#',
    thumbnailUrl: 'https://picsum.photos/seed/ds/400/300',
    status: NoteStatus.PENDING,
    likes: 0,
    views: 10,
    rating: 0,
    createdAt: '۱۴۰۲/۱۱/۲۰',
    tags: ['Data Structures', 'C++'],
    visibility: 'PUBLIC'
  }
];

export const LEADERBOARD_DATA: LeaderboardEntry[] = [
  { rank: 1, user: { id: 'u3', name: 'دکتر کمالی', role: UserRole.INSTRUCTOR, avatarUrl: 'https://picsum.photos/seed/u3/200', points: 9000 }, totalPoints: 9000, contributions: 45 },
  { rank: 2, user: { id: 'u1', name: 'علی محمدی', role: UserRole.CLASS_REP, avatarUrl: 'https://picsum.photos/seed/u1/200', points: 1250 }, totalPoints: 1250, contributions: 12 },
  { rank: 3, user: { id: 'u2', name: 'سارا احمدی', role: UserRole.STUDENT, avatarUrl: 'https://picsum.photos/seed/u2/200', points: 450 }, totalPoints: 450, contributions: 5 },
  { rank: 4, user: { id: 'u5', name: 'محمد نوری', role: UserRole.STUDENT, avatarUrl: 'https://picsum.photos/seed/u5/200', points: 320 }, totalPoints: 320, contributions: 3 },
  { rank: 5, user: { id: 'u4', name: 'رضا حسینی', role: UserRole.STUDENT, avatarUrl: 'https://picsum.photos/seed/u4/200', points: 300 }, totalPoints: 300, contributions: 2 },
];

export const getUserById = (id: string | undefined): User | undefined => {
  if (!id) return undefined;
  if (id === CURRENT_USER.id) return CURRENT_USER;
  
  const instructor = MOCK_INSTRUCTORS.find(u => u.id === id);
  if (instructor) return instructor;
  
  const noteAuthor = MOCK_NOTES.find(n => n.author.id === id)?.author;
  if (noteAuthor) return noteAuthor;
  
  const lbUser = LEADERBOARD_DATA.find(l => l.user.id === id)?.user;
  if (lbUser) return lbUser;
  
  return undefined;
};

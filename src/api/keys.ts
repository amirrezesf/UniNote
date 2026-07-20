import type { MaterialType, NoteStatus } from '../../types';

// Query parameter types
export interface MaterialQuery {
  field?: string;
  university?: string;
  teacher?: string;
  course?: string;
  uploader?: string;
  type?: MaterialType;
  status?: NoteStatus;
  q?: string;
  ordering?: '-createdAt' | 'createdAt' | '-views' | '-rating' | '-likes';
  page?: number;
}

export interface TeacherQuery {
  university?: string;
  field?: string;
  q?: string;
}

export interface CourseQuery {
  field?: string;
  university?: string;
  teacher?: string;
  q?: string;
}

export interface ModerationQuery {
  status?: NoteStatus;
  page?: number;
}

// Query key factory - centralize keys for precise invalidation
export const qk = {
  // Auth
  me: () => ['auth', 'me'] as const,
  user: (id: string) => ['auth', 'user', id] as const,

  // Universities
  universities: () => ['universities'] as const,
  university: (id: string) => ['university', id] as const,
  universityFields: (id: string) => ['university', id, 'fields'] as const,
  universityTeachers: (id: string) => ['university', id, 'teachers'] as const,
  universityCourses: (id: string) => ['university', id, 'courses'] as const,

  // Fields
  fields: () => ['fields'] as const,
  field: (id: string) => ['field', id] as const,
  fieldTeachers: (id: string) => ['field', id, 'teachers'] as const,
  fieldCourses: (id: string) => ['field', id, 'courses'] as const,

  // Teachers
  teachers: (params?: TeacherQuery) => ['teachers', params ?? {}] as const,
  teacher: (id: string) => ['teacher', id] as const,
  teacherCourses: (id: string) => ['teacher', id, 'courses'] as const,
  teacherMaterials: (id: string, type?: MaterialType) => ['teacher', id, 'materials', type ?? 'all'] as const,

  // Courses
  courses: (params?: CourseQuery) => ['courses', params ?? {}] as const,
  course: (id: string) => ['course', id] as const,
  courseMaterials: (id: string, type?: MaterialType) => ['course', id, 'materials', type ?? 'all'] as const,

  // Materials
  materials: (params?: MaterialQuery) => ['materials', params ?? {}] as const,
  material: (id: string) => ['material', id] as const,
  myMaterials: () => ['me', 'materials'] as const,
  comments: (id: string) => ['material', id, 'comments'] as const,

  // Interactions
  // (mutations handle these via invalidation)

  // Leaderboard
  leaderboard: () => ['leaderboard'] as const,

  // Moderation
  moderationQueue: (status?: NoteStatus) => ['moderation', status ?? 'PENDING'] as const,

  // Messages
  conversations: () => ['conversations'] as const,
  conversation: (id: string) => ['conversation', id] as const,

  // Notifications
  notifications: () => ['notifications'] as const,

  // Marketplace - Cart
  cart: () => ['cart'] as const,

  // Marketplace - Purchases
  purchases: () => ['purchases'] as const,
  purchase: (id: string) => ['purchase', id] as const,

  // Marketplace - Earnings
  earnings: () => ['earnings'] as const,
  earningsHistory: () => ['earnings', 'history'] as const,

  // Preview / Validation
  preview: (id: string) => ['material', id, 'preview'] as const,

  // Library
  library: () => ['library'] as const,
  libraryItem: (id: string) => ['library', id] as const,
} as const;
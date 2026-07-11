export enum UserRole {
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl: string;
  points: number;
  university?: string;
  fieldOfStudy?: string;
}

export enum NoteStatus {
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
  REJECTED = 'REJECTED',
}

export interface University {
  id: string;
  name: string;
  city?: string;
  logoUrl?: string;
}

export interface Field {
  id: string;
  name: string;
}

export interface Teacher {
  id: string;
  name: string;
  universityId?: string;
  fieldIds: string[];
  avatarUrl?: string;
  isVerified?: boolean;
  bio?: string;
}

export interface Course {
  id: string;
  title: string;
  code?: string;
  fieldId: string;
  teacherId?: string;
  universityId?: string;
  description?: string;
}

export type MaterialType = 'HANDOUT' | 'EXAM' | 'NOTE' | 'SLIDE' | 'ASSIGNMENT';

export interface Material {
  id: string;
  title: string;
  description: string;
  materialType: MaterialType;
  uploader: User;
  fieldId: string;
  courseId?: string;
  teacherId?: string;
  universityId?: string;
  term?: string;
  fileType: 'pdf' | 'docx' | 'pptx' | 'img';
  fileUrl: string;
  thumbnailUrl: string;
  status: NoteStatus;
  likes: number;
  views: number;
  rating: number;
  createdAt: string;
  tags: string[];
  visibility: 'PUBLIC';
}

/** Backwards-compatible alias — new code should use `Material`. */
export type Note = Material;

export interface Comment {
  id: string;
  materialId: string;
  user: User;
  content: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  totalPoints: number;
  contributions: number;
}
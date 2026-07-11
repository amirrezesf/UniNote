
export enum UserRole {
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
  ADMIN = 'ADMIN',
  CLASS_REP = 'CLASS_REP'
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
  REJECTED = 'REJECTED'
}

export interface Note {
  id: string;
  title: string;
  description: string;
  author: User;
  course: string;
  fieldOfStudy: string;
  university?: string;
  teacher?: string;
  term: string;
  fileType: 'pdf' | 'docx' | 'pptx' | 'img';
  fileUrl: string;
  thumbnailUrl: string;
  status: NoteStatus;
  likes: number;
  views: number;
  rating: number; // 1-5
  createdAt: string;
  tags: string[];
  visibility: 'PUBLIC' | 'CLASS';
}

export interface Comment {
  id: string;
  noteId: string;
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

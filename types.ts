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
  // Premium marketplace fields
    isPremium: boolean;
    priceTomans: number;
    validationsCount: number;
    isPremiumActive: boolean;
    hasPurchased?: boolean;
    hasValidated?: boolean;
    previewUrl?: string | null;
  }

/** Backwards-compatible alias — new code should use `Material`. */
export type Note = Material;

export interface Comment {
  id: string;
  materialId: string;
  user: User;
  content: string;
  createdAt: string;
  likes?: number;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  totalPoints: number;
  contributions: number;
}

// Pagination envelope (matches DRF PageNumberPagination)
export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

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

// Detail responses with extra counts
export type UniversityDetail = University & { teacherCount: number; courseCount: number; materialCount: number };
export type FieldDetail = Field & { teacherCount: number; courseCount: number; materialCount: number };
export type TeacherDetail = Teacher & { courseCount: number; materialCount: number };
export type MaterialDetail = Material & { myRating: number | null; liked: boolean; previewUrl: string | null };

// Auth DTOs
export interface RegisterRequest { email: string; name: string; password: string; }
export interface LoginRequest { email: string; password: string; }
export interface AuthResponse { user: User; access: string; refresh: string; }
export interface RefreshRequest { refresh: string; }
export interface RefreshResponse { access: string; refresh?: string; }
export interface MeResponse extends User {}
export interface UpdateProfileRequest { name?: string; fieldOfStudy?: string; university?: string; avatar?: File | string; }
export type UpdateProfileInput = UpdateProfileRequest;
export interface PasswordResetRequest { email: string; }
export interface PasswordResetConfirmRequest { token: string; password: string; }

// Rate/Like/View responses
export interface RateResponse { rating: number; myRating: number; }
export interface LikeResponse { likes: number; liked: boolean; }
export interface ViewResponse { views: number; }

// AI responses
export interface SummaryResponse { summary: string; }
export interface QuizResponse { questions: string[]; }

// Upload
export interface UploadMaterialRequest {
  title: string;
  description: string;
  materialType: MaterialType;
  fieldId: string;
  courseId?: string;
  teacherId?: string;
  universityId?: string;
  term?: string;
  tags?: string[];
  file: File;
  // Premium marketplace
  isPremium?: boolean;
  priceTomans?: number;
}

// Messages
export interface Message {
  id: string;
  conversationId: string;
  sender: User;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage: Message;
  unreadCount: number;
  updatedAt: string;
  messages?: Message[];
}

// Notifications
export type NotificationType = 'LIKE' | 'COMMENT' | 'SYSTEM' | 'COURSE' | 'MATERIAL_APPROVED' | 'MATERIAL_REJECTED';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
  link?: string;
}

// ================================
// Marketplace — Cart & Checkout
// ================================

export interface CartItemMaterial {
  id: string;
  title: string;
  isPremium: boolean;
  priceTomans: number;
  validationsCount: number;
  isPremiumActive: boolean;
  thumbnailUrl: string;
}

export interface CartItem {
  id: number;
  material: CartItemMaterial;
  priceAtAdd: number;
  createdAt: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalTomans: number;
  itemCount: number;
}

export interface AddToCartRequest {
  materialId: string;
}

export interface CheckoutResponse {
  paymentUrl: string;
  authority: string;
  totalTomans: number;
}

export interface VerifyResponse {
  success: boolean;
  message: string;
  refId: string;
}

export interface PreviewResponse {
  previewUrl: string | null;
  validationsCount: number;
  isPremiumActive: boolean;
}

export interface ValidateRequest {
  isValid: boolean;
}

export interface ValidateResponse {
  validationsCount: number;
  isPremiumActive: boolean;
}

// ================================
// Marketplace — Purchases
// ================================

export interface PurchaseMaterial {
  id: string;
  title: string;
  materialType: string;
  isPremium: boolean;
  thumbnailUrl: string;
}

export interface Purchase {
  id: string;
  material: PurchaseMaterial;
  pricePaid: number;
  isPaid: boolean;
  purchasedAt: string;
  fileUrl: string;
}

export interface DownloadResponse {
  fileUrl: string;
}

// ================================
// Marketplace — Earnings (uploader)
// ================================

export interface SaleRecord {
  materialTitle: string;
  buyerName: string;
  amount: number;
  date: string;
}

export interface EarningsSummary {
  totalEarned: number;
  totalPaidOut: number;
  pendingEarnings: number;
  totalDownloads: number;
  recentSales: SaleRecord[];
}

// ================================
// Library
// ================================

export interface LibraryItemMaterial {
  id: string;
  title: string;
  materialType: MaterialType;
  fileType: string;
  thumbnailUrl: string;
  uploaderName: string;
}

export interface LibraryItem {
  id: string;
  material: LibraryItemMaterial;
  createdAt: string;
}

export interface LibraryToggleResponse {
  inLibrary: boolean;
}
# UI Revamp Prompt — UniNote → National Teacher-Indexed Course-Material Directory

> Paste this whole file into a coding agent working inside the UniNote repository. It is a **UI-only** task. Do NOT add a backend, database, or real auth. Everything stays client-side on mock data.

---

## 1. Context: what the project is now

UniNote is a Persian (Farsi), fully **RTL** single-page web app for sharing university course materials. Current stack (do not change versions):

- React `19.2.1` + TypeScript `5.8.2`, Vite `6.2.0`
- Routing: `react-router-dom` `7.10.1` (uses `HashRouter`)
- Icons: `lucide-react` `0.556.0`
- Charts: `recharts` `3.5.1`
- AI helper: `@google/genai` (used only in `services/geminiService.ts` for note summary / sample-question generation — keep as-is)
- Styling: Tailwind (loaded via `tailwind.js` script + CDN in `index.html`), font is `Vazir`, `dir="rtl"`, `lang="fa"`
- No test framework, no backend. All data comes from `constants.ts` (`MOCK_NOTES`, `MOCK_INSTRUCTORS`, `MOCK_MY_COURSES`, `LEADERBOARD_DATA`).

Key existing files:
- `types.ts` — data types
- `constants.ts` — all mock data
- `App.tsx` — routes + sidebar/layout
- `pages/*.tsx` — screens
- `services/geminiService.ts` — AI helpers (leave alone)

There are already **orphaned, unrouted files** to delete (see §7): `OnlineClasses.tsx`, `RecordedClasses.tsx`, `VirtualClassroom.tsx`, `RequestOnlineClass.tsx`, `IdeaFestival.tsx`, `Moderation.tsx`, `AddClassmate.tsx`.

---

## 2. The target vision (what we are building toward)

An **open-source, national directory** where any student — from **any university, any field** — can drill down and find the **exact course materials of a specific teacher**: handouts (جزوه), exam samples (نمونه سوال), notes, slides, assignments.

The organizing spine is a hierarchy:

```
University (دانشگاه)  →  Field (رشته)  →  Teacher (استاد)  →  Course (درس)  →  Materials (منابع)
```

Two ways to reach a material:
1. **Search** (already exists, flat filters) — improve it.
2. **Browse/Directory drill-down** (does NOT exist) — build it. This is the headline new capability.

Critically: a **Teacher page** must aggregate **all materials for that teacher's courses, regardless of who uploaded them** — not just what that teacher personally posted.

---

## 3. Core problem to fix: entities vs. strings

Today `Note` stores `fieldOfStudy`, `university?`, `teacher?`, `course` as **free-text strings**, and `teacher` (a string) is disconnected from `author` (the uploader `User`). This cannot power a canonical national directory (duplicate/typo'd universities, no teacher aggregation).

**Introduce first-class entities** and make materials reference them by ID. This is the heart of the task.

### 3.1 New `types.ts` entity model

Add these (keep existing `User`, `UserRole`, `Comment`, `LeaderboardEntry`, `NoteStatus` unless noted):

```ts
export interface University {
  id: string;
  name: string;          // e.g. "دانشگاه تهران"
  city?: string;
  logoUrl?: string;
}

export interface Field {          // رشته تحصیلی
  id: string;
  name: string;          // e.g. "مهندسی کامپیوتر"
}

export interface Teacher {        // استاد (a directory entity, NOT necessarily an app user)
  id: string;
  name: string;          // e.g. "دکتر کمالی"
  universityId?: string; // optional — a teacher may span universities
  fieldIds: string[];    // fields they teach
  avatarUrl?: string;
  isVerified?: boolean;  // verified/claimed teacher account
  bio?: string;
}

export interface Course {         // a public hub keyed by (course + teacher + university)
  id: string;
  title: string;         // e.g. "ساختمان داده‌ها"
  code?: string;         // e.g. "CS-202" (optional)
  fieldId: string;       // REQUIRED
  teacherId?: string;    // optional
  universityId?: string; // optional
  description?: string;
}

export type MaterialType =
  | 'HANDOUT'     // جزوه
  | 'EXAM'        // نمونه سوال
  | 'NOTE'        // یادداشت/خلاصه
  | 'SLIDE'       // اسلاید
  | 'ASSIGNMENT'; // تمرین

export interface Material {        // replaces the old "Note" as the shared unit
  id: string;
  title: string;
  description: string;
  materialType: MaterialType;      // NEW — semantic type (distinct from fileType)
  uploader: User;                  // who shared it (was `author`)
  fieldId: string;                 // REQUIRED — reference, not string
  courseId?: string;               // optional link to a Course hub
  teacherId?: string;              // optional — the teacher this material belongs to
  universityId?: string;           // optional
  term?: string;
  fileType: 'pdf' | 'docx' | 'pptx' | 'img';
  fileUrl: string;
  thumbnailUrl: string;
  status: NoteStatus;
  likes: number;
  views: number;
  rating: number;                  // 1-5
  createdAt: string;
  tags: string[];
  visibility: 'PUBLIC';            // drop 'CLASS' (see §7)
}
```

> Naming: you MAY keep the exported name `Note` as an alias of `Material` to reduce churn, but new code should use `Material` and the ID references above. Prefer a clean rename if the agent can update all imports safely.

### 3.2 Helper selectors (add to `constants.ts` or a new `data/` module)

Provide typed helpers so pages don't hand-filter strings:

```ts
getUniversityById(id) / getFieldById(id) / getTeacherById(id) / getCourseById(id)
getMaterialsByTeacher(teacherId)   // all materials for that teacher's courses, ANY uploader
getMaterialsByCourse(courseId)
getMaterialsByField(fieldId)
getCoursesByTeacher(teacherId)
getCoursesByUniversity(universityId)
getTeachersByUniversity(universityId)
getTeachersByField(fieldId)
getFieldsByUniversity(universityId) // fields that have courses/teachers at that uni
```

### 3.3 Mock data (`constants.ts`)

Rebuild the mock data around the new entities so the directory is demonstrably navigable:

- At least **3 universities**, **4 fields**, **6 teachers**, **8 courses**, **~15 materials** spread across types (`HANDOUT`, `EXAM`, `NOTE`, `SLIDE`, `ASSIGNMENT`).
- Ensure at least one teacher has **materials uploaded by multiple different students** (to prove teacher-aggregation works).
- Keep names Persian and realistic (reuse existing ones: دانشگاه تهران، شریف، امیرکبیر؛ دکتر کمالی، رضایی، حسابی، شریفی).
- Remove `MOCK_MY_COURSES` "enrolled course" shape (progress %, nextSession, room) — replaced by `Course` hubs.

---

## 4. Information architecture / navigation

Rework the sidebar (`App.tsx`) and routes to be **directory-first**, not "my"-first.

### 4.1 Routes (target)

| Route | Page | Status |
|---|---|---|
| `/` | Home/Dashboard (directory entry) | reshape |
| `/browse` | Directory root: list of Universities + Fields | **NEW** |
| `/university/:id` | University page → its fields & teachers | **NEW** |
| `/field/:id` | Field page → teachers & courses in it | **NEW** |
| `/teacher/:id` | **Teacher page** → their courses + all materials | **NEW (flagship)** |
| `/course/:id` | Public Course hub → all materials for it | reshape (was personal enrollment) |
| `/search` | Search with filters (field/uni/teacher/type) | reshape |
| `/material/:id` | Material detail (was `/note/:id`) | reshape/rename |
| `/upload` | Upload material | reshape |
| `/my-materials` | Uploader's own contributions (was `/my-notes`) | reshape/rename |
| `/leaderboard` | Top contributors | keep |
| `/profile/:id` | Uploader profile (contributions) | keep, clarify vs Teacher page |
| `/login`, `/forgot-password`, `/profile/edit` | auth/profile UI | keep (UI only) |

Remove routes/links tied to enrollment & institution: `/my-courses`, `/my-courses/add`, `/my-qr`, and the class-roster flows. (Keep `/messages`, `/notifications` only if you want them; they are non-core — mark as optional.)

### 4.2 Sidebar

Replace "درس‌های من / کارت دیجیتال" items with: **خانه، کاوش (Browse directory)، جستجو، بارگذاری، مشارکت‌های من، برترین‌ها**.

---

## 5. Page-by-page work

For each page keep the existing visual language (rounded-2xl/3xl cards, `slate` palette, blue-600 primary, gradient headers, RTL, Vazir font, lucide icons). Match spacing/typography already in the codebase.

### 5.1 NEW — `pages/Browse.tsx` (`/browse`) — directory root
- Two sections: **دانشگاه‌ها** (University cards) and **رشته‌ها** (Field cards).
- University card: logo/initial, name, city, counts (# teachers, # courses). Links to `/university/:id`.
- Field card: name, icon, counts. Links to `/field/:id`.
- Add a prominent search box at top that routes to `/search`.

### 5.2 NEW — `pages/UniversityPage.tsx` (`/university/:id`)
- Header: university name, city, logo, aggregate stats (fields, teachers, courses, materials).
- Tabs or sections: **رشته‌ها** (fields at this uni) and **اساتید** (teachers at this uni), each a grid of cards linking deeper.

### 5.3 NEW — `pages/FieldPage.tsx` (`/field/:id`)
- Header: field name + stats.
- Lists **teachers** in this field and **courses** in this field (cards → `/teacher/:id`, `/course/:id`).
- Optional filter by university.

### 5.4 NEW & FLAGSHIP — `pages/TeacherPage.tsx` (`/teacher/:id`)
- Header: teacher name, verified badge (`BadgeCheck` when `isVerified`), university, field chips, bio.
- **Courses taught** (cards → `/course/:id`).
- **All materials for this teacher**, grouped or filterable by `MaterialType` (جزوه / نمونه سوال / اسلاید / تمرین / یادداشت), aggregated via `getMaterialsByTeacher` — **must include materials uploaded by students, not only the teacher**. Show uploader on each card.
- This page is the concrete answer to "find the exact course data of a specific teacher." Make it excellent.

### 5.5 RESHAPE — `pages/CourseDetails.tsx` (`/course/:id`)
- Convert from a **personal enrollment** view into a **public course hub**.
- Remove: weekly session time, room/location, progress %, classmates roster, "add student via QR/code" flow, "management" buttons.
- Keep/add: course title + code, field chip, linked teacher card (→ `/teacher/:id`), university, description, and the **materials list filterable by `MaterialType`**, plus an "upload material for this course" CTA (prefills course on `/upload`).

### 5.6 RESHAPE — `pages/Search.tsx` (`/search`)
- Keep the strong filter sidebar pattern already there.
- Change filters to operate on **entities/IDs**, and **add two filters**: **استاد (Teacher)** and **نوع منبع (MaterialType)**.
- Results show a `MaterialType` badge and link uploader → `/profile/:id`, teacher → `/teacher/:id`, course → `/course/:id`.
- Fix the existing quirk where results label the uploader as "استاد" (it currently prints `note.author.name` prefixed with "استاد:"). Show **Uploader** and **Teacher** as distinct fields.

### 5.7 RESHAPE — `pages/Upload.tsx` (`/upload`)
- Field of study: **required**, chosen from the canonical `Field` list (searchable select), not free text.
- University: **optional**, from canonical `University` list (searchable) with "add new / other" affordance.
- Teacher: **optional**, from canonical `Teacher` list (keep the existing autocomplete UX) with "not listed / add" affordance.
- Add **نوع منبع (MaterialType)** selector (required): جزوه / نمونه سوال / یادداشت / اسلاید / تمرین.
- Optional: link to an existing `Course`.
- Remove the **visibility PUBLIC/CLASS** toggle and the class-selector block (everything is public now).
- Keep the drag-drop file zone and success screen.

### 5.8 RESHAPE — `pages/Dashboard.tsx` (`/`)
- Reframe from "welcome to the new term / active courses" to a **directory landing**: hero with search + "کاوش دانشگاه‌ها/اساتید", trending materials, newest materials, maybe a "featured teachers" row.
- Replace term/course-centric stats with directory stats (universities, teachers, courses, materials counts) — you may use `recharts` if useful, else static cards.

### 5.9 RESHAPE/RENAME — `pages/MyNotes.tsx` → `MyMaterials.tsx` (`/my-materials`)
- Uploader's own contributions with status (published/pending), now typed by `MaterialType`. Straight rename + field updates.

### 5.10 RESHAPE/RENAME — `pages/NoteDetails.tsx` → `MaterialDetails.tsx` (`/material/:id`)
- Add a clear metadata row linking **Field → Teacher → Course → University** (each clickable into the directory).
- Show `MaterialType` badge. Remove the "مخصوص کلاس" (CLASS visibility) badge.
- Keep AI summary / quiz, rating, comments UI as-is.

### 5.11 KEEP — `pages/Profile.tsx` (`/profile/:id`)
- Remains the **uploader** profile (their contributions). Add a one-line clarifier that this is a contributor profile; if the user is also a verified teacher, show a link to their **Teacher page**.

---

## 6. Cross-cutting requirements

- **RTL & Persian**: all new UI must be RTL, Persian labels, Vazir font, Persian digits where existing code uses them. Mirror existing className conventions.
- **Design consistency**: reuse existing card/badge/button styles; `lucide-react` icons; blue-600 primary, slate neutrals, amber for ratings, green for success, red for destructive.
- **Reusable components**: extract shared pieces to `components/` (e.g. `MaterialCard`, `TeacherCard`, `UniversityCard`, `FieldCard`, `MaterialTypeBadge`, `EntityBreadcrumb`, `StatPill`). Avoid duplicating the several near-identical `NoteCardMinimal` definitions currently copy-pasted across pages.
- **Breadcrumbs**: add a breadcrumb component reflecting University → Field → Teacher → Course → Material so users know where they are in the directory.
- **Empty states**: every list must have a Persian empty state (existing pages have good examples).
- **No dead links**: every entity reference in a card must navigate somewhere valid.
- **Type safety**: no `any` for entities; use the new interfaces. `npm run build` must pass with no TS errors.

---

## 7. Cleanup (remove institution/enrollment leftovers)

- Delete orphaned unrouted files: `pages/OnlineClasses.tsx`, `RecordedClasses.tsx`, `VirtualClassroom.tsx`, `RequestOnlineClass.tsx`, `IdeaFestival.tsx`, `Moderation.tsx`, `AddClassmate.tsx`.
- Remove `MyCourses.tsx`, `AddCourse.tsx`, `MyQRCode.tsx` (personal-enrollment / digital-card features) and their routes/sidebar links. (If you prefer to preserve `MyQRCode` as a contributor share-card, that's optional — otherwise remove.)
- Remove the `'CLASS'` visibility concept everywhere (`Upload`, `MaterialDetails`, types, mock data).
- Remove `CLASS_REP`, and `ADMIN` roles if unused after cleanup; keep `STUDENT` and `INSTRUCTOR` (INSTRUCTOR ↔ verified teacher). Update `UserRole` accordingly and fix all references.
- Remove `MOCK_MY_COURSES` and any schedule/room/progress data.

---

## 8. Deliverables / acceptance criteria

The task is done when:

1. `types.ts` defines `University`, `Field`, `Teacher`, `Course`, `Material`, `MaterialType`; materials reference entities by ID.
2. `constants.ts` holds the richer mock dataset (§3.3) and the selector helpers (§3.2).
3. New pages exist and are routed: `/browse`, `/university/:id`, `/field/:id`, `/teacher/:id`; `/course/:id` reshaped to a public hub.
4. From `/browse` a user can drill **University → Field → Teacher → Course → Material** entirely via clicks, no dead ends.
5. A **Teacher page** shows that teacher's courses **and** all materials for them (including student-uploaded ones), filterable by `MaterialType`.
6. Upload enforces required Field + MaterialType, optional University + Teacher, all from canonical lists; no CLASS visibility.
7. Search filters include Teacher and MaterialType; uploader vs teacher shown distinctly.
8. All institution/enrollment leftover files, routes, and concepts (§7) are removed.
9. Sidebar/nav reflects the directory-first IA.
10. `npm run build` passes; app runs via `npm run dev` with no console errors; all links resolve; UI is RTL/Persian and visually consistent with the current design.

> Reminder: **UI only.** Persist nothing to a server. All reads/writes are against in-memory mock data; "upload" simulates success as it does today.

---

## 9. Suggested order of work

1. Rewrite `types.ts` (entities) + add selectors and new mock data in `constants.ts`.
2. Extract shared components (`MaterialCard`, `TeacherCard`, etc.).
3. Build directory pages bottom-up: `TeacherPage` → `CourseDetails` (hub) → `FieldPage` → `UniversityPage` → `Browse`.
4. Reshape `Search`, `Upload`, `Dashboard`, `MaterialDetails`, `MyMaterials`.
5. Update `App.tsx` routes + sidebar; wire breadcrumbs.
6. Delete leftovers (§7); fix all broken imports.
7. `npm run build`, click through every route, fix dead links.

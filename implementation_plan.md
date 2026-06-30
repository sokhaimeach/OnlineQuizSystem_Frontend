# Teacher Dashboard — Online Quiz System

A complete, professional teacher dashboard for the Online Quiz System, built with React, Tailwind CSS v4, and shadcn/ui. Inspired by Google Classroom, Canvas LMS, and Coursera's Instructor Dashboard.

---

## Open Questions

> [!IMPORTANT]
> **shadcn/ui component availability**: The project uses `shadcn` v4 with Tailwind CSS v4 (new `@import` syntax). Several components specified in the requirements (Card, Tabs, Badge, Dialog, Command, Calendar, Sonner) are **not yet installed**. I'll add them via `npx shadcn add` before building.

> [!IMPORTANT]
> **Color theme**: The design spec uses Indigo as primary and Emerald as accent. I'll override the CSS variables in `index.css` to use oklch-encoded Indigo/Emerald values matching Tailwind's palette, while keeping the shadcn theming system intact.

> [!NOTE]
> **Navigation**: This is a single-page app with hash-based routing. Active sections will be controlled by React state (no real routing needed for the dashboard itself). Real routing via react-router will only be used for the `/teacher` path already defined.

---

## Proposed Changes

### 1. Theme & CSS

#### [MODIFY] [index.css](file:///d:/PRACTICE/OnlineQuizSystem/Frontend/src/index.css)
- Replace `:root` and `.dark` CSS variable blocks with Indigo primary + Emerald accent values (oklch).
- Add chart colors tuned for the analytics widgets.
- Add custom CSS for active sidebar indicator (left border).

---

### 2. Install Missing shadcn/ui Components

Run `npx shadcn add` for:
- `badge`
- `card`
- `tabs`
- `dialog`
- `sonner`
- `progress`
- `select`
- `table`
- `calendar`
- `popover`
- `command`
- `scroll-area`

---

### 3. Context & Hooks

#### [NEW] `src/contexts/ThemeContext.tsx`
- `ThemeProvider` wrapping `<html>` with `.dark` class.
- `useTheme()` hook exposing `theme`, `toggleTheme`.

#### [NEW] `src/hooks/useDashboard.ts`
- Centralised mock data and state for the dashboard (active section, selected class/subject, etc.).

---

### 4. Sidebar Redesign

#### [MODIFY] [app-sidebar.tsx](file:///d:/PRACTICE/OnlineQuizSystem/Frontend/src/components/app-sidebar.tsx)
- Replace `TeamSwitcher` header with a branded logo mark + "QuizFlow" title.
- Full sidebar nav matching the spec:
  - Dashboard
  - Teaching → Classes (recent + view all) / Subjects (recent + view all)
  - Content → Create Quiz / Question Bank
  - Assignments → Active / Scheduled / Completed
  - Analytics
  - Profile (at footer)
- Left-side active indicator on selected item.
- Collapsible icon mode on desktop (`collapsible="icon"`).

#### [MODIFY] [nav-main.tsx](file:///d:/PRACTICE/OnlineQuizSystem/Frontend/src/components/nav-main.tsx)
- Add `isActive` prop support with visual active indicator (indigo left border + indigo text).
- Support `onClick` navigation callbacks instead of bare `<a>` tags.

---

### 5. Top Navigation Bar

#### [NEW] `src/components/dashboard/TopNavBar.tsx`
- Sticky header with:
  - `SidebarTrigger`
  - Breadcrumb (dynamic based on active section)
  - Global search (`Command`/`Input` with search icon)
  - Notifications bell with badge count (`Popover` + list)
  - Theme toggle (sun/moon icon, calls `useTheme()`)
  - User profile avatar + `DropdownMenu` (Profile, Settings, Log out)

---

### 6. Dashboard Sections (Page Views)

All sections rendered inside `SidebarInset` based on active state.

#### [NEW] `src/components/dashboard/DashboardOverview.tsx`
Stats widget row:
| Widget | Value | Icon | Color |
|---|---|---|---|
| Total Classes | 12 | `School` | Indigo |
| Total Students | 347 | `Users` | Blue |
| Active Assignments | 8 | `ClipboardList` | Amber |
| Published Quizzes | 24 | `BookOpen` | Emerald |
| Submission Rate | 78% | `TrendingUp` | Green |
| Average Score | 82.4 | `Award` | Purple |

- Recent Classes quick-access cards.
- Recent Activity feed (last 5 events).
- Upcoming deadlines list (Assignments due within 7 days).

#### [NEW] `src/components/dashboard/ClassesView.tsx`
- Grid of class cards with: class name, grade, student count, active assignments badge, last activity.
- "Create Class" button (dialog trigger).

#### [NEW] `src/components/dashboard/ClassDetailView.tsx`
- `Tabs`: Students | Assignments | Analytics
- **Students tab**: Table with avatar, name, email, submission rate, avg score, last active.
- **Assignments tab**: Table with title, quiz, due date, status badge, submission count.
- **Analytics tab**: Score distribution, completion rate progress bars.

#### [NEW] `src/components/dashboard/SubjectsView.tsx`
- Grid of subject cards with: subject name, class count, quiz count, avg score trend.

#### [NEW] `src/components/dashboard/SubjectDetailView.tsx`
- `Tabs`: Quizzes | Question Bank | Analytics
- **Quizzes tab**: Table of quizzes with status badges (Draft/Published/Archived), question count, avg score.
- **Question Bank tab**: Table with question text, type (MCQ/TF/Short), difficulty badge.
- **Analytics tab**: Score trends, topic breakdown.

#### [NEW] `src/components/dashboard/CreateQuizView.tsx`
- Step-by-step quiz builder skeleton (Title, Description, Settings, Add Questions).
- Uses `Card`, `Input`, `Select`, `Dialog` for adding questions.

#### [NEW] `src/components/dashboard/AssignmentsView.tsx`
- Three sub-tabs: Active | Scheduled | Completed.
- `DataTable` with sortable columns: Title, Class, Due Date, Submissions, Status badge.
- Calendar `Popover` for date filtering.

#### [NEW] `src/components/dashboard/AnalyticsView.tsx`
- Overview charts (placeholder with CSS-only bar/line charts or recharts if installed).
- Top performers table.
- Quiz completion rates.

#### [NEW] `src/components/dashboard/ProfileView.tsx`
- Teacher profile card: avatar, name, email, department, joined date.
- Editable settings section.

---

### 7. Shared UI Components

#### [NEW] `src/components/dashboard/StatCard.tsx`
- Reusable metric card: icon, label, value, trend indicator (+/- %).

#### [NEW] `src/components/dashboard/StatusBadge.tsx`
- Centralised badge variants: success/warning/danger/info/muted.

#### [NEW] `src/components/dashboard/EmptyState.tsx`
- Friendly empty state with icon + message + CTA button.

#### [NEW] `src/components/dashboard/PageHeader.tsx`
- Section heading + description + optional action button(s).

---

### 8. Layout Wiring

#### [MODIFY] [teacherDashboard.tsx](file:///d:/PRACTICE/OnlineQuizSystem/Frontend/src/layouts/teacherDashboard.tsx)
- Replace placeholder content with full dashboard layout.
- Use `ThemeProvider` wrapping the entire layout.
- Render `TopNavBar` + dynamic section based on active navigation state.

---

## Verification Plan

### Automated
```
npm run build  # TypeScript + Vite build
```

### Manual
1. Confirm sidebar collapses to icon mode on desktop.
2. Confirm Sheet drawer appears on mobile viewport.
3. Toggle dark mode — verify all cards, sidebar, navbar update correctly.
4. Navigate all sections — Dashboard, Classes, Subject detail, Assignments, Analytics, Profile.
5. Verify breadcrumb updates dynamically.
6. Verify all badge colors match the spec (green/amber/red/indigo).
7. Confirm WCAG contrast in both light and dark modes.

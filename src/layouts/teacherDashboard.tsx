import { useMemo } from 'react'
import { Outlet, useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import { AppSidebar, type DashboardSection } from '@/components/app-sidebar'
import { TopNavBar } from '@/components/TopNavBar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { ThemeProvider } from '@/contexts/ThemeContext'

export interface TeacherDashboardOutletContext {
  onNavigate: (section: DashboardSection) => void
}

const sectionBreadcrumb: Record<DashboardSection, { label: string; href?: string }[]> = {
  dashboard: [{ label: 'Dashboard' }],
  classes: [{ label: 'Teaching' }, { label: 'Classes' }],
  'class-detail': [{ label: 'Teaching' }, { label: 'Classes' }, { label: 'Class 10-A' }],
  subjects: [{ label: 'Teaching' }, { label: 'Subjects' }],
  'subject-detail': [{ label: 'Teaching' }, { label: 'Subjects' }, { label: 'Mathematics' }],
  'create-quiz': [{ label: 'Content' }, { label: 'Create Quiz' }],
  'question-bank': [{ label: 'Content' }, { label: 'Question Bank' }],
  analytics: [{ label: 'Insights' }, { label: 'Analytics' }],
  profile: [{ label: 'Profile' }],
  settings: [{ label: 'Profile' }, { label: 'Account Settings' }],
}

const sectionToRoute: Record<DashboardSection, string> = {
  dashboard: 'dashboard',
  classes: 'classes',
  'class-detail': 'class-detail',
  subjects: 'subjects',
  'subject-detail': 'subject-detail',
  'create-quiz': 'create-quiz',
  'question-bank': 'question-bank',
  analytics: 'analytics',
  profile: 'profile',
  settings: 'settings',
}

const routeToSection = Object.fromEntries(
  Object.entries(sectionToRoute).map(([section, route]) => [route, section]),
) as Record<string, DashboardSection>

export function useTeacherDashboardContext() {
  return useOutletContext<TeacherDashboardOutletContext>()
}

export default function TeacherDashboard() {
  const location = useLocation()
  const navigate = useNavigate()

  const currentRoute = location.pathname.replace(/^\/teacher\/?/, '') || 'dashboard'
  const activeSection = currentRoute.startsWith('subjects/')
    ? 'subject-detail'
    : currentRoute.startsWith('classes/')
    || currentRoute.startsWith('students/')
    || currentRoute.startsWith('attempts/')
    || currentRoute.startsWith('assignments/')
    ? 'class-detail'
    : routeToSection[currentRoute] ?? 'dashboard'
  const breadcrumb = useMemo(() => {
    if (currentRoute.startsWith('students/')) {
      return [{ label: 'Teaching' }, { label: 'Classes' }, { label: 'Student detail' }]
    }
    if (currentRoute.startsWith('attempts/')) {
      return [{ label: 'Teaching' }, { label: 'Students' }, { label: 'Attempt detail' }]
    }
    if (currentRoute.startsWith('assignments/')) {
      return [{ label: 'Teaching' }, { label: 'Classes' }, { label: 'Assignment attempts' }]
    }
    return sectionBreadcrumb[activeSection]
  }, [activeSection, currentRoute])

  const handleNavigate = (section: DashboardSection) => {
    navigate(`/teacher/${sectionToRoute[section]}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <ThemeProvider>
      <SidebarProvider>
        <AppSidebar activeSection={activeSection} onNavigate={handleNavigate} />
        <SidebarInset className="flex flex-col min-h-svh overflow-hidden">
          <TopNavBar breadcrumb={breadcrumb} />
          <main className="flex-1 overflow-auto">
            <div className="p-4 sm:p-6 max-w-[1400px] mx-auto">
              <Outlet context={{ onNavigate: handleNavigate }} />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}

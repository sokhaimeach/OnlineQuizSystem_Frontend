import { BrowserRouter, Routes, Route, Navigate, useOutletContext } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ComponentType } from 'react'
import './App.css'
import TeacherDashboard, { type TeacherDashboardOutletContext } from './layouts/teacherDashboard'
import { TooltipProvider } from './components/ui/tooltip'
import { DashboardOverview } from './components/DashboardOverview'
import { ClassesView } from './pages/teacher/ClassesView'
import { ClassDetailView } from './pages/teacher/ClassDetailView'
import { SubjectsView } from './pages/teacher/SubjectsView'
import { SubjectDetailView } from './pages/teacher/SubjectDetailView'
import { CreateQuizView } from './pages/teacher/CreateQuizView'
import { QuestionBankView } from './pages/teacher/QuestionBankView'
import { AssignmentsView } from './pages/teacher/AssignmentsView'
import { AnalyticsView } from './pages/teacher/AnalyticsView'
import { ProfileView } from './pages/teacher/ProfileView'
import type { DashboardSection } from './components/app-sidebar'

const queryClient = new QueryClient()

function withTeacherOutlet<P extends { onNavigate: (section: DashboardSection) => void }>(Component: ComponentType<P>) {
  return function RoutedComponent(props: Omit<P, 'onNavigate'>) {
    const { onNavigate } = useOutletContext<TeacherDashboardOutletContext>()
    return <Component {...(props as P)} onNavigate={onNavigate} />
  }
}

const DashboardRoute = withTeacherOutlet(DashboardOverview)
const ClassesRoute = withTeacherOutlet(ClassesView)
const ClassDetailRoute = withTeacherOutlet(ClassDetailView)
const SubjectsRoute = withTeacherOutlet(SubjectsView)
const SubjectDetailRoute = withTeacherOutlet(SubjectDetailView)
const CreateQuizRoute = withTeacherOutlet(CreateQuizView)
const QuestionBankRoute = withTeacherOutlet(QuestionBankView)
const AssignmentsRoute = withTeacherOutlet(AssignmentsView)
const AnalyticsRoute = withTeacherOutlet(AnalyticsView)
const ProfileRoute = withTeacherOutlet(ProfileView)

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Navigate to='/teacher/dashboard' replace />} />
            <Route path='/teacher' element={<TeacherDashboard />}>
              <Route index element={<DashboardRoute />} />
              <Route path='dashboard' element={<DashboardRoute />} />
              <Route path='classes' element={<ClassesRoute />} />
              <Route path='class-detail' element={<ClassDetailRoute />} />
              <Route path='subjects' element={<SubjectsRoute />} />
              <Route path='subject-detail' element={<SubjectDetailRoute />} />
              <Route path='create-quiz' element={<CreateQuizRoute />} />
              <Route path='question-bank' element={<QuestionBankRoute />} />
              <Route path='assignments-active' element={<AssignmentsRoute />} />
              <Route path='assignments-scheduled' element={<AssignmentsRoute />} />
              <Route path='assignments-completed' element={<AssignmentsRoute />} />
              <Route path='analytics' element={<AnalyticsRoute />} />
              <Route path='profile' element={<ProfileRoute />} />
            </Route>
            <Route path='*' element={<Navigate to='/teacher/dashboard' replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App

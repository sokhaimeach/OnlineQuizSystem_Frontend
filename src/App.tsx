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
import { QuizDetailView } from './pages/teacher/QuizDetailView'
import { CreateQuizView } from './pages/teacher/CreateQuizView'
import { QuestionBankView } from './pages/teacher/QuestionBankView'
import { AnalyticsView } from './pages/teacher/AnalyticsView'
import { AiAssistantView } from './pages/teacher/AiAssistantView'
import { ReportsOverviewView } from './pages/teacher/reports/ReportsOverviewView'
import { StudentPerformanceView } from './pages/teacher/reports/StudentPerformanceView'
import { StudentReportView } from './pages/teacher/reports/StudentReportView'
import { SubjectAnalyticsView } from './pages/teacher/reports/SubjectAnalyticsView'
import { SubjectReportView } from './pages/teacher/reports/SubjectReportView'
import { ClassReportView } from './pages/teacher/reports/ClassReportView'
import { ImprovementReportView } from './pages/teacher/reports/ImprovementReportView'
import { AtRiskStudentsView } from './pages/teacher/reports/AtRiskStudentsView'
import { ProfileView } from './pages/teacher/ProfileView'
import { TeacherSettingsView } from './pages/teacher/TeacherSettingsView'
import { StudentDetailView } from './pages/teacher/StudentDetailView'
import { AttemptDetailView } from './pages/teacher/AttemptDetailView'
import { AssignmentAttemptsView } from './pages/teacher/AssignmentAttemptsView'
import type { DashboardSection } from './components/app-sidebar'
import Login from './layouts/login'
import Register from './layouts/register'
import { DoQuizPage } from './pages/DoQuizPage'
import { Toaster } from './components/ui/sonner'
import StudentDashboard from './layouts/studentDashboard'
import { StudentRoute } from './components/StudentRoute'
import { TeacherRoute } from './components/TeacherRoute'
import { StudentDashboardView } from './pages/student/StudentDashboardView'
import { StudentAssignmentsView } from './pages/student/AssignmentsView'
import { StudentClassesView } from './pages/student/ClassesView'
import { StudentClassDetailView } from './pages/student/ClassDetailView'
import { StudentAccountView } from './pages/student/AccountView'
import { StudentSettingsView } from './pages/student/SettingsView'

import { StudentResultView } from './pages/student/ResultView'
import { StudentRegisterPage } from './pages/student/RegisterPage'
import { JoinClassPage } from './pages/student/JoinClassPage'
import { JoinSuccessPage } from './pages/student/JoinSuccessPage'
import { AuthProvider } from './contexts/AuthContext'
import { useSession } from './contexts/auth-session'

const queryClient = new QueryClient()

function withTeacherOutlet<P extends { onNavigate: (section: DashboardSection) => void }>(Component: ComponentType<P>) {
  return function RoutedComponent(props: Omit<P, 'onNavigate'>) {
    const { onNavigate } = useOutletContext<TeacherDashboardOutletContext>()
    return <Component {...(props as P)} onNavigate={onNavigate} />
  }
}

const DashboardRoute = withTeacherOutlet(DashboardOverview)
const ClassDetailRoute = withTeacherOutlet(ClassDetailView)
const SubjectsRoute = withTeacherOutlet(SubjectsView)
const SubjectDetailRoute = withTeacherOutlet(SubjectDetailView)
const CreateQuizRoute = withTeacherOutlet(CreateQuizView)
const QuestionBankRoute = withTeacherOutlet(QuestionBankView)
const AnalyticsRoute = withTeacherOutlet(AnalyticsView)
const ReportsOverviewRoute = withTeacherOutlet(ReportsOverviewView)

function AuthLanding() {
  const { isAuthenticated, role } = useSession()

  if (!isAuthenticated) return <Navigate to='/login' replace />

  return (
    <Navigate
      to={role === 'STUDENT' ? '/student/dashboard' : '/teacher/dashboard'}
      replace
    />
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path='/' element={<AuthLanding />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/student/register' element={<StudentRegisterPage />} />
              <Route path='/student/join/:classId' element={<JoinClassPage />} />
              <Route path='/student/join/:classId/success' element={<JoinSuccessPage />} />
              <Route path='/do-quiz/:assignmentId' element={<DoQuizPage />} />
              <Route path='/result/:attemptId' element={<StudentResultView />} />
              <Route path='/student' element={<StudentRoute><StudentDashboard /></StudentRoute>}>
                <Route index element={<Navigate to='dashboard' replace />} />
                <Route path='dashboard' element={<StudentDashboardView />} />
                <Route path='assignments' element={<StudentAssignmentsView />} />
                <Route path='classes' element={<StudentClassesView />} />
                <Route path='classes/:classId' element={<StudentClassDetailView />} />
                <Route path='result/:attemptId' element={<StudentResultView />} />
                <Route path='account' element={<StudentAccountView />} />
                <Route path='settings' element={<StudentSettingsView />} />
              </Route>
              <Route path='/teacher' element={<TeacherRoute><TeacherDashboard /></TeacherRoute>}>
                <Route index element={<DashboardRoute />} />
                <Route path='dashboard' element={<DashboardRoute />} />
                <Route path='classes' element={<ClassesView />} />
                <Route path='classes/:classId' element={<ClassDetailRoute />} />

                <Route path='students/:id' element={<StudentDetailView />} />
                <Route path='attempts/:id' element={<AttemptDetailView />} />
                <Route path='assignments/:assignmentId/attempts' element={<AssignmentAttemptsView />} />
                <Route path='subjects' element={<SubjectsRoute />} />
                <Route path='subjects/:subjectId' element={<SubjectDetailRoute />} />
                <Route path='quizzes/:quizId' element={<QuizDetailView />} />
                <Route path='subject-detail' element={<SubjectDetailRoute />} />
                <Route path='create-quiz' element={<CreateQuizRoute />} />
                <Route path='question-bank' element={<QuestionBankRoute />} />
                <Route path='analytics' element={<AnalyticsRoute />} />
                <Route path='ai-assistant' element={<AiAssistantView />} />
                <Route path='reports' element={<ReportsOverviewRoute />} />
                <Route path='reports/students' element={<StudentPerformanceView />} />
                <Route path='reports/students/at-risk' element={<AtRiskStudentsView />} />
                <Route path='reports/student/:studentId' element={<StudentReportView />} />
                <Route path='reports/subjects' element={<SubjectAnalyticsView />} />
                <Route path='reports/subject/:subjectId' element={<SubjectReportView />} />
                <Route path='reports/class' element={<ClassReportView />} />
                <Route path='reports/class/:classId' element={<ClassReportView />} />
                <Route path='reports/improvement' element={<ImprovementReportView />} />
                <Route path='profile' element={<ProfileView />} />
                <Route path='settings' element={<TeacherSettingsView />} />
              </Route>
              <Route path='*' element={<Navigate to='/login' replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
        <Toaster position='top-right' richColors />
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App

import api from "@/lib/axios"
import type { AnalyticsSummary, RecentActivity, TeacherAnalytics, UpcomingDeadline } from "@/models/analytics.interface"

// ---- Report endpoints (dashboard-focused) ----

export const getDashboardSummary = async () => {
    const response = await api.get("/teacher/report/dashboard")
    return response.data as AnalyticsSummary
}

export const getReportActivity = async () => {
    const response = await api.get("/teacher/report/activity")
    return response.data as RecentActivity[]
}

export const getReportUpcomingDeadlines = async () => {
    const response = await api.get("/teacher/report/upcoming-deadlines")
    return response.data as UpcomingDeadline[]
}

// ---- Analytics endpoints (detailed analysis) ----

export const getTeacherAnalytics = async () => {
    const response = await api.get("/teacher/analytics")
    return response.data as TeacherAnalytics
}

export const getClassPerformance = async () => {
    const response = await api.get("/teacher/analytics/class-performance")
    return response.data
}

export const getQuizPerformance = async () => {
    const response = await api.get("/teacher/analytics/quiz-performance")
    return response.data
}

export const getScoreDistribution = async () => {
    const response = await api.get("/teacher/analytics/score-distribution")
    return response.data
}

export const getCompletionRate = async () => {
    const response = await api.get("/teacher/analytics/completion-rate")
    return response.data
}

export const getTrends = async () => {
    const response = await api.get("/teacher/analytics/trends")
    return response.data
}

export const getStudentPerformance = async () => {
    const response = await api.get("/teacher/analytics/student-performance")
    return response.data
}

import api from "@/lib/axios"

export const getStudentDashboard = async () => {
    return api.get("/student/report/dashboard")
}

export const getStudentAttempts = async () => {
    return api.get("/student/report/attempts")
}

export const getStudentPerformance = async () => {
    return api.get("/student/report/performance")
}

export const getStudentProgress = async () => {
    return api.get("/student/report/progress")
}

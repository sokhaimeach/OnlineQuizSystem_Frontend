import api from "@/lib/axios"

export interface StudentAssignmentFilters {
    page?: number
    limit?: number
    search?: string
    filter?: string
}

export const getStudentAssignments = async (filters: StudentAssignmentFilters = {}) => {
    return api.get("/student/assignments", { params: filters })
}

export const getStudentAssignment = async (id: string) => {
    return api.get(`/student/assignments/${id}`)
}

import api from "@/lib/axios"

const studentPath = "/teacher/students"

export const getStudentByClassId = async (classId: string, search = "") => {
    return api.get(`${studentPath}/${classId}/class`, {
        params: search ? { search } : undefined,
    })
}

export const getStudentById = async (studentId: string) => {
    return api.get(`${studentPath}/${studentId}`)
}

export const getStudentAttemptsHistories = async (studentId: string) => {
    return api.get(`${studentPath}/${studentId}/attempts-histories`)
}

export const getStudentAttemptsDetails = async (attemptId: string) => {
    return api.get(`${studentPath}/attempts/${attemptId}`)
}

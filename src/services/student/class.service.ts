import api from "@/lib/axios"

export const getClassInfo = async (classId: string) => {
    return api.get(`/student/class/${classId}`)
}

export const joinClass = async (classId: string) => {
    return api.post(`/student/classes/${classId}/join`)
}

export const getStudentJoinedClass = async () => {
    return api.get(`/student/classes`)
}


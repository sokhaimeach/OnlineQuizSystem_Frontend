import api from "@/lib/axios"

export const joinClass = async (classId: string) => {
    return api.post(`/student/classes/${classId}`)
}

export const getStudentJoinedClass = async () => {
    return api.get(`/student/classes`)
}


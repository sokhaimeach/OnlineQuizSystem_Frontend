import type { StudentAttemptsDetails, StudentAttemptsHistory, StudentDetails, StudentWithUser } from "@/models/student.interface"
import { getStudentAttemptsDetails, getStudentAttemptsHistories, getStudentByClassId, getStudentById } from "@/services/teacher/student.service"
import { useQuery } from "@tanstack/react-query"

export const useGetStudentByClassId = (classId: string) => {
    return useQuery({
        queryKey: ['students', classId],
        queryFn: async () => {
            const response = await getStudentByClassId(classId)
            return response.data as StudentWithUser[]
        },
        enabled: Boolean(classId),
    })
}

export const useGetStudentById = (studentId: string) => {
    return useQuery({
        queryKey: ['student', studentId],
        queryFn: async () => {
            const response = await getStudentById(studentId)
            return response.data as StudentDetails
        },
        enabled: Boolean(studentId),
    })
}

export const useGetStudentAttemptsHistories = (studentId: string) => {
    return useQuery({
        queryKey: ['attempts-histories', studentId],
        queryFn: async () => {
            const response = await getStudentAttemptsHistories(studentId)
            return response.data as StudentAttemptsHistory[]
        },
        enabled: Boolean(studentId),
    })
}

export const useGetStudentAttemptsDetails = (attemptId: string) => {
    return useQuery({
        queryKey: ['attempts-details', attemptId],
        queryFn: async () => {
            const response = await getStudentAttemptsDetails(attemptId)
            return response.data as StudentAttemptsDetails
        },
        enabled: Boolean(attemptId),
    })
}


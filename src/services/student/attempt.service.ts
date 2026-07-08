import api from "@/lib/axios"
import type { CreateAttemptPayload } from "@/models/attempt.interface"
import type { SubmitQuizPayload } from "@/models/quiz.interface"

export const createAttempt = async (payload: CreateAttemptPayload) => {
    return api.post(`/student/attempts`, payload)
}

export const getDoQuiz = async (attemptId: string) => {
    return api.get(`/student/attempts/${attemptId}/quiz`)
}

export const submitQuiz = async (attemptId: string, payload: SubmitQuizPayload) => {
    return api.post(`/student/attempts/${attemptId}/submit`, payload)
}

export const getResult = async (attemptId: string) => {
    return api.get(`/student/attempts/${attemptId}/result`)
}

export const getStudentQuizAttemptByClassId = async (classId: string) => {
    return api.get(`/student/classes/${classId}/attempts`)
}

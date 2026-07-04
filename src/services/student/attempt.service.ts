import api from "@/lib/axios"
import type { CreateAttemptPayload } from "@/models/attempt.interface"
import type { SubmitQuizPayload } from "@/models/quiz.interface"
import { getAccessToken } from "@/utils/tokenStorage"

export const createAttempt = async (payload: CreateAttemptPayload) => {
    return api.post(`/student/attempts`, payload)
}

export const getDoQuiz = async (attemptId: string, payload: any) => {
    const token = getAccessToken('x_attempt_token')

    return api.post(`/student/attempts/${attemptId}/quiz`, payload, {
        headers: {"x-attempt-token": token}
    })
}

export const submitQuiz = async (attemptId: string, payload: SubmitQuizPayload) => {
    const token = getAccessToken('x_attempt_token')

    return api.post(`/student/attempts/${attemptId}/submit`, payload, {
        headers: {"x-attempt-token": token}
    })
}

export const getResult = async (attemptId: string) => {
    const token = getAccessToken('x_attempt_token')

    return api.get(`/student/attempts/${attemptId}/result`, {
        headers: {"x-attempt-token": token}
    })
}

export const getStudentQuizAttemptByClassId = async (classId: string) => {
    return api.get(`/student/classes/${classId}/attempts`)
}
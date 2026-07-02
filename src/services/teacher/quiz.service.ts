import api from '@/lib/axios'
import type { CreateQuiz, Quiz } from '@/models/quiz.interface'

export const createQuiz = async (payload: CreateQuiz) => {
  return api.post<Quiz>('/quizzes', payload)
}

export const getAllTeacherQuizzes = async (pagination: { page: number; limit: number }) => {
  return api.get('/teacher/quizzes', { params: pagination })
}

export const getQuizzesBySubject = async (
  subjectId: string,
  pagination: { page: number; limit: number },
) => {
  return api.get(`/teacher/quizzes/${subjectId}/quizzes-by-subject`, { params: pagination })
}

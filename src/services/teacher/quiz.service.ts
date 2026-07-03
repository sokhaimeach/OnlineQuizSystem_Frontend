import api from '@/lib/axios'
import type {
  AddQuestionsPayload,
  CreateQuiz,
  Quiz,
  QuizListParams,
  UpdateQuestionPayload,
  UpdateQuizPayload,
} from '@/models/quiz.interface'

export const createQuiz = async (payload: CreateQuiz) => {
  return api.post<Quiz>('/teacher/quizzes', payload)
}

export const addQuestions = async (quizId: string, payload: AddQuestionsPayload) => {
  return api.post(`/teacher/quizzes/questions/${quizId}`, payload)
}

export const getAllTeacherQuizzes = async (params: QuizListParams) => {
  return api.get('/teacher/quizzes', { params })
}

export const getQuizzesBySubject = async (
  subjectId: string,
  params: QuizListParams,
) => {
  return api.get(`/teacher/quizzes/${subjectId}/quizzes-by-subject`, { params })
}

export const getQuizOptions = async () => {
  return api.get(`/teacher/quizzes/options-selection`)
}

export const getQuizById = async (quizId: string) => {
  return api.get(`/teacher/quizzes/${quizId}`)
}

export const updateQuiz = async (quizId: string, payload: UpdateQuizPayload) => {
  return api.put(`/teacher/quizzes/${quizId}`, payload)
}

export const updateQuestion = async (
  questionId: string,
  payload: UpdateQuestionPayload
) => {
  return api.put(`/teacher/quizzes/questions/${questionId}`, payload)
}

export const deleteQuiz = async (quizId: string) => {
  return api.delete(`/teacher/quizzes/${quizId}`)
}

export const deleteQuestion = async (questionId: string) => {
  return api.delete(`/teacher/quizzes/questions/${questionId}`)
}

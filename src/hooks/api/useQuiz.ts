import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  AddQuestionsPayload,
  CreateQuiz,
  QuizOption,
  QuizListParams,
  QuizzesPage,
  QuizWithQuestions,
  UpdateQuestionPayload,
  UpdateQuizPayload,
} from '@/models/quiz.interface'
import {
  addQuestions,
  createQuiz,
  deleteQuestion,
  deleteQuiz,
  getAllTeacherQuizzes,
  getQuizById,
  getQuizOptions,
  getQuizzesBySubject,
  updateQuestion,
  updateQuiz,
} from '@/services/teacher/quiz.service'

const invalidateQuizLists = (queryClient: ReturnType<typeof useQueryClient>) => {
  void queryClient.invalidateQueries({ queryKey: ['quizzes'] })
  void queryClient.invalidateQueries({ queryKey: ['quiz-options'] })
}

export const useGetQuizzesForSubject = (
  subjectId: string | undefined,
  params: QuizListParams,
) => {
  return useQuery({
    queryKey: ['quizzes', 'subject', subjectId, params],
    enabled: Boolean(subjectId),
    queryFn: async () => {
      const response = subjectId === 'unassigned'
        ? await getAllTeacherQuizzes(params)
        : await getQuizzesBySubject(subjectId!, params)

      // The axios response interceptor unwraps the HTTP response body.
      return response as unknown as QuizzesPage
    },
    placeholderData: previousData => previousData,
  })
}

export const useGetAllTeacherQuizzes = () => {
  return useQuery({
    queryKey: ['quizzes', 'all'],
    queryFn: async () => {
      const response = await getAllTeacherQuizzes({ page: 1, limit: 100 })
      return response as unknown as QuizzesPage
    },
  })
}

export const useGetQuizOptions = () => {
  return useQuery({
    queryKey: ['quiz-options'],
    queryFn: async () => {
      const response = await getQuizOptions()
      return response.data as QuizOption[]
    },
  })
}

export const useGetQuizById = (quizId?: string) => {
  return useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      const response = await getQuizById(quizId!)
      return response.data as QuizWithQuestions
    },
    enabled: Boolean(quizId),
  })
}

export const useCreateQuiz = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateQuiz) => createQuiz(payload),
    onSuccess: () => invalidateQuizLists(queryClient),
  })
}

export const useAddQuestions = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ quizId, payload }: { quizId: string; payload: AddQuestionsPayload }) =>
      addQuestions(quizId, payload),
    onSuccess: (_response, { quizId }) => {
      invalidateQuizLists(queryClient)
      void queryClient.invalidateQueries({ queryKey: ['quiz', quizId] })
    },
  })
}

export const useUpdateQuiz = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ quizId, payload }: { quizId: string; payload: UpdateQuizPayload }) =>
      updateQuiz(quizId, payload),
    onSuccess: (_response, { quizId }) => {
      invalidateQuizLists(queryClient)
      void queryClient.invalidateQueries({ queryKey: ['quiz', quizId] })
    },
  })
}

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      questionId,
      payload,
    }: {
      questionId: string;
      quizId?: string;
      payload: UpdateQuestionPayload;
    }) => updateQuestion(questionId, payload),
    onSuccess: (_response, { quizId }) => {
      void queryClient.invalidateQueries({ queryKey: ['quizzes'] })
      if (quizId) void queryClient.invalidateQueries({ queryKey: ['quiz', quizId] })
    },
  })
}

export const useDeleteQuiz = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteQuiz,
    onSuccess: (_response, quizId) => {
      invalidateQuizLists(queryClient)
      queryClient.removeQueries({ queryKey: ['quiz', quizId] })
    },
  })
}

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ questionId }: { questionId: string; quizId?: string }) =>
      deleteQuestion(questionId),
    onSuccess: (_response, { quizId }) => {
      void queryClient.invalidateQueries({ queryKey: ['quizzes'] })
      if (quizId) void queryClient.invalidateQueries({ queryKey: ['quiz', quizId] })
    },
  })
}

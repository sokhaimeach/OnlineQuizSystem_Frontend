import { useInfiniteQuery } from '@tanstack/react-query'
import type { QuizzesPage } from '@/models/quiz.interface'
import {
  getAllTeacherQuizzes,
  getQuizzesBySubject,
} from '@/services/teacher/quiz.service'

export const useGetQuizzesForSubject = (subjectId?: string) => {
  return useInfiniteQuery({
    queryKey: ['quizzes', 'subject', subjectId],
    initialPageParam: 1,
    enabled: Boolean(subjectId),
    queryFn: async ({ pageParam }) => {
      const pagination = { page: pageParam, limit: 10 }
      const response = subjectId === 'unassigned'
        ? await getAllTeacherQuizzes(pagination)
        : await getQuizzesBySubject(subjectId!, pagination)

      // The axios response interceptor unwraps the HTTP response body.
      return response as unknown as QuizzesPage
    },
    getNextPageParam: (lastPage) => (
      lastPage.meta.currentPage < lastPage.meta.totalPages
        ? lastPage.meta.currentPage + 1
        : undefined
    ),
  })
}

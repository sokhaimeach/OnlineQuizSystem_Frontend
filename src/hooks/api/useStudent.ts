import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { ClassAttempt, DoQuizAttempt, QuizResult } from "@/models/attempt.interface"
import type { ClassInfo, JoinedClass } from "@/models/class.interface"
import {
  createAttempt,
  getDoQuiz,
  getResult,
  getStudentQuizAttemptByClassId,
  submitQuiz,
} from "@/services/student/attempt.service"
import { getClassInfo, getStudentJoinedClass, joinClass } from "@/services/student/class.service"
import { getAccessToken, setAccessToken } from "@/utils/tokenStorage"
import type { StudentAttemptsDetails, StudentAttemptsHistory, StudentDetails, StudentWithUser } from "@/models/student.interface"
import { getStudentAttemptsDetails, getStudentAttemptsHistories, getStudentByClassId, getStudentById } from "@/services/teacher/student.service"

export const useGetStudentByClassId = (classId: string, search = "") => useQuery({
  queryKey: ["students", classId, search],
  queryFn: async () => (await getStudentByClassId(classId, search)).data as StudentWithUser[],
  enabled: Boolean(classId),
})

export const useGetStudentById = (studentId: string) => useQuery({
  queryKey: ["student", studentId],
  queryFn: async () => (await getStudentById(studentId)).data as StudentDetails,
  enabled: Boolean(studentId),
})

export const useGetStudentAttemptsHistories = (studentId: string) => useQuery({
  queryKey: ["attempts-histories", studentId],
  queryFn: async () => (await getStudentAttemptsHistories(studentId)).data as StudentAttemptsHistory[],
  enabled: Boolean(studentId),
})

export const useGetStudentAttemptsDetails = (attemptId: string) => useQuery({
  queryKey: ["attempts-details", attemptId],
  queryFn: async () => (await getStudentAttemptsDetails(attemptId)).data as StudentAttemptsDetails,
  enabled: Boolean(attemptId),
})

function body<T>(response: unknown): T {
  const value = response as { data?: T }
  return value.data as T
}

export const useClassInfo = (classId: string) => useQuery({
  queryKey: ["class-info", classId],
  queryFn: async () => body<ClassInfo>(await getClassInfo(classId)),
  enabled: Boolean(classId),
})

export const useJoinedClasses = () => useQuery({
  queryKey: ["student-classes"],
  queryFn: async () => body<JoinedClass[]>(await getStudentJoinedClass()),
})

export const useJoinClass = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: joinClass,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["student-classes"] }),
  })
}

export const useClassAttempts = (classId: string) => useQuery({
  queryKey: ["student-class-attempts", classId],
  queryFn: async () => body<ClassAttempt[]>(await getStudentQuizAttemptByClassId(classId)),
  enabled: Boolean(classId),
})

export const useCreateAttempt = () => useMutation({
  mutationFn: createAttempt,
  onSuccess: response => {
    const attempt = body<{ access_token?: string }>(response)
    if (attempt?.access_token && !getAccessToken()) {
      setAccessToken(attempt.access_token, "x_attempt_token")
    }
  },
})

export const useDoQuiz = (attemptId: string) => useQuery({
  queryKey: ["do-quiz", attemptId],
  queryFn: async () => body<DoQuizAttempt>(await getDoQuiz(attemptId)),
  enabled: Boolean(attemptId),
  refetchOnWindowFocus: false,
})

export const useSubmitQuiz = () => useMutation({
  mutationFn: ({ attemptId, payload }: { attemptId: string; payload: Parameters<typeof submitQuiz>[1] }) =>
    submitQuiz(attemptId, payload),
})

export const useQuizResult = (attemptId: string) => useQuery({
  queryKey: ["quiz-result", attemptId],
  queryFn: async () => body<QuizResult>(await getResult(attemptId)),
  enabled: Boolean(attemptId),
})

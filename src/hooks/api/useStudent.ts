import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { ClassAttempt } from "@/models/attempt.interface"
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
    const data = (response as { data?: { access_token?: string } })?.data
    if (data?.access_token && !getAccessToken()) {
      setAccessToken(data.access_token, "x_attempt_token")
    }
  },
  onError: () => {
    // Errors are handled by the calling component (DoQuizPage)
  },
})

export const useDoQuiz = (attemptId: string) => useQuery({
  queryKey: ["do-quiz", attemptId],
  queryFn: () => getDoQuiz(attemptId),
  enabled: Boolean(attemptId),
  retry: false,
  refetchOnWindowFocus: false,
})

export const useSubmitQuiz = () => useMutation({
  mutationFn: ({ attemptId, payload }: { attemptId: string; payload: Parameters<typeof submitQuiz>[1] }) =>
    submitQuiz(attemptId, payload),
})

export const useQuizResult = (attemptId: string) => useQuery({
  queryKey: ["quiz-result", attemptId],
  queryFn: () => getResult(attemptId),
  enabled: Boolean(attemptId),
  retry: false,
})

// ---- Student Assignment Hooks ----
import { getStudentAssignments, getStudentAssignment, type StudentAssignmentFilters } from "@/services/student/assignment.service"
import { getStudentDashboard, getStudentPerformance, getStudentProgress } from "@/services/student/report.service"
import type { StudentAssignmentListItem, StudentDashboardData, StudentPerformanceData } from "@/models/assignment.interface"

export const useGetStudentAssignments = (filters: StudentAssignmentFilters) => useQuery({
  queryKey: ["student-assignments", filters],
  queryFn: () => getStudentAssignments(filters),
})

export const useGetStudentAssignment = (id: string) => useQuery({
  queryKey: ["student-assignment", id],
  queryFn: async () => body<StudentAssignmentListItem>(await getStudentAssignment(id)),
  enabled: Boolean(id),
})

// ---- Student Report Hooks ----
import type { StudentProgress } from "@/models/report.interface"

export const useGetStudentDashboard = () => useQuery({
  queryKey: ["student-dashboard"],
  queryFn: async () => body<StudentDashboardData>(await getStudentDashboard()),
  staleTime: 30_000,
})

export const useGetStudentPerformance = () => useQuery({
  queryKey: ["student-performance"],
  queryFn: async () => body<StudentPerformanceData>(await getStudentPerformance()),
  staleTime: 30_000,
})

export const useGetStudentProgress = () => useQuery({
  queryKey: ["student-progress"],
  queryFn: async () => body<StudentProgress>(await getStudentProgress()),
  staleTime: 30_000,
})

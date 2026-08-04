import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createAssignment, deleteAssignment, getAssignmentByClassId, getAttemptByAssignmentId, updateAssignment } from "@/services/teacher/assignment.service"
import type { AssignmentWithQuiz, CreateAssignment } from "@/models/assignment.interface"
import type { AssignmentStatus } from "@/models/assignment.interface"
import type { AssignmentAttemptListItem } from "@/models/attempt.interface"

export const useCreateAssignment = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createAssignment,
        onSuccess: (_response, assignment) => {
            void queryClient.invalidateQueries({ queryKey: ['assignments', assignment.class_id] })
        },
    })
}

export const useGetAssignmentByClassId = (
    classId: string,
    filters: { search?: string; filter?: AssignmentStatus } = {},
) => {
    return useQuery({
        queryKey: ['assignments', classId, filters.search ?? '', filters.filter ?? ''],
        queryFn: async () => {
            const response = await getAssignmentByClassId(classId, filters)
            return response.data as AssignmentWithQuiz[]
        },
        enabled: Boolean(classId),
    })
}

export const useGetAttemptByAssignmentId = (assignmentId: string) => {
    return useQuery({
        queryKey: ['attempts', assignmentId],
        queryFn: async () => {
            const response = await getAttemptByAssignmentId(assignmentId)
            return response.data as AssignmentAttemptListItem[]
        },
        enabled: Boolean(assignmentId),
    })
}

export const useUpdateAssignment = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ assignmentId, payload }: { assignmentId: string; payload: CreateAssignment }) =>
            updateAssignment(assignmentId, payload),
        onSuccess: (_response, variables) => {
            void queryClient.invalidateQueries({ queryKey: ['assignments', variables.payload.class_id] })
            void queryClient.invalidateQueries({ queryKey: ['assignment', variables.assignmentId] })
        },
    })
}

export const useDeleteAssignment = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ assignmentId }: { assignmentId: string; classId: string }) =>
            deleteAssignment(assignmentId),
        onSuccess: (_response, variables) => {
            void queryClient.invalidateQueries({ queryKey: ['assignments', variables.classId] })
        },
    })
}

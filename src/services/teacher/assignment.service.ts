import api from "@/lib/axios"
import type { CreateAssignment } from "@/models/assignment.interface"

export const createAssignment = async (payload: CreateAssignment) => {
    return api.post('/teacher/assignments', payload)
}

export const getAssignmentByClassId = async (classId: string) => {
    return api.get(`/teacher/assignments/${classId}/assignments-by-class`)
}

export const getAttemptByAssignmentId = async (assignmentId: string) => {
    return api.get(`/teacher/assignments/${assignmentId}/attempt-by-assignment-id`)
}

export const updateAssignment = async (assignmentId: string, payload: Partial<CreateAssignment>) => {
    return api.put(`/teacher/assignments/${assignmentId}`, payload)
}

export const deleteAssignment = async (assignmentId: string) => {
    return api.delete(`/teacher/assignments/${assignmentId}`)
}
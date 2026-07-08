import api from "@/lib/axios"
import type { AssignmentStatus, CreateAssignment } from "@/models/assignment.interface"

export const createAssignment = async (payload: CreateAssignment) => {
    return api.post('/teacher/assignments', payload)
}

export interface AssignmentFilters {
    search?: string
    filter?: AssignmentStatus
}

export const getAssignmentByClassId = async (classId: string, filters: AssignmentFilters = {}) => {
    return api.get(`/teacher/assignments/${classId}/assignments-by-class`, {
        params: filters
    })
}

export const getAttemptByAssignmentId = async (assignmentId: string) => {
    return api.get(`/teacher/assignments/${assignmentId}/attempt-by-assignment-id`)
}

export const updateAssignment = async (assignmentId: string, payload: CreateAssignment) => {
    return api.put(`/teacher/assignments/${assignmentId}`, payload)
}

export const deleteAssignment = async (assignmentId: string) => {
    return api.delete(`/teacher/assignments/${assignmentId}`)
}

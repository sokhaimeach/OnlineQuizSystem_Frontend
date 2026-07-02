import api from '@/lib/axios'
import type { CreateSubjectPayload } from '@/models/subject.interface'

export const getAllSubjects = async (pagination: { page: number; limit: number }) => {
  return api.get('/teacher/subjects', { params: pagination })
}

export const createSubject = async (payload: CreateSubjectPayload) => {
  return api.post('/teacher/subjects', payload)
}

export const updateSubject = async (subjectId: string, payload: CreateSubjectPayload) => {
  return api.put(`/teacher/subjects/${subjectId}`, payload)
}

export const deleteSubject = async (subjectId: string) => {
  return api.delete(`/teacher/subjects/${subjectId}`)
}

export const getSubjectOptions = async () => {
  return api.get(`/teacher/subjects/options`)
}
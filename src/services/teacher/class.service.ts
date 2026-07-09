import api from "@/lib/axios"
import type { CreateClassPayload } from "@/models/class.interface"

const classPath = "/teacher/classes"

export const getAllClasses = async (pagination: { page: number; limit: number, search: string }) => {
    return api.get(`${classPath}`, {params: pagination})
}

export const createClass = async (payload: CreateClassPayload) => {
    return api.post(`${classPath}`, payload)
}

export const updateClass = async (classId: string, payload: CreateClassPayload) => {
    return api.put(`${classPath}/${classId}`, payload)
}

export const deleteClass = async (classId: string) => {
    return api.delete(`${classPath}/${classId}`)
}

export const getRecentClasses = async () => {
    return api.get(`${classPath}/recent`)
}

export const getClassById = async (classId: string) => {
    return api.get(`${classPath}/${classId}`)
}
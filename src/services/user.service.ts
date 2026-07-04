import api from "@/lib/axios"
import type { TeacherAccountResponse, UpdateUserAndTeacherPayload } from "@/models/user.interface"

export const getTeacherAccount = async () => {
    return api.get<TeacherAccountResponse>(`/teacher/accounts`) as unknown as Promise<TeacherAccountResponse>
}

export const updateUserAndTeacherAccount = async (payload: UpdateUserAndTeacherPayload) => {
    return api.put(`/teacher/accounts`, payload)
}

export const changeUserImage = async (image: File) => {
    const formData = new FormData()

    formData.append("image", image)

    return api.put(`/user/change-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}

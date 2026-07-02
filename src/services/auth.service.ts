import api from "@/lib/axios"
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/models/auth.interface"

export const login = async (payload: LoginPayload) => {
    return api.post<AuthResponse>('/auth/login', payload) as unknown as Promise<AuthResponse>
}

export const registerAsTeacher = async (payload: RegisterPayload) => {
    const formData = new FormData()

    formData.append('first_name', payload.first_name)
    formData.append('last_name', payload.last_name)
    formData.append('email', payload.email)
    formData.append('password', payload.password)
    formData.append('gender', payload.gender)
    formData.append('bio', payload.bio)
    formData.append('school_name', payload.school_name)
    if (payload.image) formData.append('image', payload.image)

    return api.post<AuthResponse>('/auth/register-as-teacher', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }) as unknown as Promise<AuthResponse>
}

export const logout = async () => {
    return api.delete('/auth/logout')
}

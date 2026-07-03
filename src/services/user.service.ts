import api from "@/lib/axios"
import type { TeacherAccountResponse } from "@/models/user.interface"

export const getTeacherAccount = async () => {
    return api.get<TeacherAccountResponse>(`/teacher/accounts`) as unknown as Promise<TeacherAccountResponse>
}

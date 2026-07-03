export interface User {
    id?: string
    first_name: string
    last_name: string
    gender: Gender
    email: string
    password?: string
    role: Role
    status: Status
    bio: string
    avatar_url: string | null
    public_id: string | null
}

export interface TeacherProfile {
    id: string
    user_id: string
    school_name: string
    createdAt: string
    updatedAt: string
}

export interface TeacherStats {
    classes_taught: number
    total_students: number
    quizzes_created: number
}

export interface TeacherAccount extends Omit<User, "id"> {
    id: string
    createdAt: string
    updatedAt: string
    teacher: TeacherProfile | null
    stats: TeacherStats | null
}

export interface TeacherAccountResponse {
    success: boolean
    message: string
    data: TeacherAccount
}

export type Gender = 'MALE' | 'FEMALE' | 'OTHER'
export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT'
export type Status = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'

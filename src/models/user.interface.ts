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
    avatar_url: string
    public_id: string
}

export type Gender = 'MALE' | 'FEMALE' | 'OTHER'
export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT'
export type Status = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
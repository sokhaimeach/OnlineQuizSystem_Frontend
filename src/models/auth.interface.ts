import type { User } from "./user.interface"

export interface LoginPayload {
    email: string
    password: string
}


export interface RegisterPayload {
    first_name: string
    last_name: string
    email: string
    password: string
    gender: string
    bio: string
    school_name: string
    image: File | null
}

export interface AuthResponse extends Omit<User, "password"> {
    access_token: string
}
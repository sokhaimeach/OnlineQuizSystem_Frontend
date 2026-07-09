import type { User } from "./user.interface"

export interface LoginPayload {
    email: string
    password: string
}

export interface ChangePasswordPayload {
    old_password: string
    new_password: string
    confirm_password: string
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

export interface RegisterAsStudentPayload extends 
Omit<RegisterPayload, "school_name"> {
    date_of_birth: string
    phone_number: string
    parent_phone_number: string
    class_id?: string
}

export interface AuthResponse extends Omit<User, "password"> {
    access_token: string
}
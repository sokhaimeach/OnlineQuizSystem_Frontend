export interface Class {
    id: string
    teacher_id: string
    class_name: string
    description: string
    color: string
    createdAt: string
    updatedAt: string
    total_student: number
    assignment_count: number
    active_assignment_count: number
}

export interface ClassInfo {
    id: string
    class_name: string
    description: string
    color: string
    teacher?: {
        id?: string
        school_name?: string
        user?: {
            first_name?: string
            last_name?: string
            avatar_url?: string
        }
    }
    subject?: {
        id?: string
        name?: string
        subject_name?: string
    }
}

export interface CreateClassPayload {
    class_name: string
    description: string
    color: string
}

export interface JoinedClass extends Partial<Class> {
    id: string
    class_name: string
    subject?: { id?: string; name?: string; subject_name?: string } | string | null
    teacher?: {
        school_name?: string
        user?: { first_name?: string; last_name?: string }
        first_name?: string
        last_name?: string
    }
    total_assignments?: number
    total_quizzes?: number
}

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

export interface CreateClassPayload {
    class_name: string
    description: string
    color: string
}

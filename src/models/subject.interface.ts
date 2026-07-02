export interface Subject {
    id: string
    teacher_id?: string
    subject_name: string
    description: string
    quiz_count: number
}

export interface CreateSubjectPayload {
    subject_name: string
    description?: string
}

export interface SubjectsPage {
    data: {
        subjects: Subject[]
        unassigned_quiz_count: number
    }
    meta: {
        totalItems: number
        totalPages: number
        currentPage: number
        limit: number
    }
}

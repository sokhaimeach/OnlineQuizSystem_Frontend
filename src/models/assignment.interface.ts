export type AssignmentStatus = "DRAFT" | "PUBLISHED" | "CLOSED";

export interface Assignment {
    id: string;
    quiz_id: string;
    class_id: string;
    title: string;
    type: 'QUIZ' | 'HOMEWORK';
    instructions: string;
    start_date: string;
    due_date: string;
    allow_late_submission: boolean;
    status: AssignmentStatus;
    total_score: string;
    total_question: number;
}

export interface CreateAssignment {
    quiz_id: string;
    class_id: string;
    title: string;
    type: 'QUIZ' | 'HOMEWORK';
    instructions: string;
    start_date: string;
    due_date: string;
    allow_late_submission: boolean;
    status: AssignmentStatus;
}

export type StudentAssignmentStatus = "ACTIVE" | "UPCOMING" | "COMPLETED" | "OVERDUE"

export interface StudentAssignmentListItem {
    id: string
    title: string
    instructions: string
    type: "QUIZ" | "HOMEWORK"
    start_date: string
    due_date: string
    allow_late_submission: boolean
    total_score: string
    total_question: number
    status: StudentAssignmentStatus
    class: {
        id: string
        class_name: string
    } | null
    quiz: {
        id: string
        title: string
        duration_minutes: number
    } | null
    attempt: {
        id: string
        status: "IN_PROGRESS" | "SUBMITTED" | "TIMEOUT"
        score: string | null
        correct_count: number
        wrong_count: number
        started_at: string
        submitted_at: string | null
    } | null
}

export interface StudentDashboardData {
    total_classes: number
    active_assignments: number
    completed_assignments: number
    average_score: number
    recent_attempts: {
        id: string
        quiz_title: string
        class_name: string
        score: number | null
        total_score: string
        submitted_at: string
        status: "IN_PROGRESS" | "SUBMITTED" | "TIMEOUT"
        assignment_id: string
    }[]
    upcoming_assignments: DashboardAssignmentItem[]
    active_assignments_list: DashboardActiveAssignment[]
}

export interface DashboardAssignmentItem {
    id: string
    title: string
    start_date: string
    due_date: string
    status: "ACTIVE" | "UPCOMING"
    class: { id: string; class_name: string } | null
    quiz: { id: string; title: string; duration_minutes: number } | null
}

export interface DashboardActiveAssignment extends DashboardAssignmentItem {
    total_question: number
    remaining_seconds: number
    attempt: { id: string; status: "IN_PROGRESS" } | null
}

export interface StudentPerformanceData {
    average_score: number
    highest_score: number
    lowest_score: number
    pass_rate: number
    quizzes_completed: number
    quizzes_remaining: number
}

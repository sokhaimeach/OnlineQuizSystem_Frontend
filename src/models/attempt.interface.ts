import type { AssignmentWithQuizResult } from "./assignment.interface";
import type { QuestionWithOptionsAndAnswers, Quiz } from "./quiz.interface";

export interface Attempt {
    id: string;
    assignment_id: string;
    student_id: string;
    guest_name: string | null;
    attempt_number: number;
    access_token: string;
    status: "IN_PROGRESS" | "SUBMITTED" | "TIMEOUT";
    total_score: number | null;
    started_at: Date | null;
    submitted_at: Date | null;
}

export interface CreateAttemptPayload {
    assignment_id: string
    guest_name?: string
}

export interface AttemptWithAssignmentResult extends Attempt {
    assignment: AssignmentWithQuizResult
}

export interface DoQuizAttempt extends Omit<Attempt, "total_score" | "started_at" | "submitted_at"> {
    total_score: string
    correct_count: number
    wrong_count: number
    question_order: string[]
    started_at: string
    submitted_at: string | null
    assignment: AssignmentWithQuizResult & {
        total_score: string
        passing_score: number
        total_question: number
    }
}

export interface ClassAttempt {
    id: string
    attempt_number: number | null
    total_score: string
    correct_count: number
    wrong_count: number
    started_at: string
    submitted_at: string | null
    status?: Attempt["status"]
    assignment: {
        id: string
        title: string
        type: "QUIZ" | "HOMEWORK"
        quiz: Pick<Quiz, "id" | "title">
        class: {
            id: string
            class_name: string
            teacher: { school_name?: string }
        }
    }
}

export interface ResultUnavailable {
    result_available: false
    available_at: string
    attempt: Attempt
    assignment: { id: string; title: string }
    quiz: Quiz
}

export interface ResultSummary {
    result_available: true
    show_correct_answers: false
    score: string
    total_score: string
    total_question: number
    correct_count: number
    wrong_count: number
    passing_score: number
    attempt: Attempt
    assignment: { id: string; title: string }
    quiz: Quiz
}

export interface ResultWithAnswers extends DoQuizAttempt {
    result_available: true
    show_correct_answers: true
    assignment: DoQuizAttempt["assignment"] & {
        quiz: Quiz & { questions: QuestionWithOptionsAndAnswers[] }
    }
}

export type QuizResult = ResultUnavailable | ResultSummary | ResultWithAnswers

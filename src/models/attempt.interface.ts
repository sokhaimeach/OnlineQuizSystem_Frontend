import type { QuestionWithOptionsAndAnswers, Quiz, QuestionWithOptions } from "./quiz.interface";

export interface AttemptState {
    id: string | null;
    status: string | null;
    canStart: boolean;
    canContinue: boolean;
    canSubmit: boolean;
    canViewResult: boolean;
    redirect: string | null;
    message: string;
    attempt_id?: string;
    access_token?: string;
}

export type AttemptStatus = "IN_PROGRESS" | "SUBMITTED" | "TIMEOUT";

export interface Attempt {
    id: string;
    assignment_id: string;
    student_id: string | null;
    guest_name: string | null;
    attempt_number: number;
    access_token: string;
    status: AttemptStatus;
    total_score: number | null;
    correct_count?: number;
    wrong_count?: number;
    started_at: Date | null;
    submitted_at: Date | null;
}

export interface AssignmentAttemptListItem {
    id: string;
    assignment_id: string;
    student_id: string | null;
    guest_name: string | null;
    attempt_number: number | null;
    status: AttemptStatus;
    total_score: number | string | null;
    started_at: Date | string | null;
    submitted_at: Date | string | null;
    student?: AssignmentAttemptStudent | null;
    assignment?: {
        id: string;
        title: string;
        total_score: number | string | null;
    };
}

export interface AssignmentAttemptStudent {
    id: string;
    student_code?: string | null;
    full_name: string;
    email?: string | null;
    avatar_url?: string | null;
}

export interface CreateAttemptPayload {
    assignment_id: string
    guest_name?: string
}

export interface QuizSessionData {
    status: string;
    canSubmit: boolean;
    canViewResult: boolean;
    redirect?: string | null;
    message?: string;
    assignment: {
        id: string;
        title: string;
        total_score: string;
        total_question: number;
        due_date: string;
        allow_late_submission: boolean;
        class: { id: string; class_name: string } | null;
        quiz: {
            id: string;
            title: string;
            description: string;
            duration_minutes: number;
            total_score: string;
            passing_score: number;
            questions: QuestionWithOptions[];
        };
    };
    started_at: string;
    question_order: string[];
}

export interface AttemptWithAssignmentResult extends Attempt {
    assignment: AssignmentWithQuizResult
}

interface AssignmentWithQuizResult {
    id: string;
    title: string;
    total_score: string;
    passing_score: number;
    total_question: number;
    quiz: QuizWithQuestionsAndAnswersInternal;
}

interface QuizWithQuestionsAndAnswersInternal {
    id: string;
    title: string;
    description: string;
    total_score: string;
    passing_score: number;
    questions: QuestionWithOptionsAndAnswers[];
}

export interface DoQuizAttempt {
    id: string;
    total_score: string;
    correct_count: number;
    wrong_count: number;
    question_order: string[];
    started_at: string;
    submitted_at: string | null;
    student_id: string | null;
    guest_name: string | null;
    access_token: string;
    status: AttemptStatus;
    assignment: {
        id: string;
        title: string;
        total_score: string;
        passing_score: number;
        total_question: number;
        due_date: string;
        quiz: {
            id: string;
            title: string;
            description: string;
            total_score: string;
            passing_score: number;
            show_result_immediately: boolean;
            show_correct_answers: boolean;
            questions: QuestionWithOptionsAndAnswers[];
        };
    };
}

export interface ClassAttempt {
    id: string
    attempt_number: number | null
    total_score: string
    correct_count: number
    wrong_count: number
    started_at: string
    submitted_at: string | null
    status?: AttemptStatus
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
    attempt: {
        id: string;
        student_id: string | null;
        guest_name: string | null;
        attempt_number: number;
        access_token: string;
        status: AttemptStatus;
        started_at: string;
        submitted_at: string | null;
    }
    assignment: { id: string; title: string; due_date: string }
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
    attempt: {
        id: string;
        student_id: string | null;
        guest_name: string | null;
        attempt_number: number;
        access_token: string;
        status: AttemptStatus;
        started_at: string;
        submitted_at: string | null;
    }
    assignment: { id: string; title: string; due_date: string }
    quiz: Quiz
}

export interface ResultWithAnswers {
    result_available: true
    show_correct_answers: true
    id: string;
    total_score: string;
    correct_count: number;
    wrong_count: number;
    question_order: string[];
    started_at: string;
    submitted_at: string | null;
    student_id: string | null;
    guest_name: string | null;
    status: AttemptStatus;
    assignment: {
        id: string;
        title: string;
        total_score: string;
        passing_score: number;
        total_question: number;
        due_date: string;
        quiz: Quiz & { questions: QuestionWithOptionsAndAnswers[] }
    }
}

export interface TimeoutResult {
    timeout: true
    result_available: true
    status: "TIMEOUT"
    timeout_reason: string
    assignment: {
        id: string
        title: string
        due_date: string
        total_score: string
        total_question: number
        allow_late_submission: boolean
        class: { id: string; class_name: string } | null
    }
    quiz: {
        id: string
        title: string
        duration_minutes: number
    }
    attempt: {
        id: string
        student_id: string | null
        guest_name: string | null
        status: "TIMEOUT"
        started_at: string
        submitted_at: string | null
    }
}

export type QuizResult = TimeoutResult | ResultUnavailable | ResultSummary | ResultWithAnswers

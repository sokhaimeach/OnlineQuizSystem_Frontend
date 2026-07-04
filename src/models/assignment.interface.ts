import type { Quiz, QuizWithQuestionsAndAnswers } from "./quiz.interface";

export type AssignmentStatus = "DRAFT" | "PUBLISHED" | "CLOSED" | "ARCHIVED";

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

export interface AssignmentWithQuiz extends Assignment {
    quiz: Quiz;
    class?: string;
}

export interface AssignmentWithQuizResult extends Assignment {
    quiz: QuizWithQuestionsAndAnswers
}

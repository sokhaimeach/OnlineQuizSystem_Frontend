import type { Assignment } from "./assignment.interface";
import type { Attempt } from "./attempt.interface";
import type { QuizWithQuestionsAndAnswers } from "./quiz.interface";
import type { Class } from "./class.interface";
import type { User } from "./user.interface";

export interface Student {
    id?: string;
    user_id: string;
    phone_number: string;
    date_of_birth: string;
    parent_phone_number: string;
}

export interface StudentWithUser extends Student {
    user: User;
}

export interface StudentDetails extends StudentWithUser {
    classes: Class[];
    stats: {
        total_quizzes_completed: number;
        average_score: number;
        highest_score: number;
        lowest_score: number;
    };
}

export interface StudentAttemptsHistory {
    id: string;
    student_id: string;
    assignment_id: string;
    attempt_number: number | null;
    total_score: number | null;
    started_at: Date | null;
    submitted_at: Date | null;
    status: Attempt["status"];
    percentage?: number | null;
    duration_seconds?: number | null;
    assignment: {
        id: string;
        title: string;
        type: AssignmentType;
        quiz: {
            id: string;
            title: string;
        };
        class: {
            id: string;
            class_name: string;
        };
    };
}

export type AssignmentWithQuiz = Omit<Assignment, "quiz"> & {
    quiz: QuizWithQuestionsAndAnswers;
    class?: string;
}

export interface StudentAttemptsDetails extends Attempt {
    student?: StudentWithUser | null
    assignment: AssignmentWithQuiz
}

export type AssignmentType = "QUIZ" | "HOMEWORK";

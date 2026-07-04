import type { AssignmentWithQuizResult } from "./assignment.interface";

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
    guest_name: string
}

export interface AttemptWithAssignmentResult extends Attempt {
    assignment: AssignmentWithQuizResult
}

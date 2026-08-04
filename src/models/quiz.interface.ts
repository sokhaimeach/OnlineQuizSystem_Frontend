export type QuizStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Quiz {
    id: string;
    teacher_id: string;
    subject_id: string | null;
    title: string;
    description: string;
    duration_minutes: number;
    is_public: boolean;
    passing_score: number;
    total_score: number | string;
    show_result_immediately: boolean;
    show_correct_answers: boolean;
    randomize_questions: boolean;
    status: QuizStatus;
    createdAt?: string;
    updatedAt?: string;
}

export interface QuizListItem extends Quiz {
    question_count: number | string;
    assignment_count?: number | string;
}

export interface QuizOption {
    id: string;
    title: string;
    status: QuizStatus;
    subject_name?: string;
    description?: string;
    question_count?: number | string;
    duration_minutes?: number;
    difficulty_level?: string;
}

export interface QuizzesPage {
    data: QuizListItem[];
    meta: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };
}

export interface Question {
    id?: string;
    quiz_id?: string;
    question_text: string;
    question_type: QuestionType;
    score: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface Option {
    id?: string;
    question_id?: string;
    option_text: string;
    is_correct?: boolean;
}

export interface QuestionWithOptions extends Question {
    options: Option[];
}

export interface CreateQuiz extends Omit<
    Quiz,
    "id" | "teacher_id" | "subject_id" | "total_score" | "status"
> {
    subject_id?: string;
    questions: QuestionWithOptions[];
}

export type UpdateQuizPayload = Pick<
    Quiz,
    | "title"
    | "description"
    | "duration_minutes"
    | "is_public"
    | "passing_score"
    | "show_result_immediately"
    | "show_correct_answers"
    | "randomize_questions"
> & {
    subject_id: string | null;
    status?: QuizStatus;
}

export interface AddQuestionsPayload {
    questions: QuestionWithOptions[];
}

export type UpdateQuestionPayload = Omit<
    QuestionWithOptions,
    "id" | "createdAt" | "updatedAt"
>

export interface QuizListParams {
    page: number;
    limit: number;
    search?: string;
    status?: QuizStatus;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface QuizWithQuestions extends Quiz {
    questions: QuestionWithOptions[];
}

export interface QuizWithQuestionsAndAnswers extends QuizWithQuestions {
    questions: QuestionWithOptionsAndAnswers[];
}

export interface QuestionWithOptionsAndAnswers extends QuestionWithOptions {
    answers: QuestionAnswer[];
}

export type QuestionType = "SINGLE_CHOICE" | "MULTIPLE_CHOICE";

export interface QuestionAnswer {
    id: string;
    attempt_id: string;
    question_id: string;
    selected_option_id: string;
    score_earned?: number | null;
    is_correct?: boolean;
    selected_option?: Option;
}

interface AnswerPayload {
    question_id: string
    selected_option_id: string[]
}

export interface SubmitQuizPayload {
    answers: AnswerPayload[]
}

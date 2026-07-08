export interface AnalyticsSummary {
    total_classes: number;
    total_students: number;
    total_quizzes: number;
    total_assignments: number;
    active_assignments: number;
    total_attempts: number;
    average_score: number;
    completion_rate: number;
}

export interface ClassPerformance {
    class_id: string;
    class_name: string;
    total_attempts: number;
    total_students: number;
    average_score: number;
}

export interface QuizPerformance {
    assignment_id: string;
    title: string;
    total_attempts: number;
    completed_attempts: number;
    completion_rate: number;
    average_score: number;
}

export interface TopPerformer {
    student_id: string;
    name: string;
    avatar_url: string | null;
    average_score: number;
    total_attempts: number;
}

export interface RecentActivity {
    type: string;
    description: string;
    class_name: string;
    timestamp: string;
}

export interface ScoreDistribution {
    range: string;
    count: number;
    percentage: number;
}

export interface WeeklySubmission {
    date: string;
    count: number;
}

export interface TeacherAnalytics {
    summary: AnalyticsSummary;
    class_performance: ClassPerformance[];
    quiz_performance: QuizPerformance[];
    top_performers: TopPerformer[];
    recent_activities: RecentActivity[];
    score_distribution: ScoreDistribution[];
    weekly_submissions: WeeklySubmission[];
}

export interface UpcomingDeadline {
    id: string;
    title: string;
    class_name: string;
    due_date: string;
    due_label: string;
    status: "warning" | "info" | "danger";
    total_students: number;
    submitted_count: number;
}

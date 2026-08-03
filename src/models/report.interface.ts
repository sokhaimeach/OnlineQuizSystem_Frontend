// Report domain types for the teacher reports module.

export type PerformanceLevel =
  | "EXCELLENT"
  | "GOOD"
  | "AVERAGE"
  | "NEEDS_IMPROVEMENT"
  | "CRITICAL"
  | "NO_DATA";

export type RiskSeverity = "warning" | "critical";

export interface RiskReason {
  code: string;
  severity: RiskSeverity;
  message: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// ---- Overview ----

export interface OverviewSummary {
  total_students: number;
  total_classes: number;
  total_subjects: number;
  total_assignments: number;
  total_attempts: number;
  average_score: number | null;
  completion_rate: number;
  at_risk_count: number;
  needs_improvement_count: number;
  critical_count: number;
}

export interface LevelDistribution {
  level: PerformanceLevel;
  count: number;
}

export interface WeeklySubmissions {
  week_start: string;
  count: number;
}

export interface WeakSubject {
  subject_id: string;
  subject_name: string;
  average_score: number | null;
  students?: number;
  attempts?: number;
}

export interface ClassAverage {
  class_id: string;
  class_name: string;
  average_score: number | null;
  total_students: number;
}

export interface RankedStudent {
  student_id: string;
  name: string;
  avatar_url: string | null;
  email?: string;
  class_names: string[];
  average_score: number | null;
  completed_count: number;
  performance_level: PerformanceLevel;
  is_at_risk?: boolean;
}

export interface AtRiskStudentSummary {
  student_id: string;
  name: string;
  avatar_url: string | null;
  class_names: string[];
  performance_level: PerformanceLevel;
  average_score: number | null;
  risk_summary: string;
}

export interface ReportsOverview {
  summary: OverviewSummary;
  distribution: LevelDistribution[];
  weekly_submissions: WeeklySubmissions[];
  weak_subjects: WeakSubject[];
  class_averages: ClassAverage[];
  top_students: RankedStudent[];
  bottom_students: RankedStudent[];
  at_risk_students: AtRiskStudentSummary[];
}

// ---- Student performance list ----

export interface StudentPerformanceRow {
  student_id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
  class_ids: string[];
  class_names: string[];
  assigned_count: number;
  expected_count: number;
  completed_count: number;
  missing_count: number;
  attempts_count: number;
  timed_out_count: number;
  average_score: number | null;
  highest_score: number | null;
  lowest_score: number | null;
  passed_count: number;
  failed_count: number;
  completion_rate: number;
  assignment_completion_rate: number;
  average_time_used: number | null;
  latest_activity: string | null;
  performance_level: PerformanceLevel;
  is_at_risk: boolean;
  risk_reason_count: number;
}

export interface StudentPerformanceResponse {
  data: StudentPerformanceRow[];
  meta: PaginationMeta;
}

// ---- Student detail ----

export interface SubjectBreakdown {
  subject_id: string | null;
  subject_name: string;
  assigned_count: number;
  completed_count: number;
  attempts_count: number;
  passed_count: number;
  failed_count: number;
  average_score: number | null;
  highest_score: number | null;
  lowest_score: number | null;
  performance_level: PerformanceLevel;
}

export interface QuizHistoryItem {
  assignment_id: string;
  quiz_id: string;
  title: string;
  subject_id: string | null;
  class_id: string;
  class_name: string | null;
  total_score: number;
  passing_score: number;
  total_question: number;
  attempt_id: string;
  attempt_status: string;
  score: number;
  percentage: number;
  passed: boolean;
  correct_count: number;
  wrong_count: number;
  submitted_at: string | null;
  attempts_count: number;
}

export interface TopicPerformance {
  topic_id: string | null;
  topic_name: string;
  question_count: number;
  answered_count: number;
  skipped_count: number;
  correct_count: number;
  wrong_count: number;
  correct_rate: number;
  wrong_rate: number;
  skipped_rate: number;
  average_score: number;
}

export interface TimelinePoint {
  week_start: string;
  label: string;
  average_score: number | null;
  attempts: number;
}

export interface TrendSignals {
  recent_average: number | null;
  previous_average: number | null;
  delta: number | null;
  signal: "IMPROVING" | "DECLINING" | "STABLE" | "NONE";
}

export interface AssignmentHistoryItem {
  assignment_id: string;
  title: string;
  type: string;
  class_id: string;
  class_name: string | null;
  subject_id: string | null;
  start_date: string | null;
  due_date: string | null;
  allow_late_submission: boolean;
  total_score: number;
  passing_score: number;
  total_question: number;
  status: "COMPLETED" | "IN_PROGRESS" | "UPCOMING" | "OVERDUE" | "ACTIVE";
  attempts: number;
  in_progress_count: number;
  best_attempt: {
    id: string;
    status: string;
    total_score: number;
    correct_count: number;
    wrong_count: number;
    started_at: string | null;
    submitted_at: string | null;
  } | null;
}

export interface RecentAttempt {
  id: string;
  assignment_id: string;
  status: string;
  total_score: number;
  correct_count: number;
  wrong_count: number;
  started_at: string | null;
  submitted_at: string | null;
  assignment: {
    id: string;
    title: string;
    type: string;
    total_score: number;
    passing_score: number;
    total_question: number;
  } | null;
  quiz: {
    id: string;
    title: string;
    subject_id: string | null;
  } | null;
  class: {
    id: string;
    class_name: string;
  } | null;
}

export interface StrengthWeakness {
  type: "subject" | "quiz" | "topic";
  label: string;
  detail: string;
}

export interface StudentReport {
  profile: {
    student_id: string;
    name: string;
    email: string | null;
    avatar_url: string | null;
    gender: string | null;
    phone_number: string | null;
    date_of_birth: string | null;
    joined_at: string | null;
    class_names: string[];
  };
  statistics: {
    assigned_count: number;
    completed_count: number;
    missing_count: number;
    attempts_count: number;
    timed_out_count: number;
    average_score: number | null;
    highest_score: number | null;
    lowest_score: number | null;
    passed_count: number;
    failed_count: number;
    pass_rate: number;
    completion_rate: number;
    assignment_completion_rate: number;
    average_time_used: number | null;
    latest_activity: string | null;
    performance_level: PerformanceLevel;
  };
  subjects: SubjectBreakdown[];
  weak_topics: TopicPerformance[];
  timeline: TimelinePoint[];
  trend: TrendSignals;
  quizzes: QuizHistoryItem[];
  assignment_history: AssignmentHistoryItem[];
  recent_attempts: RecentAttempt[];
  strengths: StrengthWeakness[];
  weaknesses: StrengthWeakness[];
  recommendations: string[];
  risk: {
    is_at_risk: boolean;
    reasons: RiskReason[];
    summary: string;
  };
  class_rank: ClassRank[];
  weakest_subject: WeakestSubjectSummary | null;
  strongest_subject: StrongestSubjectSummary | null;
  most_failed_quiz: MostFailedQuizForStudent | null;
  meta: {
    topics_available: number;
    has_topic_data: boolean;
  };
}

// ---- At risk / improvement ----

export interface AtRiskStudentRow {
  student_id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
  class_ids: string[];
  class_names: string[];
  performance_level: PerformanceLevel;
  average_score: number | null;
  completion_rate: number;
  failed_count: number;
  timed_out_count: number;
  missing_count: number;
  latest_activity: string | null;
  reasons: RiskReason[];
  recommendations: string[];
  risk_summary: string;
}

export interface AtRiskStudentsResponse {
  data: AtRiskStudentRow[];
  meta: PaginationMeta;
}

export interface MostFailedQuiz {
  assignment_id: string;
  title: string;
  passed: number;
  failed: number;
}

export interface ImprovementReport {
  summary: {
    total_students: number;
    at_risk_count: number;
    improving: number;
    declining: number;
    stable: number;
  };
  distribution: LevelDistribution[];
  at_risk_students: AtRiskStudentSummary[];
  weak_subjects: WeakSubject[];
  most_failed_quizzes: MostFailedQuiz[];
}

// ---- Subjects ----

export interface SubjectStatistics {
  subject_id: string;
  subject_name: string;
  description: string | null;
  quiz_count: number;
  assignment_count: number;
  total_students: number;
  attempted_students: number;
  completed_count: number;
  assigned_count: number;
  attempts_count: number;
  passed_count: number;
  failed_count: number;
  average_score: number | null;
  pass_rate: number;
  fail_rate: number;
  difficulty_rating: number | null;
  completion_rate: number;
  average_completion_time: number | null;
}

export interface SubjectStudent {
  student_id: string;
  name: string;
  avatar_url: string | null;
  email: string | null;
  assigned_count: number;
  completed_count: number;
  passed_count: number;
  failed_count: number;
  average_score: number | null;
  performance_level: PerformanceLevel | null;
}

export interface QuestionPerformance {
  question_id: string;
  question_text: string;
  topic_id: string | null;
  topic_name: string | null;
  presented_count: number;
  answered_count: number;
  skipped_count: number;
  correct_count: number;
  wrong_count: number;
  correct_rate: number;
  wrong_rate: number;
  skipped_rate: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

export interface DifficultyDistribution {
  label: string;
  count: number;
  percentage: number;
}

export interface HistoricalPerformance {
  week_start: string;
  average_score: number | null;
  attempts: number;
}

export interface SubjectReport {
  subject: {
    id: string;
    subject_name: string;
    description: string | null;
    quiz_count: number;
  };
  statistics: SubjectStatistics;
  top_students: SubjectStudent[];
  students_needing_improvement: SubjectStudent[];
  weak_questions: QuestionPerformance[];
  most_incorrect_questions: QuestionPerformance[];
  most_skipped_questions: QuestionPerformance[];
  question_difficulty: DifficultyDistribution[];
  topic_analysis: TopicPerformance[];
  historical_performance: HistoricalPerformance[];
}

export interface SubjectAnalyticsResponse {
  data: SubjectStatistics[];
  meta: PaginationMeta;
}

// ---- Class ----

export interface ClassReportStudent {
  student_id: string;
  name: string;
  avatar_url: string | null;
  email: string | null;
  average_score: number | null;
  completed_count: number;
  performance_level: PerformanceLevel;
}

export interface ClassReport {
  class: {
    id: string;
    class_name: string;
    color: string | null;
    description: string | null;
    total_students: number;
    total_assignments: number;
  };
  statistics: {
    class_average: number | null;
    pass_rate: number;
    fail_rate: number;
    assignment_completion_rate: number;
    completed_count: number;
    expected_count: number;
    average_completion_time: number | null;
    total_attempts: number;
  };
  highest_student: ClassReportStudent | null;
  lowest_student: ClassReportStudent | null;
  top_students: ClassReportStudent[];
  bottom_students: ClassReportStudent[];
  student_distribution: LevelDistribution[];
  most_difficult_subject: WeakSubject | null;
  subject_averages: WeakSubject[];
  most_failed_quiz: MostFailedQuiz | null;
  most_difficult_question: QuestionPerformance | null;
}

// ---- Report query filters ----

export interface ReportQuery {
  page?: number;
  limit?: number;
  sort_by?: string;
  order?: "ASC" | "DESC";
  search?: string;
  class_id?: string;
  subject_id?: string;
  quiz_id?: string;
  assignment_id?: string;
  level?: string;
  result?: string;
  completion?: string;
  has_timeout?: string;
  has_missing?: string;
  date_from?: string;
  date_to?: string;
}

// ---- Teacher dashboard improvement ----

export interface WeakestSubjectSummary {
  subject_id: string | null;
  subject_name: string;
  average_score: number | null;
  failed_count: number;
  timed_out_count: number;
  completion_rate: number;
  need_score: number;
}

export interface StrongestSubjectSummary {
  subject_id: string | null;
  subject_name: string;
  average_score: number | null;
  completed_count: number;
  passed_count: number;
  need_score: number;
}

export interface ClassRank {
  class_id: string;
  class_name: string;
  rank: number;
  total_ranked: number;
}

export interface MostFailedQuizForStudent {
  assignment_id: string;
  quiz_id: string;
  title: string;
  percentage: number;
  attempts_count: number;
}

export interface DashboardStudentRequiring {
  student_id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
  class_names: string[];
  average_score: number | null;
  performance_level: PerformanceLevel;
  quick_status: string;
  missing_count: number;
  timed_out_count: number;
  failed_count: number;
  completion_rate: number;
  latest_activity: string | null;
  weakest_subject: WeakestSubjectSummary | null;
  risk_summary: string;
  reason_codes: string[];
  trend: TrendSignals["signal"];
}

export interface SubjectHighFailure {
  subject_id: string;
  subject_name: string;
  average_score: number | null;
  fail_rate: number;
  failed_count: number;
  attempts_count: number;
}

export interface MostImprovedStudent {
  student_id: string;
  name: string;
  avatar_url: string | null;
  delta: number | null;
  recent_average: number | null;
}

export interface DashboardInsightCards {
  at_risk_count: number;
  critical_count: number;
  needs_improvement_count: number;
  missing_assignments_count: number;
  timeouts_count: number;
  inactive_count: number;
  subjects_high_failure: SubjectHighFailure[];
  most_improved: MostImprovedStudent[];
  lowest_class: ClassAverage | null;
}

export interface DashboardImprovement {
  students_requiring_improvement: DashboardStudentRequiring[];
  insight_cards: DashboardInsightCards;
}

// ---- Student learning progress ----

export interface StudentSubjectProgress {
  subject_id: string | null;
  subject_name: string;
  average_score: number | null;
  pass_rate: number;
  completed_count: number;
  assigned_count: number;
  failed_count: number;
  timed_out_count: number;
  completion_rate: number;
  performance_level: PerformanceLevel;
  status: string;
  need_score: number;
}

export interface StudentRecentPerformance {
  assignment_id: string;
  quiz_id: string;
  quiz_title: string;
  subject_name: string | null;
  class_name: string | null;
  percentage: number;
  passed: boolean;
  submitted_at: string | null;
}

export interface StudentMissingAssignment {
  assignment_id: string;
  title: string;
  type: string;
  class_name: string | null;
  subject_id: string | null;
  subject_name: string | null;
  due_date: string | null;
}

export interface StudentProgress {
  overall: {
    average_score: number | null;
    highest_score: number | null;
    lowest_score: number | null;
    pass_rate: number;
    completion_rate: number;
    performance_level: PerformanceLevel;
    assigned_count: number;
    completed_count: number;
    missing_count: number;
    timed_out_count: number;
    attempts_count: number;
    latest_activity: string | null;
    trend: TrendSignals;
    summary: string;
  };
  weakest_subject: WeakestSubjectSummary | null;
  strongest_subject: StrongestSubjectSummary | null;
  subjects: StudentSubjectProgress[];
  recent_performance: StudentRecentPerformance[];
  missing_assignments: StudentMissingAssignment[];
  recommendations: string[];
  reasons: RiskReason[];
  is_at_risk: boolean;
}

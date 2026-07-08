import {
    BarChart3,
    TrendingUp,
    Users,
    Award,
    BookOpen,
    School,
    RefreshCw,
    Activity,
    AlertCircle,
    ClipboardList,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeacherAnalytics } from "@/hooks/api/useAnalytics";
import type { DashboardSection } from "@/components/app-sidebar";

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getDayLabel(dateStr: string) {
    const d = new Date(dateStr + "T00:00:00");
    return (
        dayLabels[d.getDay() === 0 ? 6 : d.getDay() - 1] || dayLabels[d.getDay()]
    );
}

function getInitials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

function timeAgo(dateStr: string) {
    const now = Date.now();
    const date = new Date(dateStr).getTime();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    return new Date(dateStr).toLocaleDateString();
}

interface AnalyticsViewProps {
    onNavigate?: (section: DashboardSection) => void;
}

function LoadingSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Analytics"
                description="Loading performance insights..."
                icon={BarChart3}
            />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-card rounded-md border border-border p-5 flex flex-col gap-4"
                    >
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-4 w-28" />
                        </div>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="bg-card rounded-md border border-border p-5">
                        <Skeleton className="h-5 w-40 mb-4" />
                        <Skeleton className="h-3 w-56 mb-4" />
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, j) => (
                                <Skeleton key={j} className="h-8 w-full" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ErrorState({
    message,
    onRetry,
}: {
    message: string;
    onRetry: () => void;
}) {
    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Analytics"
                description="Could not load analytics data"
                icon={BarChart3}
            />
            <div className="bg-card rounded-md border border-border p-8 flex flex-col items-center justify-center text-center gap-4">
                <div className="p-3 rounded-full bg-destructive/10">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="text-base font-semibold text-foreground">
                    Failed to load analytics
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">{message}</p>
                <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Retry
                </Button>
            </div>
        </div>
    );
}

function ClassPerformanceSection({
    data,
}: {
    data: { class_id: string; class_name: string; average_score: number }[];
}) {
    const colors = [
        "bg-violet-500",
        "bg-emerald-500",
        "bg-indigo-500",
        "bg-blue-500",
        "bg-amber-500",
        "bg-cyan-500",
    ];
    return (
        <div className="bg-card rounded-md border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-1">
                Class Performance
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
                Average score per class
            </p>
            {data.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                    No class performance data yet
                </p>
            ) : (
                <div className="flex flex-col gap-3">
                    {data.map((cls, idx) => (
                        <div key={cls.class_id} className="flex items-center gap-3">
                            <div
                                className={`h-2.5 w-2.5 rounded-full shrink-0 ${colors[idx % colors.length]}`}
                            />
                            <span className="text-xs text-foreground flex-1 min-w-0 truncate">
                                {cls.class_name}
                            </span>
                            <div className="flex items-center gap-2 shrink-0">
                                <Progress value={cls.average_score} className="h-1.5 w-20" />
                                <span className="text-xs font-semibold text-foreground w-8 text-right">
                                    {cls.average_score}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function WeeklySubmissionsSection({
    data,
}: {
    data: { date: string; count: number }[];
}) {
    const maxCount = Math.max(...data.map((w) => w.count), 1);
    return (
        <div className="bg-card rounded-md border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-1">
                Weekly Submissions
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
                Total quiz submissions per day this week
            </p>
            <div className="flex items-end gap-2 h-32">
                {data.map((w) => (
                    <div key={w.date} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[10px] text-muted-foreground">{w.count}</span>
                        <div
                            className="w-full rounded-t-sm bg-primary/80 hover:bg-primary transition-colors"
                            style={{ height: `${(w.count / maxCount) * 100}%` }}
                            title={`${w.count} submissions`}
                        />
                        <span className="text-[10px] text-muted-foreground">
                            {getDayLabel(w.date)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TopPerformersSection({
    data,
}: {
    data: {
        student_id: string;
        name: string;
        avatar_url: string | null;
        average_score: number;
        total_attempts: number;
    }[];
}) {
    return (
        <div className="bg-card rounded-md border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">
                Top Performers
            </h3>
            {data.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                    No student performance data yet
                </p>
            ) : (
                <div className="flex flex-col gap-3">
                    {data.map((student, idx) => (
                        <div key={student.student_id} className="flex items-center gap-3">
                            <span className="text-sm font-bold text-muted-foreground w-5 shrink-0 text-center">
                                {idx + 1}
                            </span>
                            <Avatar className="h-8 w-8 shrink-0">
                                <AvatarImage src={student.avatar_url || undefined} />
                                <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                                    {getInitials(student.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                    {student.name}
                                </p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <School className="h-3 w-3" />
                                    {student.total_attempts} attempt
                                    {student.total_attempts !== 1 ? "s" : ""}
                                </p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <Award className="h-3.5 w-3.5 text-amber-500" />
                                <span className="text-sm font-bold text-foreground">
                                    {student.average_score}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function QuizPerformanceSection({
    data,
}: {
    data: {
        assignment_id: string;
        title: string;
        completion_rate: number;
        average_score: number;
    }[];
}) {
    return (
        <div className="bg-card rounded-md border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">
                Quiz Performance
            </h3>
            {data.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                    No quiz data yet
                </p>
            ) : (
                <div className="flex flex-col gap-4">
                    {data.map((quiz) => (
                        <div key={quiz.assignment_id}>
                            <div className="flex justify-between items-center mb-1.5">
                                <div className="min-w-0 flex-1 mr-2">
                                    <p className="text-xs font-medium text-foreground truncate">
                                        {quiz.title}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                        Avg: {quiz.average_score}%
                                    </p>
                                </div>
                                <span className="text-xs font-semibold text-foreground shrink-0">
                                    {quiz.completion_rate}%
                                </span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${quiz.completion_rate === 100
                                            ? "bg-emerald-500"
                                            : quiz.completion_rate >= 75
                                                ? "bg-indigo-500"
                                                : quiz.completion_rate >= 50
                                                    ? "bg-amber-500"
                                                    : "bg-red-500"
                                        }`}
                                    style={{ width: `${quiz.completion_rate}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function ScoreDistributionSection({
    data,
}: {
    data: { range: string; count: number; percentage: number }[];
}) {
    return (
        <div className="bg-card rounded-md border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">
                Score Distribution
            </h3>
            {data.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                    No score data yet
                </p>
            ) : (
                <div className="flex flex-col gap-4">
                    {data.map((bucket) => (
                        <div key={bucket.range}>
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-xs font-medium text-foreground">
                                    {bucket.range}%
                                </span>
                                <span className="text-xs font-semibold text-foreground">
                                    {bucket.count} ({bucket.percentage}%)
                                </span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${bucket.range.startsWith("80") ||
                                            bucket.range.startsWith("100")
                                            ? "bg-emerald-500"
                                            : bucket.range.startsWith("60")
                                                ? "bg-indigo-500"
                                                : bucket.range.startsWith("40")
                                                    ? "bg-amber-500"
                                                    : "bg-red-500"
                                        }`}
                                    style={{ width: `${bucket.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function RecentActivitySection({
    data,
}: {
    data: {
        type: string;
        description: string;
        class_name: string;
        timestamp: string;
    }[];
}) {
    const activityIcons: Record<string, React.ElementType> = {
        submission: Activity,
    };

    return (
        <div className="bg-card rounded-md border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">
                Recent Activity
            </h3>
            {data.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                    No recent activity
                </p>
            ) : (
                <div className="flex flex-col gap-3">
                    {data.map((activity, idx) => {
                        const Icon = activityIcons[activity.type] || Activity;
                        return (
                            <div key={idx} className="flex gap-3">
                                <div className="mt-0.5 shrink-0">
                                    <Icon className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-foreground leading-snug">
                                        {activity.description}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                                        {activity.class_name && (
                                            <>
                                                <School className="h-3 w-3" />
                                                {activity.class_name} ·
                                            </>
                                        )}
                                        {timeAgo(activity.timestamp)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export function AnalyticsView({ onNavigate }: AnalyticsViewProps) {
    const { data, isLoading, isError, error, refetch, isFetching } =
        useTeacherAnalytics();

    if (isLoading) return <LoadingSkeleton />;

    if (isError) {
        return (
            <ErrorState
                message={
                    error instanceof Error
                        ? error.message
                        : "An unexpected error occurred. Please try again."
                }
                onRetry={() => refetch()}
            />
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Analytics"
                    description="Performance insights across all your classes"
                    icon={BarChart3}
                />
                <EmptyState
                    icon={BarChart3}
                    title="No analytics data yet"
                    description="Start creating quizzes and assignments to see performance insights here."
                    action={
                        onNavigate
                            ? {
                                label: "Create Quiz",
                                onClick: () => onNavigate("create-quiz"),
                            }
                            : undefined
                    }
                />
            </div>
        );
    }

    const {
        summary,
        class_performance,
        quiz_performance,
        top_performers,
        recent_activities,
        score_distribution,
        weekly_submissions,
    } = data;

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Analytics"
                description="Performance insights across all your classes"
                icon={BarChart3}
                action={{
                    label: isFetching ? "Refreshing..." : "Refresh",
                    icon: isFetching ? undefined : RefreshCw,
                    onClick: () => refetch(),
                }}
            />

            {/* Overview Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Overall Avg Score"
                    value={`${summary.average_score}%`}
                    icon={Award}
                    colorClass="text-emerald-600 dark:text-emerald-400"
                    bgClass="bg-emerald-50 dark:bg-emerald-950"
                />
                <StatCard
                    label="Total Students"
                    value={summary.total_students}
                    icon={Users}
                    colorClass="text-indigo-600 dark:text-indigo-400"
                    bgClass="bg-indigo-50 dark:bg-indigo-950"
                />
                <StatCard
                    label="Completion Rate"
                    value={`${summary.completion_rate}%`}
                    icon={TrendingUp}
                    colorClass="text-blue-600 dark:text-blue-400"
                    bgClass="bg-blue-50 dark:bg-zinc-800"
                />
                <StatCard
                    label="Quizzes Graded"
                    value={summary.total_attempts}
                    icon={BookOpen}
                    colorClass="text-violet-600 dark:text-indigo-400"
                    bgClass="bg-violet-50 dark:bg-zinc-800"
                />
            </div>

            {/* Additional Summary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard
                    label="Total Classes"
                    value={summary.total_classes}
                    icon={School}
                    colorClass="text-amber-600 dark:text-amber-400"
                    bgClass="bg-amber-50 dark:bg-amber-950"
                />
                <StatCard
                    label="Total Assignments"
                    value={summary.total_assignments}
                    icon={ClipboardList}
                    colorClass="text-cyan-600 dark:text-cyan-400"
                    bgClass="bg-cyan-50 dark:bg-cyan-950"
                />
                <StatCard
                    label="Total Quizzes"
                    value={summary.total_quizzes}
                    icon={BookOpen}
                    colorClass="text-rose-600 dark:text-rose-400"
                    bgClass="bg-rose-50 dark:bg-rose-950"
                />
                <StatCard
                    label="Total Attempts"
                    value={summary.total_attempts}
                    icon={Activity}
                    colorClass="text-orange-600 dark:text-orange-400"
                    bgClass="bg-orange-50 dark:bg-orange-950"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WeeklySubmissionsSection data={weekly_submissions} />
                <ClassPerformanceSection data={class_performance} />
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopPerformersSection data={top_performers} />
                <QuizPerformanceSection data={quiz_performance} />
            </div>

            {/* Score Distribution + Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ScoreDistributionSection data={score_distribution} />
                <RecentActivitySection data={recent_activities} />
            </div>
        </div>
    );
}

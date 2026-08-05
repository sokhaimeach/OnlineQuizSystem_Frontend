import {
  BarChart3,
  Users,
  BookOpen,
  School,
  Award,
  AlertTriangle,
  ClipboardList,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/EmptyState";
import {
  ReportCard,
  ReportErrorBlock,
  ReportLoadingBlock,
} from "@/components/teacher/reports/ReportBlocks";
import { MiniBarChart, ScoreBar } from "@/components/teacher/reports/ReportCharts";
import { PerformanceLevelBadge } from "@/components/teacher/reports/PerformanceLevelBadge";
import { useReportsOverview } from "@/hooks/api/useReports";
import type { DashboardSection } from "@/components/app-sidebar";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function levelVariantColor(level: string) {
  switch (level) {
    case "EXCELLENT":
      return "bg-emerald-500";
    case "GOOD":
      return "bg-indigo-500";
    case "AVERAGE":
      return "bg-blue-500";
    case "NEEDS_IMPROVEMENT":
      return "bg-amber-500";
    case "CRITICAL":
      return "bg-red-500";
    default:
      return "bg-muted";
  }
}

export function ReportsOverviewView({
  onNavigate,
}: {
  onNavigate?: (section: DashboardSection) => void;
}) {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useReportsOverview();

  if (isLoading) {
    return (
      <ReportLoadingBlock
        title="Reports"
        description="Loading your performance overview..."
        icon={BarChart3}
      />
    );
  }

  if (isError) {
    return (
      <ReportErrorBlock
        title="Reports"
        message={
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again."
        }
        onRetry={() => refetch()}
      />
    );
  }

  if (!data) return null;

  const { summary, distribution, weekly_submissions, weak_subjects, class_averages, top_students, bottom_students, at_risk_students } = data;
  const hasReportData =
    summary.total_students > 0 ||
    summary.total_classes > 0 ||
    summary.total_subjects > 0 ||
    summary.total_assignments > 0 ||
    summary.total_attempts > 0 ||
    weekly_submissions.length > 0 ||
    weak_subjects.length > 0 ||
    top_students.length > 0 ||
    at_risk_students.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Reports"
        description="Student performance and subject improvement analytics"
        icon={BarChart3}
        action={{
          label: isFetching ? "Refreshing..." : "Refresh",
          icon: isFetching ? undefined : RefreshCw,
          onClick: () => refetch(),
        }}
      />

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Overall Average Score"
          value={summary.average_score === null ? "—" : `${summary.average_score}%`}
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
          label="At-Risk Students"
          value={summary.at_risk_count}
          icon={AlertTriangle}
          colorClass={
            summary.at_risk_count > 0
              ? "text-amber-600 dark:text-amber-400"
              : "text-emerald-600 dark:text-emerald-400"
          }
          bgClass={
            summary.at_risk_count > 0
              ? "bg-amber-50 dark:bg-amber-950"
              : "bg-emerald-50 dark:bg-emerald-950"
          }
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total Classes"
          value={summary.total_classes}
          icon={School}
          colorClass="text-violet-600 dark:text-violet-400"
          bgClass="bg-violet-50 dark:bg-violet-950"
        />
        <StatCard
          label="Total Subjects"
          value={summary.total_subjects}
          icon={BookOpen}
          colorClass="text-cyan-600 dark:text-cyan-400"
          bgClass="bg-cyan-50 dark:bg-cyan-950"
        />
        <StatCard
          label="Assignments"
          value={summary.total_assignments}
          icon={ClipboardList}
          colorClass="text-rose-600 dark:text-rose-400"
          bgClass="bg-rose-50 dark:bg-rose-950"
        />
        <StatCard
          label="Attempts Graded"
          value={summary.total_attempts}
          icon={BarChart3}
          colorClass="text-orange-600 dark:text-orange-400"
          bgClass="bg-orange-50 dark:bg-orange-950"
        />
      </div>

      {!hasReportData ? (
        <div className="bg-card rounded-md border border-border">
          <EmptyState
            icon={BarChart3}
            title="No reports available yet."
            description="Create your first quiz or assignment to start seeing analytics."
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
      ) : (
        <>
      {/* Level distribution + weekly submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportCard
          title="Performance Levels"
          subtitle="How students are distributed across performance levels"
        >
          {distribution.every((d) => d.count === 0) ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No student performance data yet
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {distribution
                .filter((d) => d.level !== "NO_DATA")
                .map((d) => {
                  const maxCount = Math.max(
                    ...distribution.map((x) => x.count),
                    1,
                  );
                  return (
                    <div key={d.level} className="flex items-center gap-3">
                      <div
                        className={`h-2.5 w-2.5 rounded-full shrink-0 ${levelVariantColor(d.level)}`}
                      />
                      <span className="text-xs text-foreground flex-1 capitalize">
                        {d.level.replace(/_/g, " ").toLowerCase()}
                      </span>
                      <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${levelVariantColor(d.level)}`}
                          style={{
                            width: `${(d.count / maxCount) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-foreground w-6 text-right">
                        {d.count}
                      </span>
                    </div>
                  );
                })}
            </div>
          )}
        </ReportCard>

        <ReportCard
          title="Weekly Submissions"
          subtitle="Completed attempts per week"
        >
          {weekly_submissions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No submissions yet
            </p>
          ) : (
            <MiniBarChart
              data={weekly_submissions.map((w) => ({
                label: w.week_start.slice(5),
                value: w.count,
                count: w.count,
              }))}
            />
          )}
        </ReportCard>
      </div>

      {/* Weak subjects + class averages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportCard
          title="Weakest Subjects"
          subtitle="Subjects with the lowest average scores"
        >
          {weak_subjects.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Not enough data to rank subjects yet
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {weak_subjects.map((s) => (
                <ScoreBar
                  key={s.subject_id}
                  label={s.subject_name}
                  value={s.average_score}
                />
              ))}
            </div>
          )}
        </ReportCard>

        <ReportCard
          title="Class Averages"
          subtitle="Average best-attempt score per class"
        >
          {class_averages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No classes yet
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {class_averages.map((c) => (
                <ScoreBar
                  key={c.class_id}
                  label={`${c.class_name} (${c.total_students} students)`}
                  value={c.average_score}
                />
              ))}
            </div>
          )}
        </ReportCard>
      </div>

      {/* Top + bottom students */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportCard title="Top Performers" subtitle="Highest average scores">
          {top_students.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No student performance data yet
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {top_students.map((s, idx) => (
                <div key={s.student_id} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground w-5 text-center shrink-0">
                    {idx + 1}
                  </span>
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={s.avatar_url || undefined} />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                      {getInitials(s.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {s.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {s.completed_count} completed
                    </p>
                  </div>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                    {s.average_score}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </ReportCard>

        <ReportCard
          title="Need Attention"
          subtitle="Lowest average scores"
        >
          {bottom_students.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No student performance data yet
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {bottom_students.map((s) => (
                <div key={s.student_id} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={s.avatar_url || undefined} />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                      {getInitials(s.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {s.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {s.average_score}% average
                    </p>
                  </div>
                  <PerformanceLevelBadge level={s.performance_level} />
                </div>
              ))}
            </div>
          )}
        </ReportCard>
      </div>

      {/* At-risk students */}
      <ReportCard
        title="At-Risk Students"
        subtitle="Students who need intervention"
      >
        {at_risk_students.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No at-risk students right now.
            </p>
            {onNavigate && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => onNavigate("improvement")}
              >
                View Improvement Report
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {at_risk_students.map((s) => (
              <div key={s.student_id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                  <AvatarImage src={s.avatar_url || undefined} />
                  <AvatarFallback className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold">
                    {getInitials(s.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-foreground">
                      {s.name}
                    </p>
                    <PerformanceLevelBadge level={s.performance_level} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {s.risk_summary}
                  </p>
                </div>
              </div>
            ))}
            {onNavigate && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => onNavigate("improvement")}
              >
                View Improvement Report
              </Button>
            )}
          </div>
        )}
      </ReportCard>
        </>
      )}
    </div>
  );
}

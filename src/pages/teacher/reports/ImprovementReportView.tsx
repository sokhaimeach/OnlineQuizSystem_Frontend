import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  BookOpen,
  RefreshCw,
  Eye,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ReportCard,
  ReportErrorBlock,
  ReportLoadingBlock,
} from "@/components/teacher/reports/ReportBlocks";
import { DistributionBar, ScoreBar } from "@/components/teacher/reports/ReportCharts";
import { PerformanceLevelBadge } from "@/components/teacher/reports/PerformanceLevelBadge";
import { useImprovementReport } from "@/hooks/api/useReports";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ImprovementReportView() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch, isFetching } =
    useImprovementReport();

  if (isLoading) {
    return (
      <ReportLoadingBlock
        title="Improvement Report"
        description="Loading improvement analytics..."
        icon={TrendingUp}
        cards={4}
      />
    );
  }

  if (isError) {
    return (
      <ReportErrorBlock
        title="improvement report"
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

  const { summary, distribution, at_risk_students, weak_subjects, most_failed_quizzes } = data;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Improvement Report"
        description="Who is improving, who is declining, and where help is needed"
        icon={TrendingUp}
        action={{
          label: isFetching ? "Refreshing..." : "Refresh",
          icon: isFetching ? undefined : RefreshCw,
          onClick: () => refetch(),
        }}
      />

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
        <StatCard
          label="Improving"
          value={summary.improving}
          icon={TrendingUp}
          colorClass="text-emerald-600 dark:text-emerald-400"
          bgClass="bg-emerald-50 dark:bg-emerald-950"
        />
        <StatCard
          label="Declining"
          value={summary.declining}
          icon={TrendingDown}
          colorClass={
            summary.declining > 0
              ? "text-red-600 dark:text-red-400"
              : "text-muted-foreground"
          }
          bgClass={
            summary.declining > 0
              ? "bg-red-50 dark:bg-red-950"
              : "bg-muted"
          }
        />
        <StatCard
          label="Total Students"
          value={summary.total_students}
          icon={BookOpen}
          colorClass="text-indigo-600 dark:text-indigo-400"
          bgClass="bg-indigo-50 dark:bg-indigo-950"
        />
      </div>

      {/* Distribution + weak subjects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportCard
          title="Performance Distribution"
          subtitle="Students by performance level"
        >
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
                    <span className="text-xs text-foreground w-40 capitalize shrink-0">
                      {d.level.replace(/_/g, " ").toLowerCase()}
                    </span>
                    <DistributionBar
                      value={(d.count / maxCount) * 100}
                      colorClass={
                        d.level === "EXCELLENT"
                          ? "bg-emerald-500"
                          : d.level === "GOOD"
                            ? "bg-indigo-500"
                            : d.level === "AVERAGE"
                              ? "bg-blue-500"
                              : d.level === "NEEDS_IMPROVEMENT"
                                ? "bg-amber-500"
                                : "bg-red-500"
                      }
                    />
                    <span className="text-xs font-semibold text-foreground w-6 text-right shrink-0">
                      {d.count}
                    </span>
                  </div>
                );
              })}
          </div>
        </ReportCard>

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
                  label={`${s.subject_name} (${s.attempts} attempts)`}
                  value={s.average_score}
                />
              ))}
            </div>
          )}
        </ReportCard>
      </div>

      {/* Most failed quizzes + at-risk students */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportCard
          title="Most Failed Quizzes"
          subtitle="Assignments with the highest failure counts"
        >
          {most_failed_quizzes.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No failed quizzes yet
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {most_failed_quizzes.map((q) => (
                <div key={q.assignment_id} className="py-2.5 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {q.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {q.passed} passed · {q.failed} failed
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-red-600 dark:text-red-400 shrink-0 tabular-nums">
                    {q.failed} failed
                  </span>
                </div>
              ))}
            </div>
          )}
        </ReportCard>

        <ReportCard
          title="At-Risk Students"
          subtitle="Students flagged for intervention"
        >
          {at_risk_students.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No at-risk students right now.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {at_risk_students.map((s) => (
                <div key={s.student_id} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={s.avatar_url || undefined} />
                    <AvatarFallback className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold">
                      {getInitials(s.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {s.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {s.risk_summary}
                    </p>
                  </div>
                  <PerformanceLevelBadge level={s.performance_level} />
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() =>
                      navigate(`/teacher/reports/student/${s.student_id}`)
                    }
                    aria-label={`View report for ${s.name}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ReportCard>
      </div>

      {/* Trend summary legend */}
      <ReportCard title="Trend Summary" subtitle="How the cohort is moving">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950">
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{summary.improving}</p>
              <p className="text-xs text-muted-foreground">Improving</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950">
              <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{summary.declining}</p>
              <p className="text-xs text-muted-foreground">Declining</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Minus className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{summary.stable}</p>
              <p className="text-xs text-muted-foreground">Stable</p>
            </div>
          </div>
        </div>
      </ReportCard>
    </div>
  );
}

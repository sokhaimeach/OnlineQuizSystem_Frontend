import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Target,
  Timer,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  PerformanceLevelBadge,
} from "@/components/teacher/reports/PerformanceLevelBadge";
import {
  MiniBarChart,
  ScoreBar,
} from "@/components/teacher/reports/ReportCharts";
import { ReportCard } from "@/components/teacher/reports/ReportBlocks";
import { formatScore, formatSeconds } from "@/components/teacher/reports/reportUtils";
import { useStudentReport } from "@/hooks/api/useReports";
import type { SubjectBreakdown, TrendSignals } from "@/models/report.interface";

const trendVariant: Record<
  TrendSignals["signal"],
  "success" | "warning" | "danger" | "info" | "muted"
> = {
  IMPROVING: "success",
  DECLINING: "danger",
  STABLE: "info",
  NONE: "muted",
};

function subjectVariant(level: string | null | undefined) {
  if (!level || level === "NO_DATA") return "muted" as const;
  if (level === "EXCELLENT" || level === "GOOD")
    return "success" as const;
  if (level === "AVERAGE") return "info" as const;
  if (level === "NEEDS_IMPROVEMENT") return "warning" as const;
  return "danger" as const;
}

function subjectLabel(subject: SubjectBreakdown) {
  return subject.average_score === null ? "Incomplete" : subject.performance_level;
}

export function StudentPerformanceOverview({ studentId }: { studentId: string }) {
  const report = useStudentReport(studentId);

  if (report.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-md" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-48 rounded-md" />
            <Skeleton className="h-48 rounded-md" />
          </div>
          <Skeleton className="h-48 rounded-md" />
        </div>
      </div>
    );
  }

  if (report.isError || !report.data) {
    return (
      <ReportCard title="Performance Overview">
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <p className="text-sm text-muted-foreground">
            Performance data could not be loaded.
          </p>
          <Button variant="outline" size="sm" onClick={() => report.refetch()}>
            Retry
          </Button>
        </div>
      </ReportCard>
    );
  }

  const data = report.data;
  const stats = data.statistics;
  const bestRank = [...data.class_rank].sort(
    (a, b) => a.rank - b.rank || b.total_ranked - a.total_ranked,
  )[0];

  const weakest = data.weakest_subject;
  const strongest = data.strongest_subject;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <TrendingUp className="size-5 text-primary" /> Performance Overview
          </h2>
          <p className="text-sm text-muted-foreground">
            Progress, weakest areas and what to work on next.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/teacher/reports/student/${studentId}`}>
            View full report <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          label="Average Score"
          value={formatScore(stats.average_score)}
          icon={Award}
          colorClass="text-violet-600 dark:text-indigo-400"
          bgClass="bg-violet-50 dark:bg-zinc-800"
        />
        <StatCard
          label="Pass Rate"
          value={`${stats.pass_rate}%`}
          icon={CheckCircle2}
          colorClass="text-emerald-600 dark:text-emerald-400"
          bgClass="bg-emerald-50 dark:bg-emerald-950"
        />
        <StatCard
          label="Completion"
          value={`${stats.completion_rate}%`}
          icon={ClipboardList}
          colorClass="text-blue-600 dark:text-blue-400"
          bgClass="bg-blue-50 dark:bg-zinc-800"
        />
        <StatCard
          label="Class Rank"
          value={
            bestRank ? `#${bestRank.rank}` : "—"
          }
          icon={Users}
          colorClass="text-indigo-600 dark:text-indigo-400"
          bgClass="bg-indigo-50 dark:bg-indigo-950"
        />
        <StatCard
          label="Failed Quizzes"
          value={stats.failed_count}
          icon={XCircle}
          colorClass="text-red-600 dark:text-red-400"
          bgClass="bg-red-50 dark:bg-red-950"
        />
        <StatCard
          label="Timeouts"
          value={stats.timed_out_count}
          icon={Timer}
          colorClass="text-amber-600 dark:text-amber-400"
          bgClass="bg-amber-50 dark:bg-amber-950"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ReportCard
            title="Subject Performance"
            subtitle="Ranked weakest to strongest"
          >
            {data.subjects.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No subject data yet.
              </p>
            ) : (
              <div className="space-y-3">
                {data.subjects.map((subject) => (
                  <div key={subject.subject_id ?? "unassigned"}>
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 text-sm font-medium text-foreground min-w-0">
                        <span className="truncate">
                          {subject.subject_name}
                        </span>
                        <StatusBadge
                          variant={subjectVariant(subject.performance_level)}
                          className="text-[10px] py-0 px-1.5"
                        >
                          {subjectLabel(subject)}
                        </StatusBadge>
                      </span>
                      <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                        {subject.completed_count}/{subject.assigned_count} done
                      </span>
                    </div>
                    <ScoreBar value={subject.average_score} showLabel={false} />
                  </div>
                ))}
              </div>
            )}
          </ReportCard>

          {data.meta.has_topic_data && data.weak_topics.length > 0 && (
            <ReportCard title="Weak Topics" subtitle="Lowest accuracy first">
              <div className="space-y-3">
                {data.weak_topics.slice(0, 5).map((topic) => (
                  <ScoreBar
                    key={topic.topic_id}
                    label={topic.topic_name}
                    value={topic.correct_rate}
                  />
                ))}
              </div>
            </ReportCard>
          )}

          <ReportCard
            title="Performance Timeline"
            subtitle={`Last 12 weeks · ${data.timeline.filter((p) => p.attempts > 0).length} week(s) with activity`}
          >
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <StatusBadge variant={trendVariant[data.trend.signal]} dot>
                {data.trend.signal === "NONE"
                  ? "No trend data"
                  : data.trend.signal === "IMPROVING"
                    ? "Improving"
                    : data.trend.signal === "DECLINING"
                      ? "Declining"
                      : "Stable"}
              </StatusBadge>
              {data.trend.delta !== null && (
                <span className="text-xs text-muted-foreground">
                  {data.trend.recent_average ?? 0}% recent vs{" "}
                  {data.trend.previous_average ?? 0}% earlier ({" "}
                  {data.trend.delta > 0 ? "+" : ""}
                  {data.trend.delta} pts)
                </span>
              )}
            </div>
            <MiniBarChart
              data={data.timeline.map((p) => ({
                label: p.label,
                value: p.average_score,
                count: p.attempts,
              }))}
            />
          </ReportCard>
        </div>

        <div className="space-y-6">
          <ReportCard title="Strongest & Weakest">
            <div className="space-y-4">
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" /> Strongest subject
                </p>
                {strongest ? (
                  <div className="mt-1">
                    <p className="text-sm font-semibold text-foreground">
                      {strongest.subject_name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatScore(strongest.average_score)} average ·{" "}
                      {strongest.completed_count} completed ·{" "}
                      {strongest.passed_count} passed
                    </p>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">
                    No completed subjects yet.
                  </p>
                )}
              </div>
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                <p className="text-xs font-medium text-destructive flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5" /> Needs the most work
                </p>
                {weakest ? (
                  <div className="mt-1">
                    <p className="text-sm font-semibold text-foreground">
                      {weakest.subject_name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatScore(weakest.average_score)} average ·{" "}
                      {weakest.failed_count} failed ·{" "}
                      {weakest.timed_out_count} timeout
                      {weakest.timed_out_count !== 1 ? "s" : ""}
                    </p>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">
                    No assigned subjects yet.
                  </p>
                )}
              </div>

              {data.most_failed_quiz && (
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" /> Lowest-scored quiz
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground truncate">
                    {data.most_failed_quiz.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatScore(data.most_failed_quiz.percentage)} ·{" "}
                    {data.most_failed_quiz.attempts_count} attempt
                    {data.most_failed_quiz.attempts_count !== 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </div>
          </ReportCard>

          <ReportCard title="Recommendations">
            {data.recommendations.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Keep it up — no specific improvements flagged.
              </p>
            ) : (
              <ul className="space-y-2">
                {data.recommendations.slice(0, 6).map((rec, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            )}
          </ReportCard>

          <div className="rounded-md border border-border bg-muted/40 p-4">
            <p className="flex items-center gap-1.5 text-xs font-medium text-foreground">
              <Users className="h-3.5 w-3.5" /> Level & risk
            </p>
            <div className="mt-2 flex items-center gap-2">
              <PerformanceLevelBadge level={stats.performance_level} />
              {data.risk.is_at_risk && (
                <StatusBadge variant="danger" dot>
                  At risk
                </StatusBadge>
              )}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Avg time per quiz:{" "}
              {formatSeconds(stats.average_time_used)}
              {bestRank && (
                <>
                  {" "}· Ranked{" "}
                  <span className="font-medium text-foreground">
                    #{bestRank.rank} of {bestRank.total_ranked}
                  </span>{" "}
                  in {bestRank.class_name}
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

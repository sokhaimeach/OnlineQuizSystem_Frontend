import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, AlertTriangle, Lightbulb, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard } from "@/components/StatCard";
import {
  ReportCard,
  ReportErrorBlock,
  ReportLoadingBlock,
} from "@/components/teacher/reports/ReportBlocks";
import {
  MiniBarChart,
  ScoreBar,
} from "@/components/teacher/reports/ReportCharts";
import {
  PerformanceLevelBadge,
  RiskSeverityBadge,
} from "@/components/teacher/reports/PerformanceLevelBadge";
import { formatScore } from "@/components/teacher/reports/reportUtils";
import { StatusBadge } from "@/components/StatusBadge";
import { useStudentReport } from "@/hooks/api/useReports";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function StudentReportView() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useStudentReport(
    studentId ?? "",
  );

  if (isLoading) {
    return (
      <ReportLoadingBlock
        title="Student Report"
        description="Loading student report..."
        icon={User}
        cards={4}
      />
    );
  }

  if (isError) {
    return (
      <ReportErrorBlock
        title="student report"
        message={
          error instanceof Error
            ? error.message
            : "The student report could not be loaded."
        }
        onRetry={() => refetch()}
      />
    );
  }

  if (!data) return null;

  const { profile, statistics, subjects, weak_topics, timeline, trend, quizzes, recent_attempts, strengths, weaknesses, recommendations, risk, meta } = data;

  const timelineData = timeline.map((t) => ({
    label: t.label,
    value: t.average_score,
    count: t.attempts,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/teacher/reports/students")}
          className="-ml-2 mb-4 gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> All Students
        </Button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 shrink-0">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                {profile.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {profile.email ?? "No email"} · {profile.class_names.join(", ") || "No class"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {risk.is_at_risk && (
              <StatusBadge variant="danger" dot>
                At Risk
              </StatusBadge>
            )}
            <PerformanceLevelBadge level={statistics.performance_level} />
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Average Score"
          value={formatScore(statistics.average_score)}
          icon={User}
          colorClass="text-emerald-600 dark:text-emerald-400"
          bgClass="bg-emerald-50 dark:bg-emerald-950"
        />
        <StatCard
          label="Highest Score"
          value={formatScore(statistics.highest_score)}
          icon={ThumbsUp}
          colorClass="text-indigo-600 dark:text-indigo-400"
          bgClass="bg-indigo-50 dark:bg-indigo-950"
        />
        <StatCard
          label="Completion Rate"
          value={`${statistics.completion_rate}%`}
          icon={User}
          colorClass="text-blue-600 dark:text-blue-400"
          bgClass="bg-blue-50 dark:bg-zinc-800"
        />
        <StatCard
          label="Completed"
          value={`${statistics.completed_count}/${statistics.assigned_count}`}
          icon={User}
          colorClass="text-violet-600 dark:text-violet-400"
          bgClass="bg-violet-50 dark:bg-violet-950"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Passed"
          value={statistics.passed_count}
          icon={ThumbsUp}
          colorClass="text-emerald-600 dark:text-emerald-400"
          bgClass="bg-emerald-50 dark:bg-emerald-950"
        />
        <StatCard
          label="Failed"
          value={statistics.failed_count}
          icon={ThumbsDown}
          colorClass={
            statistics.failed_count > 0
              ? "text-red-600 dark:text-red-400"
              : "text-emerald-600 dark:text-emerald-400"
          }
          bgClass={
            statistics.failed_count > 0
              ? "bg-red-50 dark:bg-red-950"
              : "bg-emerald-50 dark:bg-emerald-950"
          }
        />
        <StatCard
          label="Timeouts"
          value={statistics.timed_out_count}
          icon={AlertTriangle}
          colorClass={
            statistics.timed_out_count > 0
              ? "text-amber-600 dark:text-amber-400"
              : "text-muted-foreground"
          }
          bgClass={
            statistics.timed_out_count > 0
              ? "bg-amber-50 dark:bg-amber-950"
              : "bg-muted"
          }
        />
        <StatCard
          label="Missing"
          value={statistics.missing_count}
          icon={AlertTriangle}
          colorClass={
            statistics.missing_count > 0
              ? "text-amber-600 dark:text-amber-400"
              : "text-muted-foreground"
          }
          bgClass={
            statistics.missing_count > 0
              ? "bg-amber-50 dark:bg-amber-950"
              : "bg-muted"
          }
        />
      </div>

      {/* Timeline + trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportCard
          title="Performance Timeline"
          subtitle="Best attempt score per week"
        >
          {timelineData.every((t) => t.value === null) ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No attempts yet
            </p>
          ) : (
            <MiniBarChart data={timelineData} height="h-40" />
          )}
        </ReportCard>

        <ReportCard title="Trend" subtitle="Recent vs earlier performance">
          {trend.signal === "NONE" ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Not enough attempts to determine a trend.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Signal</span>
                <StatusBadge
                  variant={
                    trend.signal === "IMPROVING"
                      ? "success"
                      : trend.signal === "DECLINING"
                        ? "danger"
                        : "info"
                  }
                  dot
                >
                  {trend.signal.charAt(0) + trend.signal.slice(1).toLowerCase()}
                </StatusBadge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Recent average
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {trend.recent_average === null ? "—" : `${trend.recent_average}%`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Earlier average
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {trend.previous_average === null ? "—" : `${trend.previous_average}%`}
                </span>
              </div>
              {trend.delta !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Change</span>
                  <span
                    className={`text-sm font-semibold ${
                      trend.delta > 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : trend.delta < 0
                          ? "text-red-600 dark:text-red-400"
                          : "text-muted-foreground"
                    }`}
                  >
                    {trend.delta > 0 ? "+" : ""}
                    {trend.delta}%
                  </span>
                </div>
              )}
            </div>
          )}
        </ReportCard>
      </div>

      {/* Subject breakdown + weak topics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportCard
          title="Subject Breakdown"
          subtitle="Average score per subject"
        >
          {subjects.filter((s) => s.completed_count > 0).length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No completed assignments yet
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {subjects
                .filter((s) => s.completed_count > 0)
                .map((s) => (
                  <ScoreBar
                    key={s.subject_id ?? "unassigned"}
                    label={s.subject_name}
                    value={s.average_score}
                  />
                ))}
            </div>
          )}
        </ReportCard>

        <ReportCard
          title="Weak Topics"
          subtitle={
            meta.has_topic_data
              ? "Topics with the lowest correct rates"
              : "Tag questions with topics to unlock topic analysis"
          }
        >
          {weak_topics.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {meta.topics_available
                ? "No questions are tagged with topics yet."
                : "Create topics and tag questions to see topic-level performance."}
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {weak_topics.map((t) => (
                <ScoreBar
                  key={t.topic_id ?? t.topic_name}
                  label={`${t.topic_name} (${t.question_count} questions)`}
                  value={t.average_score}
                />
              ))}
            </div>
          )}
        </ReportCard>
      </div>

      {/* Quiz history + recent attempts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportCard
          title="Quiz History"
          subtitle="Best attempt per assignment"
        >
          {quizzes.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No quiz attempts yet
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {quizzes.map((q) => (
                <div key={q.assignment_id} className="py-2.5 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {q.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {q.class_name} · {formatDate(q.submitted_at)}
                    </p>
                  </div>
                  <StatusBadge variant={q.passed ? "success" : "danger"}>
                    {q.passed ? "Passed" : "Failed"}
                  </StatusBadge>
                  <span className="text-xs font-bold text-foreground w-12 text-right tabular-nums shrink-0">
                    {q.percentage}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </ReportCard>

        <ReportCard
          title="Recent Attempts"
          subtitle="Latest quiz submissions"
        >
          {recent_attempts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No attempts yet
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {recent_attempts.map((a) => (
                <div key={a.id} className="py-2.5 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {a.quiz?.title ?? a.assignment?.title ?? "Quiz"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {a.class?.class_name ?? ""} · {formatDate(a.submitted_at)}
                    </p>
                  </div>
                  <StatusBadge
                    variant={
                      a.status === "SUBMITTED"
                        ? "success"
                        : a.status === "TIMEOUT"
                          ? "warning"
                          : "muted"
                    }
                  >
                    {a.status.replace(/_/g, " ")}
                  </StatusBadge>
                  <span className="text-xs font-semibold text-foreground tabular-nums shrink-0">
                    {a.total_score}/{a.assignment?.total_score ?? 0}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ReportCard>
      </div>

      {/* Strengths / weaknesses / recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ReportCard title="Strengths" subtitle="What is going well">
          {strengths.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Nothing to highlight yet.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {strengths.map((s, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <ThumbsUp className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground">
                      {s.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {s.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ReportCard>

        <ReportCard title="Weaknesses" subtitle="Areas to improve">
          {weaknesses.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No weak areas detected.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {weaknesses.map((w, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <ThumbsDown className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground">
                      {w.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {w.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ReportCard>

        <ReportCard
          title="Recommendations"
          subtitle="Suggested next steps"
        >
          {recommendations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No recommendations yet.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {recommendations.map((r, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-snug">
                    {r}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ReportCard>
      </div>

      {/* Risk reasons */}
      {risk.reasons.length > 0 && (
        <ReportCard
          title="Risk Indicators"
          subtitle="Why this student is flagged"
        >
          <div className="flex flex-col gap-2.5">
            {risk.reasons.map((r, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground">
                    {r.message}
                  </p>
                </div>
                <RiskSeverityBadge severity={r.severity} />
              </div>
            ))}
          </div>
        </ReportCard>
      )}
    </div>
  );
}

import {
  AlertCircle,
  ArrowRight,
  BookOpenCheck,
  CalendarClock,
  CheckCircle2,
  Clock,
  GraduationCap,
  ListChecks,
  Play,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/StatusBadge";
import { useGetStudentDashboard, useGetStudentProgress } from "@/hooks/api/useStudent";
import { formatDateTime, formatDuration } from "@/utils/student-format";
import type { DashboardActiveAssignment } from "@/models/assignment.interface";
import type { StudentProgress } from "@/models/report.interface";

const trendVariant: Record<
  StudentProgress["overall"]["trend"]["signal"],
  "success" | "warning" | "danger" | "info" | "muted"
> = {
  IMPROVING: "success",
  DECLINING: "danger",
  STABLE: "info",
  NONE: "muted",
};

function subjectLevelVariant(
  level: StudentProgress["subjects"][number]["performance_level"],
) {
  if (!level || level === "NO_DATA") return "muted" as const;
  if (level === "EXCELLENT" || level === "GOOD") return "success" as const;
  if (level === "AVERAGE") return "info" as const;
  if (level === "NEEDS_IMPROVEMENT") return "warning" as const;
  return "danger" as const;
}

function subjectLevelLabel(
  level: StudentProgress["subjects"][number]["performance_level"],
) {
  if (!level || level === "NO_DATA") return "Incomplete";
  if (level === "EXCELLENT") return "Excellent";
  if (level === "GOOD") return "Good";
  if (level === "AVERAGE") return "Average";
  if (level === "NEEDS_IMPROVEMENT") return "Needs work";
  return "Critical";
}

export function StudentDashboardView() {
  const dashboard = useGetStudentDashboard();
  const progress = useGetStudentProgress();
  const navigate = useNavigate();

  if (dashboard.isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-2 h-8 w-72" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            <Skeleton className="h-6 w-44" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
          <div className="space-y-3">
            <Skeleton className="h-6 w-32" />
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    );
  }

  if (dashboard.isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <AlertCircle className="size-10 text-destructive" />
        <h3 className="font-semibold">Could not load dashboard</h3>
        <p className="text-sm text-muted-foreground">
          Try refreshing the page.
        </p>
        <Button variant="outline" size="sm" onClick={() => dashboard.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const data = dashboard.data;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Student workspace</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome back — ready to learn?
        </h1>
        <p className="mt-1 text-muted-foreground">
          Keep up with your classes, assignments, and quiz progress.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Joined Classes</p>
              <p className="mt-1 text-2xl font-bold">
                {data?.total_classes ?? 0}
              </p>
            </div>
            <span className="rounded-xl bg-indigo-500/10 p-3 text-indigo-600">
              <GraduationCap className="size-5" />
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between pt-6">
            <div>
              <p className="text-sm text-muted-foreground">
                Active Assignments
              </p>
              <p className="mt-1 text-2xl font-bold">
                {data?.active_assignments ?? 0}
              </p>
            </div>
            <span className="rounded-xl bg-amber-500/10 p-3 text-amber-600">
              <CalendarClock className="size-5" />
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="mt-1 text-2xl font-bold">
                {data?.completed_assignments ?? 0}
              </p>
            </div>
            <span className="rounded-xl bg-emerald-500/10 p-3 text-emerald-600">
              <CheckCircle2 className="size-5" />
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Average Score</p>
              <p className="mt-1 text-2xl font-bold">
                {data?.average_score ?? 0}%
              </p>
            </div>
            <span className="rounded-xl bg-violet-500/10 p-3 text-violet-600">
              <Trophy className="size-5" />
            </span>
          </CardContent>
        </Card>
      </div>

      <LearningProgressCard
        progress={progress.data}
        loading={progress.isLoading}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ContinueAssignmentCard
            assignments={data?.active_assignments_list}
            navigate={navigate}
          />

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              {!data?.upcoming_assignments?.length ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No upcoming assignments.
                </p>
              ) : (
                <div className="space-y-3">
                  {data.upcoming_assignments.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-3 rounded-lg border p-3"
                    >
                      <span className="shrink-0 rounded-lg bg-amber-500/10 p-2 text-amber-600">
                        <CalendarClock className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{a.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {a.class?.class_name ?? ""} · Due{" "}
                          {formatDateTime(a.due_date)}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="shrink-0"
                        onClick={() => navigate("/student/assignments")}
                      >
                        Start <ArrowRight />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button
                className="justify-start"
                onClick={() => navigate("/student/assignments")}
              >
                <BookOpenCheck /> View assignments
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Attempts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!data?.recent_attempts?.length ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No attempts yet.
                </p>
              ) : (
                data.recent_attempts.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <span className="rounded-lg bg-primary/10 p-2 text-primary">
                      <BookOpenCheck className="size-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {a.quiz_title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {a.class_name}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      {a.status === "TIMEOUT" ? (
                        <p className="text-xs font-semibold text-destructive">
                          Timed Out
                        </p>
                      ) : (
                        <p className="text-sm font-bold">
                          {a.score != null ? `${a.score}%` : "—"}
                        </p>
                      )}
                      <p className="text-[10px] text-muted-foreground">
                        {formatDateTime(a.submitted_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ContinueAssignmentCard({
  assignments,
  navigate,
}: {
  assignments: DashboardActiveAssignment[] | undefined;
  navigate: ReturnType<typeof useNavigate>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="size-4 text-primary" /> Continue Assignment
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!assignments?.length ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No active assignments right now.
          </p>
        ) : (
          <div className="space-y-3">
            {assignments.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <span className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Clock className="size-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{a.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.class?.class_name ?? ""}
                    {a.quiz && <> · {a.quiz.title}</>}
                  </p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ListChecks className="size-3" />
                      {a.total_question} question
                      {a.total_question !== 1 ? "s" : ""}
                    </span>
                    <span>{formatDuration(a.remaining_seconds)} remaining</span>
                  </p>
                </div>
                <Button
                  size="sm"
                  className="shrink-0"
                  onClick={() => navigate(`/do-quiz/${a.id}`)}
                >
                  {a.attempt ? (
                    <>
                      <Play /> Continue
                    </>
                  ) : (
                    "Start"
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LearningProgressCard({
  progress,
  loading,
}: {
  progress: StudentProgress | undefined;
  loading: boolean;
}) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-72" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  if (!progress) {
    return null;
  }

  const overall = progress.overall;
  const weakest = progress.weakest_subject;
  const strongest = progress.strongest_subject;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
        <CardTitle className="flex items-center gap-2">
          <Target className="size-4 text-primary" /> My Learning Progress
        </CardTitle>
        {progress.is_at_risk && (
          <StatusBadge variant="danger" dot>
            Needs attention
          </StatusBadge>
        )}
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg bg-muted/40 p-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">
              {overall.average_score != null
                ? `${overall.average_score}%`
                : "—"}
            </span>
            <span className="text-xs text-muted-foreground">avg score</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">
              {overall.pass_rate}%
            </span>
            <span className="text-xs text-muted-foreground">pass rate</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">
              {overall.completion_rate}%
            </span>
            <span className="text-xs text-muted-foreground">completed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">
              {overall.completed_count}
            </span>
            <span className="text-xs text-muted-foreground">quizzes done</span>
          </div>
          <StatusBadge variant={trendVariant[overall.trend.signal]}>
            {overall.trend.signal === "IMPROVING" ? (
              <span className="flex items-center gap-1">
                <TrendingUp className="size-3" /> Improving
              </span>
            ) : overall.trend.signal === "DECLINING" ? (
              <span className="flex items-center gap-1">
                <TrendingDown className="size-3" /> Declining
              </span>
            ) : overall.trend.signal === "STABLE" ? (
              "Stable"
            ) : (
              "No trend yet"
            )}
          </StatusBadge>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-foreground">
              Subject performance
            </p>
            {weakest && (
              <StatusBadge variant="warning">
                Focus: {weakest.subject_name}
              </StatusBadge>
            )}
          </div>
          {progress.subjects.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No subjects assigned yet — check back once you join a class.
            </p>
          ) : (
            <div className="space-y-3">
              {progress.subjects.map((subject) => (
                <div key={subject.subject_id ?? "unassigned"}>
                  <div className="mb-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                    <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-foreground">
                      <span className="truncate">{subject.subject_name}</span>
                      <StatusBadge
                        variant={subjectLevelVariant(subject.performance_level)}
                        className="shrink-0 text-[10px] py-0 px-1.5"
                      >
                        {subjectLevelLabel(subject.performance_level)}
                      </StatusBadge>
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {subject.average_score != null
                        ? `${subject.average_score}%`
                        : "—"}{" "}
                      · {subject.completed_count}/{subject.assigned_count} done
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${
                        subject.average_score == null
                          ? "bg-muted-foreground/30"
                          : subject.average_score >= 75
                            ? "bg-emerald-500"
                            : subject.average_score >= 60
                              ? "bg-blue-500"
                              : subject.average_score >= 40
                                ? "bg-amber-500"
                                : "bg-red-500"
                      }`}
                      style={{
                        width: `${
                          subject.average_score == null
                            ? 0
                            : Math.min(subject.average_score, 100)
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {strongest && (
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Strongest subject
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {strongest.subject_name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {strongest.average_score != null
                  ? `${strongest.average_score}%`
                  : "—"}{" "}
                average · {strongest.completed_count} completed ·{" "}
                {strongest.passed_count} passed
              </p>
            </div>
          )}
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
            <p className="text-xs font-medium text-destructive">
              Needs the most work
            </p>
            {weakest ? (
              <>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {weakest.subject_name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {weakest.average_score != null
                    ? `${weakest.average_score}%`
                    : "—"}{" "}
                  average · {weakest.failed_count} failed ·{" "}
                  {weakest.timed_out_count} timeout
                  {weakest.timed_out_count !== 1 ? "s" : ""}
                </p>
              </>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">
                No subject data yet.
              </p>
            )}
          </div>
        </div>

        {progress.missing_assignments.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              Missing assignments
            </p>
            <div className="space-y-2">
              {progress.missing_assignments.map((m) => (
                <div
                  key={m.assignment_id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {m.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {m.class_name} · due {formatDateTime(m.due_date)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate("/student/assignments")}
                  >
                    Start
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {progress.recommendations.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              Recommendations
            </p>
            <ul className="space-y-1.5">
              {progress.recommendations.slice(0, 5).map((rec, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

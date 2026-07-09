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
  Trophy,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetStudentDashboard } from "@/hooks/api/useStudent";
import { formatDateTime, formatDuration } from "@/utils/student-format";
import type { DashboardActiveAssignment } from "@/models/assignment.interface";

export function StudentDashboardView() {
  const dashboard = useGetStudentDashboard();
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
                      <span className="rounded-lg bg-amber-500/10 p-2 text-amber-600">
                        <CalendarClock className="size-4" />
                      </span>
                      <div className="flex-1">
                        <p className="font-medium">{a.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {a.class?.class_name ?? ""} · Due{" "}
                          {formatDateTime(a.due_date)}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
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
                  <p className="mt-0.5 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ListChecks className="size-3" />
                      {a.total_question} question
                      {a.total_question !== 1 ? "s" : ""}
                    </span>
                    <span>{formatDuration(a.remaining_seconds)} remaining</span>
                  </p>
                </div>
                <Button size="sm" onClick={() => navigate(`/do-quiz/${a.id}`)}>
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

import {
  AlarmClock,
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Clock,
  GraduationCap,
  Hourglass,
  Loader2,
  Send,
  TimerOff,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCreateAttempt,
  useDoQuiz,
  useSubmitQuiz,
} from "@/hooks/api/useStudent";
import { cn } from "@/lib/utils";
import { getStoredRole } from "@/utils/authRole";
import { getAccessToken, setAccessToken } from "@/utils/tokenStorage";
import { formatDateTime } from "@/utils/student-format";
import type { AttemptState, QuizSessionData } from "@/models/attempt.interface";
import type { QuestionWithOptions } from "@/models/quiz.interface";

type PageState =
  | { phase: "guest-form" }
  | { phase: "creating" }
  | { phase: "unavailable"; message: string; redirect?: string }
  | { phase: "ready"; attemptId: string }
  | { phase: "quiz"; attemptId: string }
  | { phase: "submitting" }
  | { phase: "redirecting"; url: string };

const guestAttemptTokenKey = (assignmentId: string) =>
  `guest_attempt_token:${assignmentId}`;

export function DoQuizPage() {
  const { assignmentId = "" } = useParams();
  const create = useCreateAttempt();
  const navigate = useNavigate();
  const registered = Boolean(getAccessToken() && getStoredRole() === "STUDENT");
  const storedGuestAttemptToken = assignmentId
    ? localStorage.getItem(guestAttemptTokenKey(assignmentId))
    : null;
  const guestAttemptToken =
    storedGuestAttemptToken || getAccessToken("x_attempt_token");
  const [page, setPage] = useState<PageState>(
    registered || guestAttemptToken ? { phase: "creating" } : { phase: "guest-form" },
  );
  const startedRef = useRef(false);

  const startAttempt = useCallback(
    async (name?: string) => {
      try {
        setPage({ phase: "creating" });
        if (!registered && guestAttemptToken) {
          setAccessToken(guestAttemptToken, "x_attempt_token");
        }
        const response = await create.mutateAsync({
          assignment_id: assignmentId,
          ...(name ? { guest_name: name } : {}),
        });
        const state = (response as { data?: AttemptState })?.data;
        if (!state) {
          setPage({
            phase: "unavailable",
            message: "Could not start attempt.",
          });
          return;
        }
        if (!registered && state.access_token) {
          localStorage.setItem(
            guestAttemptTokenKey(assignmentId),
            state.access_token,
          );
          setAccessToken(state.access_token, "x_attempt_token");
        }
        if (state.canViewResult && state.redirect) {
          setPage({ phase: "redirecting", url: state.redirect });
          navigate(state.redirect, { replace: true });
          return;
        }
        if (state.canContinue && state.id) {
          setPage({ phase: "quiz", attemptId: state.id });
          return;
        }
        if (state.canStart && state.id) {
          setPage({ phase: "quiz", attemptId: state.id });
          return;
        }
        if (state.id && !state.canStart) {
          setPage({ phase: "ready", attemptId: state.id });
          return;
        }
        setPage({
          phase: "unavailable",
          message: state.message || "Cannot start this assignment.",
        });
      } catch (err: unknown) {
        const errorResponse =
          err && typeof err === "object" && "response" in err
            ? (
                err as {
                  response: { data?: { errorCode?: string; message?: string } };
                }
              ).response?.data
            : null;
        const errorCode = errorResponse?.errorCode;
        const msg =
          errorResponse?.message ?? "The quiz attempt could not be started.";

        if (errorCode === "ASSIGNMENT_EXPIRED") {
          setPage({
            phase: "unavailable",
            message:
              "This assignment is no longer available. The due date has passed.",
            redirect: "/student/assignments",
          });
        } else if (errorCode === "ASSIGNMENT_NOT_STARTED") {
          setPage({
            phase: "unavailable",
            message:
              "This assignment has not started yet. Please check back later.",
            redirect: "/student/assignments",
          });
        } else if (errorCode === "QUIZ_IS_DRAFT") {
          setPage({
            phase: "unavailable",
            message:
              "This quiz is currently in draft mode and cannot be accessed.",
            redirect: "/student/assignments",
          });
        } else if (
          errorCode === "ASSIGNMENT_NOT_PUBLISHED" ||
          errorCode === "ASSIGNMENT_DRAFT"
        ) {
          setPage({
            phase: "unavailable",
            message: "This assignment is not yet available.",
            redirect: "/student/assignments",
          });
        } else if (errorCode === "ACCESS_DENIED") {
          setPage({
            phase: "unavailable",
            message: "You do not have access to this assignment.",
            redirect: "/student/assignments",
          });
        } else if (errorCode === "GUEST_NAME_REQUIRED") {
          setPage({ phase: "guest-form" });
        } else {
          setPage({ phase: "unavailable", message: msg });
        }
      }
    },
    [assignmentId, create, guestAttemptToken, navigate, registered],
  );

  useEffect(() => {
    if ((registered || guestAttemptToken) && !startedRef.current) {
      startedRef.current = true;
      void startAttempt();
    }
  }, [registered, guestAttemptToken, startAttempt]);

  if (page.phase === "guest-form") {
    return (
      <GuestForm
        loading={create.isPending}
        onSubmit={(name) => void startAttempt(name)}
      />
    );
  }

  if (page.phase === "creating") {
    return (
      <CenteredMessage
        icon={<Loader2 className="size-6 animate-spin" />}
        title="Starting your quiz…"
      />
    );
  }

  if (page.phase === "unavailable") {
    return (
      <UnavailableScreen message={page.message} redirect={page.redirect} />
    );
  }

  if (page.phase === "redirecting") {
    return (
      <CenteredMessage
        icon={<Loader2 className="size-6 animate-spin" />}
        title="Taking you to the result…"
      />
    );
  }

  if (page.phase === "ready" || page.phase === "quiz") {
    return (
      <QuizSession
        attemptId={page.attemptId}
        onUnavailable={(msg, url) =>
          setPage({ phase: "unavailable", message: msg, redirect: url })
        }
        onSubmitted={(url) => {
          setPage({ phase: "redirecting", url });
          navigate(url, { replace: true });
        }}
      />
    );
  }

  return null;
}

function GuestForm({
  loading,
  onSubmit,
}: {
  loading: boolean;
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast.error("Enter your name to continue.");
      return;
    }
    onSubmit(name.trim());
  };

  return (
    <main className="grid min-h-svh place-items-center bg-muted/30 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <span className="mb-2 grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
            <ClipboardList />
          </span>
          <CardTitle className="text-2xl">Start Assignment</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your name to begin this assignment.
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={submit}>
            <label className="grid gap-2 text-sm font-medium">
              Your full name
              <Input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </label>
            <Button className="w-full" disabled={loading}>
              {loading && <Loader2 className="animate-spin" />}
              Create attempt and start
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

function UnavailableScreen({
  message,
  redirect,
}: {
  message: string;
  redirect?: string;
}) {
  const navigate = useNavigate();
  return (
    <main className="grid min-h-svh place-items-center bg-muted/30 p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="py-12">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-amber-500/10 text-amber-600">
            <AlertCircle className="size-7" />
          </span>
          <h1 className="mt-4 text-xl font-bold">Assignment unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
          <Button
            className="mt-6"
            onClick={() =>
              navigate(redirect || "/student/assignments", { replace: true })
            }
          >
            Go to assignments
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

function CenteredMessage({
  icon,
  title,
  detail,
}: {
  icon: React.ReactNode;
  title: string;
  detail?: string;
}) {
  return (
    <main className="grid min-h-svh place-items-center bg-muted/30 p-4">
      <div className="text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
          {icon}
        </span>
        <h1 className="mt-4 text-xl font-bold">{title}</h1>
        {detail && (
          <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
        )}
      </div>
    </main>
  );
}

function TimeoutScreen({
  assignmentTitle,
  quizTitle,
}: {
  assignmentTitle: string;
  quizTitle: string;
}) {
  const navigate = useNavigate();
  return (
    <main className="grid min-h-svh place-items-center bg-muted/30 p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="py-12">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-destructive/10 text-destructive">
            <TimerOff className="size-7" />
          </span>
          <h1 className="mt-4 text-xl font-bold">Time&rsquo;s up!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The time limit for <strong>{quizTitle}</strong> has expired. Your
            answers have been submitted automatically.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {assignmentTitle}
          </p>
          <Button className="mt-6" onClick={() => navigate(-1)}>
            Go back
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

function QuizSession({
  attemptId,
  onUnavailable,
  onSubmitted,
}: {
  attemptId: string;
  onUnavailable: (msg: string, redirect?: string) => void;
  onSubmitted: (url: string) => void;
}) {
  const query = useDoQuiz(attemptId);
  const submit = useSubmitQuiz();
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [confirm, setConfirm] = useState(false);
  const [seconds, setSeconds] = useState<number | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const submittedRef = useRef(false);

  // Parse the raw response - unwrap the Axios data
  const rawData = query.data as { data?: unknown } | undefined;
  const sessionData = rawData?.data as QuizSessionData | undefined;

  const isFinished =
    sessionData?.status === "SUBMITTED" || sessionData?.status === "TIMEOUT";
  const isUnavailable =
    sessionData?.status === "NOT_FOUND" ||
    sessionData?.status === "QUIZ_DELETED" ||
    sessionData?.status === "QUIZ_DRAFT" ||
    sessionData?.status === "ASSIGNMENT_UNPUBLISHED";

  useEffect(() => {
    if (isFinished && sessionData?.redirect) {
      onSubmitted(sessionData.redirect);
    } else if (isFinished && !sessionData?.redirect) {
      onSubmitted(`/result/${attemptId}`);
    } else if (isUnavailable) {
      onUnavailable(
        sessionData?.message || "This quiz is no longer available.",
        "/student/assignments",
      );
    }
  }, [
    isFinished,
    isUnavailable,
    sessionData,
    onSubmitted,
    onUnavailable,
    attemptId,
  ]);

  const questions = useMemo(() => {
    if (!sessionData?.assignment?.quiz?.questions) return [];
    return sessionData.assignment.quiz.questions as QuestionWithOptions[];
  }, [sessionData]);

  const assignment = sessionData?.assignment;
  const quiz = assignment?.quiz;
  const durationMinutes = quiz?.duration_minutes ?? 0;

  // Timer
  useEffect(() => {
    if (!durationMinutes || !sessionData?.started_at) return;
    const startedAt = new Date(sessionData.started_at).getTime();
    if (!startedAt) return;
    const durMs = durationMinutes * 60_000;
    const deadline = startedAt + durMs;

    const tick = () =>
      setSeconds(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [sessionData, durationMinutes]);

  // Auto-submit on time expiry
  useEffect(() => {
    if (seconds === 0 && !submittedRef.current) {
      setTimedOut(true);
    }
  }, [seconds]);

  const finish = useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    try {
      const payload = {
        answers: Object.entries(answers).map(
          ([question_id, selected_option_id]) => ({
            question_id,
            selected_option_id,
          }),
        ),
      };
      const response = await submit.mutateAsync({ attemptId, payload });
      const result = (response as { data?: { redirect?: string } })?.data;
      toast.success("Quiz submitted successfully.");
      onSubmitted(result?.redirect || `/result/${attemptId}`);
    } catch {
      submittedRef.current = false;
      toast.error("Your quiz could not be submitted. Please try again.");
    }
  }, [answers, attemptId, submit, onSubmitted]);

  // Warn before leaving
  useEffect(() => {
    if (isFinished || timedOut) return;
    const handler = (e: BeforeUnloadEvent) => {
      if (Object.values(answers).some((a) => a.length > 0)) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [answers, isFinished, timedOut]);

  if (timedOut) {
    return (
      <TimeoutScreen
        assignmentTitle={assignment?.title ?? ""}
        quizTitle={quiz?.title ?? ""}
      />
    );
  }

  if (query.isLoading) {
    return (
      <main className="min-h-svh bg-muted/30">
        <div className="mx-auto max-w-3xl space-y-6 p-6">
          <Skeleton className="h-16 w-full rounded-xl" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      </main>
    );
  }

  if (query.isError || !questions.length) {
    if (isUnavailable || isFinished) return null;
    return (
      <UnavailableScreen
        message={
          query.isError
            ? "Could not load quiz questions."
            : "No questions available for this quiz."
        }
      />
    );
  }

  const answeredCount = Object.values(answers).filter((a) => a.length).length;
  const totalQuestions = questions.length;
  const timeDisplay =
    seconds == null
      ? null
      : `${Math.floor(seconds / 60)
          .toString()
          .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
  const isLowTime = seconds != null && seconds < 300;

  return (
    <main className="min-h-svh bg-muted/30">
      {/* Sticky header */}
      <header
        className={cn(
          "sticky top-0 z-20 border-b backdrop-blur transition-colors",
          isLowTime ? "bg-destructive/5 border-destructive/20" : "bg-card/95",
        )}
      >
        <div className="mx-auto max-w-4xl px-3 py-2.5 sm:px-4">
          {/* Top row: quiz title + timer + submit */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {quiz?.title ?? ""}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {assignment?.title ?? ""} · {answeredCount}/{totalQuestions}{" "}
                answered
              </p>
            </div>
            {timeDisplay && (
              <div
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-2 font-mono text-sm font-bold sm:gap-2 sm:px-3",
                  isLowTime
                    ? "border-destructive/40 bg-destructive/10 text-destructive"
                    : "border-border",
                )}
              >
                {isLowTime ? (
                  <AlarmClock className="size-4" />
                ) : (
                  <Clock className="size-4" />
                )}
                {timeDisplay}
              </div>
            )}
            {totalQuestions > 0 && (
              <div className="hidden w-20 sm:block">
                <Progress
                  value={(answeredCount / totalQuestions) * 100}
                  className={cn("h-2", isLowTime && "bg-destructive/20")}
                />
              </div>
            )}
            <Button
              size="sm"
              className="shrink-0"
              disabled={submit.isPending}
              onClick={() => setConfirm(true)}
            >
              {submit.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              <span className="hidden sm:inline ml-1">Submit</span>
            </Button>
          </div>
          {/* Info row: class, due date, time limit */}
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-[11px] text-muted-foreground">
            {assignment?.class && (
              <span className="flex items-center gap-1">
                <GraduationCap className="size-3" />
                {assignment.class.class_name}
              </span>
            )}
            {assignment?.due_date && (
              <span className="flex items-center gap-1">
                <BookOpen className="size-3" />
                Due {formatDateTime(assignment.due_date)}
              </span>
            )}
            {durationMinutes > 0 && (
              <span className="flex items-center gap-1">
                <Hourglass className="size-3" />
                {durationMinutes} min limit
              </span>
            )}
            {sessionData?.status && (
              <span className="rounded bg-primary/10 px-1.5 py-0.5 font-medium text-primary">
                {sessionData.status === "IN_PROGRESS"
                  ? "In progress"
                  : sessionData.status}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Questions */}
      <div className="mx-auto max-w-3xl space-y-6 p-4 pb-24 sm:p-6 sm:pb-32">
        {questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={index}
            selected={answers[question.id ?? ""] ?? []}
            onSelect={(optionId) => {
              const qId = question.id ?? "";
              setAnswers((prev) => {
                const curr = prev[qId] ?? [];
                if (question.question_type === "SINGLE_CHOICE") {
                  return { ...prev, [qId]: [optionId] };
                }
                return {
                  ...prev,
                  [qId]: curr.includes(optionId)
                    ? curr.filter((id) => id !== optionId)
                    : [...curr, optionId],
                };
              });
            }}
          />
        ))}

        {/* Submit area */}
        <div className="flex justify-center pt-4">
          <Button
            size="lg"
            disabled={submit.isPending}
            onClick={() => setConfirm(true)}
            className="gap-2 px-8"
          >
            {submit.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            Submit your answers
          </Button>
        </div>
      </div>

      {/* Confirm dialog */}
      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit your quiz?</DialogTitle>
            <DialogDescription>
              You answered {answeredCount} of {totalQuestions} questions.
              {answeredCount < totalQuestions &&
                ` ${totalQuestions - answeredCount} unanswered question(s) will receive no credit.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm(false)}>
              Keep working
            </Button>
            <Button disabled={submit.isPending} onClick={() => void finish()}>
              {submit.isPending && <Loader2 className="animate-spin" />}
              Submit quiz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function QuestionCard({
  question,
  index,
  selected,
  onSelect,
}: {
  question: QuestionWithOptions;
  index: number;
  selected: string[];
  onSelect: (optionId: string) => void;
}) {
  const isMultiple = question.question_type === "MULTIPLE_CHOICE";
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50 pb-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium">Question {index + 1}</span>
          <span>
            {question.score} pt{question.score !== 1 ? "s" : ""}
          </span>
        </div>
        <CardTitle className="pt-1 text-base font-semibold leading-relaxed">
          {question.question_text}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {isMultiple ? "Select all that apply" : "Select one answer"}
        </p>
      </CardHeader>
      <CardContent className="grid gap-2 p-4">
        {question.options.map((option, i) => {
          const id = option.id ?? "";
          const active = selected.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all hover:border-primary/50",
                active
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border",
              )}
            >
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full border text-[11px] font-medium",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30 text-muted-foreground",
                )}
              >
                {active ? (
                  <CheckCircle2 className="size-3.5" />
                ) : (
                  (letters[i] ?? i + 1)
                )}
              </span>
              <span className="flex-1">{option.option_text}</span>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}

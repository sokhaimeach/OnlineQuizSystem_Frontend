import {
  AlarmClock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Loader2,
  Send,
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
import {
  useCreateAttempt,
  useDoQuiz,
  useSubmitQuiz,
} from "@/hooks/api/useStudent";
import { cn } from "@/lib/utils";
import { getStoredRole } from "@/utils/authRole";
import { getAccessToken } from "@/utils/tokenStorage";

function responseData<T>(response: unknown) {
  return (response as { data?: T }).data as T;
}

export function DoQuizPage() {
  const { assignmentId = "" } = useParams();
  const create = useCreateAttempt();
  const [guestName, setGuestName] = useState("");
  const [attemptId, setAttemptId] = useState("");
  const autoStarted = useRef(false);
  const registered = Boolean(getAccessToken() && getStoredRole() === "STUDENT");
  const start = useCallback(
    async (name?: string) => {
      try {
        const response = await create.mutateAsync({
          assignment_id: assignmentId,
          ...(name ? { guest_name: name } : {}),
        });
        const attempt = responseData<{ id: string }>(response);
        if (!attempt?.id) throw new Error("Attempt ID missing");
        setAttemptId(attempt.id);
      } catch {
        toast.error("The quiz attempt could not be started.");
      }
    },
    [assignmentId, create],
  );
  useEffect(() => {
    if (registered && !autoStarted.current) {
      autoStarted.current = true;
      void start();
    }
  }, [registered, start]);
  if (attemptId)
    return <QuizSession attemptId={attemptId} registered={registered} />;
  if (registered) {
    if (create.isPending)
      return (
        <QuizMessage
          icon={<Loader2 className="animate-spin" />}
          title="Starting your quiz…"
        />
      );
    if (create.isError)
      return (
        <QuizMessage
          icon={<ClipboardList />}
          title="Could not start quiz"
          detail="Please try again."
        />
      );
    return null;
  }
  const submitGuest = (e: FormEvent) => {
    e.preventDefault();
    if (guestName.trim().length < 2)
      return toast.error("Enter your name to continue.");
    void start(guestName.trim());
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
          <form className="space-y-4" onSubmit={submitGuest}>
            <label className="grid gap-2 text-sm font-medium">
              Your full name
              <Input
                autoFocus
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Enter your name"
              />
            </label>
            <Button className="w-full" disabled={create.isPending}>
              {create.isPending && <Loader2 className="animate-spin" />} Create
              attempt and start
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

function QuizSession({
  attemptId,
  registered,
}: {
  attemptId: string;
  registered: boolean;
}) {
  const query = useDoQuiz(attemptId);
  const submit = useSubmitQuiz();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [confirm, setConfirm] = useState(false);
  const [seconds, setSeconds] = useState<number | null>(null);
  const submitted = useRef(false);
  const quiz = query.data;
  const questions = useMemo(() => {
    if (!quiz) return [];
    return [...quiz.assignment.quiz.questions].sort(
      (a, b) =>
        quiz.question_order.indexOf(a.id ?? "") -
        quiz.question_order.indexOf(b.id ?? ""),
    );
  }, [quiz]);
  const finish = useCallback(async () => {
    if (submitted.current || !quiz) return;
    submitted.current = true;
    try {
      await submit.mutateAsync({
        attemptId,
        payload: {
          answers: Object.entries(answers).map(
            ([question_id, selected_option_id]) => ({
              question_id,
              selected_option_id,
            }),
          ),
        },
      });
      toast.success("Quiz submitted successfully.");
      navigate(
        registered ? `/student/result/${attemptId}` : `/result/${attemptId}`,
        { replace: true },
      );
    } catch {
      submitted.current = false;
      toast.error("Your quiz could not be submitted. Please try again.");
    }
  }, [answers, attemptId, navigate, quiz, registered, submit]);
  useEffect(() => {
    if (!quiz?.assignment.quiz.duration_minutes) return;
    const deadline =
      new Date(quiz.started_at).getTime() +
      quiz.assignment.quiz.duration_minutes * 60_000;
    const tick = () =>
      setSeconds(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [quiz]);
  useEffect(() => {
    if (seconds === 0) void finish();
  }, [finish, seconds]);
  if (query.isLoading)
    return (
      <QuizMessage
        icon={<Loader2 className="animate-spin" />}
        title="Loading your quiz…"
      />
    );
  if (query.isError || !quiz || !questions.length)
    return (
      <QuizMessage
        icon={<ClipboardList />}
        title="Quiz unavailable"
        detail="The questions could not be loaded."
      />
    );
  const question = questions[current];
  const questionId = question.id ?? "";
  const selected = answers[questionId] ?? [];
  const choose = (optionId: string) =>
    setAnswers((old) => {
      if (question.question_type === "SINGLE_CHOICE")
        return { ...old, [questionId]: [optionId] };
      return {
        ...old,
        [questionId]: selected.includes(optionId)
          ? selected.filter((id) => id !== optionId)
          : [...selected, optionId],
      };
    });
  const answered = Object.values(answers).filter((a) => a.length).length;
  const time =
    seconds == null
      ? null
      : `${Math.floor(seconds / 60)
          .toString()
          .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
  return (
    <main className="min-h-svh bg-muted/30">
      <header className="sticky top-0 z-20 border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">
              {quiz.assignment.quiz.title}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {quiz.assignment.title}
            </p>
          </div>
          {time && (
            <div
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-sm font-bold",
                seconds != null &&
                  seconds < 300 &&
                  "border-destructive/40 bg-destructive/10 text-destructive",
              )}
            >
              <AlarmClock className="size-4" />
              {time}
            </div>
          )}
          <Button onClick={() => setConfirm(true)}>
            <Send /> <span className="hidden sm:inline">Submit</span>
          </Button>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-5 p-4 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-xl border bg-card p-4 lg:sticky lg:top-20 lg:self-start">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>
              {answered}/{questions.length}
            </span>
          </div>
          <Progress
            value={(answered / questions.length) * 100}
            className="mt-2"
          />
          <div className="mt-4 grid grid-cols-8 gap-2 lg:grid-cols-4">
            {questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setCurrent(i)}
                className={cn(
                  "grid aspect-square place-items-center rounded-md border text-xs font-medium",
                  current === i && "ring-2 ring-primary",
                  answers[q.id ?? ""]?.length &&
                    "border-primary bg-primary text-primary-foreground",
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </aside>
        <section className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Question {current + 1} of {questions.length}
                </span>
                <span>{question.score} points</span>
              </div>
              <CardTitle className="pt-2 text-xl leading-relaxed">
                {question.question_text}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {question.question_type === "MULTIPLE_CHOICE"
                  ? "Select all answers that apply."
                  : "Select one answer."}
              </p>
            </CardHeader>
            <CardContent className="grid gap-3">
              {question.options.map((option, i) => {
                const id = option.id ?? "";
                const active = selected.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() => choose(id)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-4 text-left transition hover:border-primary/50",
                      active &&
                        "border-primary bg-primary/5 ring-1 ring-primary",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-7 shrink-0 place-items-center rounded-full border text-xs",
                        active &&
                          "border-primary bg-primary text-primary-foreground",
                      )}
                    >
                      {active ? (
                        <CheckCircle2 className="size-4" />
                      ) : (
                        String.fromCharCode(65 + i)
                      )}
                    </span>
                    <span>{option.option_text}</span>
                  </button>
                );
              })}
            </CardContent>
          </Card>
          <div className="flex justify-between">
            <Button
              variant="outline"
              disabled={current === 0}
              onClick={() => setCurrent((i) => i - 1)}
            >
              <ArrowLeft /> Previous
            </Button>
            {current < questions.length - 1 ? (
              <Button onClick={() => setCurrent((i) => i + 1)}>
                Next <ArrowRight />
              </Button>
            ) : (
              <Button onClick={() => setConfirm(true)}>
                Review & submit <Send />
              </Button>
            )}
          </div>
        </section>
      </div>
      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit your quiz?</DialogTitle>
            <DialogDescription>
              You answered {answered} of {questions.length} questions.{" "}
              {answered < questions.length &&
                `${questions.length - answered} unanswered question(s) will receive no credit.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm(false)}>
              Keep working
            </Button>
            <Button disabled={submit.isPending} onClick={() => void finish()}>
              {submit.isPending && <Loader2 className="animate-spin" />}Submit
              quiz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function QuizMessage({
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

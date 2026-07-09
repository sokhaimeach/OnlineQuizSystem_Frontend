import {
  AlertCircle,
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Loader2,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuizResult } from "@/hooks/api/useStudent";
import { cn } from "@/lib/utils";
import type {
  ResultWithAnswers,
  ResultSummary,
  ResultUnavailable,
} from "@/models/attempt.interface";
import { formatDateTime } from "@/utils/student-format";

export function StudentResultView() {
  const { attemptId = "" } = useParams();
  const query = useQuizResult(attemptId);
  const navigate = useNavigate();

  if (query.isLoading) {
    return (
      <main className="grid min-h-96 place-items-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="animate-spin" /> Loading result…
        </div>
      </main>
    );
  }

  const rawData = query.data as { data?: unknown } | undefined;
  const result = rawData?.data as
    | ResultUnavailable
    | ResultSummary
    | ResultWithAnswers
    | undefined;

  if (query.isError || !result) {
    return (
      <main className="mx-auto max-w-xl py-16">
        <div className="rounded-xl border border-destructive/30 p-10 text-center">
          <AlertCircle className="mx-auto size-10 text-destructive" />
          <h1 className="mt-3 text-xl font-bold">Result unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We could not load this result. It may have been removed or you may
            not have access.
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => query.refetch()}
          >
            Try again
          </Button>
          <Button
            className="mt-2"
            variant="ghost"
            onClick={() => navigate("/", { replace: true })}
          >
            Go back
          </Button>
        </div>
      </main>
    );
  }

  // Result not yet available (teacher hid it)
  if (!result.result_available) {
    const ra = result as ResultUnavailable;
    return (
      <main className="mx-auto max-w-2xl space-y-5 py-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft /> Back
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-amber-500/10 text-amber-600">
              <Clock3 />
            </span>
            <h1 className="mt-4 text-2xl font-bold">
              Result not available yet
            </h1>
            <p className="mt-2 text-muted-foreground">
              Your teacher has chosen to release results later.
            </p>
            <div className="mx-auto mt-5 max-w-sm rounded-lg border bg-muted/30 p-4">
              <p className="text-sm font-medium">
                {ra.assignment?.title ?? "Assignment"}
              </p>
              <p className="text-sm text-muted-foreground">
                {ra.quiz?.title ?? ""}
              </p>
              {ra.available_at && (
                <p className="mt-3 flex items-center justify-center gap-2 text-sm">
                  <CalendarClock className="size-4" /> Available{" "}
                  {formatDateTime(ra.available_at)}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Result without correct answers
  if (!("show_correct_answers" in result) || !result.show_correct_answers) {
    const summary = result as ResultSummary;
    const score = Number(summary.score) || 0;
    const total = Number(summary.total_score) || 1;
    const passing = Number(summary.passing_score) || 0;
    const percentage = (score / total) * 100;
    const passed = percentage >= passing;

    return (
      <main className="mx-auto max-w-4xl space-y-6 py-6">
        <Button variant="ghost" className="-ml-3" onClick={() => navigate(-1)}>
          <ArrowLeft /> Back
        </Button>

        <ResultHeader
          passed={passed}
          percentage={percentage}
          score={score}
          total={total}
          passing={passing}
          assignmentTitle={summary.assignment?.title ?? "Assignment"}
          quizTitle={summary.quiz?.title ?? ""}
        />

        <div className="grid grid-cols-3 gap-3">
          <SummaryCard
            icon={Target}
            label="Score"
            value={`${score}/${total}`}
          />
          <SummaryCard
            icon={CheckCircle2}
            label="Correct"
            value={summary.correct_count}
            good
          />
          <SummaryCard
            icon={XCircle}
            label="Wrong"
            value={summary.wrong_count}
          />
        </div>
      </main>
    );
  }

  // Full result with correct answers
  const detailed = result as ResultWithAnswers;
  const score = Number(detailed.total_score) || 0;
  const total = Number(detailed.assignment?.total_score || 1);
  const passing = Number(detailed.assignment?.passing_score || 0);
  const percentage = total ? (score / total) * 100 : 0;
  const passed = percentage >= passing;
  const assignmentTitle = detailed.assignment?.title ?? "Assignment";
  const quizTitle = detailed.assignment?.quiz?.title ?? "";

  return (
    <main className="mx-auto max-w-4xl space-y-6 py-6">
      <Button variant="ghost" className="-ml-3" onClick={() => navigate(-1)}>
        <ArrowLeft /> Back
      </Button>

      <ResultHeader
        passed={passed}
        percentage={percentage}
        score={score}
        total={total}
        passing={passing}
        assignmentTitle={assignmentTitle}
        quizTitle={quizTitle}
      />

      <div className="grid grid-cols-3 gap-3">
        <SummaryCard icon={Target} label="Score" value={`${score}/${total}`} />
        <SummaryCard
          icon={CheckCircle2}
          label="Correct"
          value={detailed.correct_count}
          good
        />
        <SummaryCard
          icon={XCircle}
          label="Wrong"
          value={detailed.wrong_count}
        />
      </div>

      {detailed.assignment?.quiz?.questions && (
        <QuestionReviewSection result={detailed} />
      )}
    </main>
  );
}

function ResultHeader({
  passed,
  percentage,
  score,
  total,
  passing,
  assignmentTitle,
  quizTitle,
}: {
  passed: boolean;
  percentage: number;
  score: number;
  total: number;
  passing: number;
  assignmentTitle: string;
  quizTitle: string;
}) {
  return (
    <Card className="overflow-hidden">
      <div
        className={cn("h-2", passed ? "bg-emerald-500" : "bg-destructive")}
      />
      <CardContent className="py-8 text-center">
        <span
          className={cn(
            "mx-auto grid size-16 place-items-center rounded-full",
            passed
              ? "bg-emerald-500/10 text-emerald-600"
              : "bg-destructive/10 text-destructive",
          )}
        >
          <Trophy className="size-8" />
        </span>
        <Badge className="mt-4" variant={passed ? "default" : "destructive"}>
          {passed ? "Passed" : "Needs improvement"}
        </Badge>
        <h1 className="mt-3 text-2xl font-bold">{assignmentTitle}</h1>
        <p className="text-muted-foreground">{quizTitle}</p>
        <p className="mt-5 text-4xl font-bold">
          {score}
          <span className="text-lg font-normal text-muted-foreground">
            {" "}
            / {total}
          </span>
        </p>
        <p className="text-sm text-muted-foreground">
          {Math.round(percentage)}% &middot; Passing score {passing}%
        </p>
      </CardContent>
    </Card>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  good,
}: {
  icon: typeof Target;
  label: string;
  value: string | number;
  good?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <Icon
          className={cn(
            "mx-auto size-5",
            good ? "text-emerald-600" : "text-muted-foreground",
          )}
        />
        <p className="mt-2 text-xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

function QuestionReviewSection({ result }: { result: ResultWithAnswers }) {
  const questions = [...(result.assignment?.quiz?.questions ?? [])].sort(
    (a, b) =>
      (result.question_order?.indexOf(a.id ?? "") ?? 0) -
      (result.question_order?.indexOf(b.id ?? "") ?? 0),
  );

  if (!questions.length) return null;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Question review</h2>
        <p className="text-sm text-muted-foreground">
          Your answers and their grading details.
        </p>
      </div>
      {questions.map((question, index) => {
        const answers = (question.answers ?? []).filter(
          (a) => a.attempt_id === result.id,
        );
        const correct =
          answers.length > 0 &&
          answers.every((a) => a.is_correct ?? a.selected_option?.is_correct);
        return (
          <Card key={question.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Question {index + 1} &middot; {question.score} points
                  </p>
                  <CardTitle className="mt-1 text-base">
                    {question.question_text}
                  </CardTitle>
                </div>
                <Badge variant={correct ? "default" : "destructive"}>
                  {correct ? "Correct" : "Incorrect"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {!answers.length && (
                <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  No answer selected
                </p>
              )}
              {answers.map((answer) => {
                const isCorrect =
                  answer.is_correct ?? answer.selected_option?.is_correct;
                return (
                  <div
                    key={answer.id}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border p-3 text-sm",
                      isCorrect
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                        : "border-destructive/40 bg-destructive/10 text-destructive",
                    )}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="size-4 shrink-0" />
                    ) : (
                      <XCircle className="size-4 shrink-0" />
                    )}
                    <span>
                      <span className="font-medium">Your answer: </span>
                      {answer.selected_option?.option_text ?? "Unknown option"}
                    </span>
                  </div>
                );
              })}
              <p className="pt-1 text-xs text-muted-foreground">
                Question score:{" "}
                {answers.reduce(
                  (sum, a) => sum + Number(a.score_earned ?? 0),
                  0,
                )}{" "}
                / {question.score}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}

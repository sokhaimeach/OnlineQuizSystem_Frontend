import { CheckCircle2, Circle, CircleDot, ListChecks, XCircle } from "lucide-react"
import { StatusBadge } from "@/components/StatusBadge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Option, QuestionAnswer, QuestionWithOptionsAndAnswers } from "@/models/quiz.interface"
import { formatEnum } from "@/utils/student-format"

interface QuestionReviewProps {
  questions: QuestionWithOptionsAndAnswers[]
}

function selectedOptionId(answer: QuestionAnswer) {
  const selected = answer.selected_option as (QuestionAnswer["selected_option"] & {
    selected_id?: string
  }) | undefined
  return answer.selected_option_id || selected?.id || selected?.selected_id || null
}

function selectedOptionIds(question: QuestionWithOptionsAndAnswers) {
  return new Set(
    question.answers
      .map(selectedOptionId)
      .filter((id): id is string => Boolean(id)),
  )
}

function isSelectedAnswerCorrect(option: Option, answers: QuestionAnswer[]) {
  return answers.some(answer => {
    const id = selectedOptionId(answer)
    return id === option.id && Boolean(answer.selected_option?.is_correct)
  })
}

function isOptionCorrect(option: Option, answers: QuestionAnswer[]) {
  return Boolean(option.is_correct) || isSelectedAnswerCorrect(option, answers)
}

function isQuestionCorrect(question: QuestionWithOptionsAndAnswers) {
  if (!question.answers.length) return false
  return question.answers.every(answer => Boolean(answer.selected_option?.is_correct))
}

function earnedScore(question: QuestionWithOptionsAndAnswers, correct: boolean) {
  const reportedScores = question.answers
    .map(answer => answer.score_earned)
    .filter((score): score is number => score != null)

  if (reportedScores.length) {
    return reportedScores.reduce((total, score) => total + score, 0)
  }

  return correct ? Number(question.score || 0) : 0
}

function correctAnswerText(question: QuestionWithOptionsAndAnswers) {
  const answers = [
    ...question.options.filter(option => Boolean(option.is_correct)).map(option => option.option_text),
    ...question.answers
      .filter(answer => Boolean(answer.selected_option?.is_correct))
      .map(answer => answer.selected_option?.option_text)
      .filter((answer): answer is string => Boolean(answer)),
  ]

  return Array.from(new Set(answers))
}

export function QuestionReview({ questions }: QuestionReviewProps) {
  const correctCount = questions.filter(isQuestionCorrect).length
  const incorrectCount = Math.max(questions.length - correctCount, 0)

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <ListChecks className="size-5 text-primary" />
            Question Review
          </h2>
          <p className="text-sm text-muted-foreground">
            Review selected answers alongside available correct-answer data.
          </p>
        </div>
        {questions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {questions.map((question, index) => {
              const correct = isQuestionCorrect(question)
              return (
                <Button
                  key={question.id ?? index}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-8 min-w-8 px-2 text-xs",
                    correct
                      ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400"
                      : "border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400",
                  )}
                  asChild
                >
                  <a href={`#question-${index + 1}`}>{index + 1}</a>
                </Button>
              )
            })}
          </div>
        )}
      </div>

      {questions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No questions found.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-border bg-card p-4">
              <p className="text-2xl font-semibold tabular-nums text-foreground">{questions.length}</p>
              <p className="mt-1 text-xs font-medium uppercase text-muted-foreground">Questions</p>
            </div>
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
              <p className="text-2xl font-semibold tabular-nums">{correctCount}</p>
              <p className="mt-1 text-xs font-medium uppercase">Correct</p>
            </div>
            <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
              <p className="text-2xl font-semibold tabular-nums">{incorrectCount}</p>
              <p className="mt-1 text-xs font-medium uppercase">Incorrect</p>
            </div>
          </div>

          <div className="space-y-4">
            {questions.map((question, index) => {
              const selectedIds = selectedOptionIds(question)
              const correct = isQuestionCorrect(question)
              const score = earnedScore(question, correct)
              const correctAnswers = correctAnswerText(question)

              return (
                <Card key={question.id ?? index} id={`question-${index + 1}`} className="scroll-mt-24">
                  <CardHeader className="space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-base">
                          Question {index + 1}
                        </CardTitle>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatEnum(question.question_type)}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge variant="primary">
                          {question.score} Points
                        </StatusBadge>
                        <StatusBadge variant={correct ? "success" : "danger"}>
                          {correct ? (
                            <CheckCircle2 className="size-3.5" />
                          ) : (
                            <XCircle className="size-3.5" />
                          )}
                          {correct ? "Correct" : "Incorrect"}
                        </StatusBadge>
                      </div>
                    </div>
                    <p className="text-base font-medium leading-7 text-foreground">
                      {question.question_text}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const selected = option.id ? selectedIds.has(option.id) : false
                        const optionCorrect = isOptionCorrect(option, question.answers)
                        const wrongSelection = selected && !optionCorrect
                        const neutralSelection = selected && !optionCorrect && !wrongSelection

                        return (
                          <div
                            key={option.id ?? `${index}-${optionIndex}`}
                            className={cn(
                              "flex items-start gap-3 rounded-md border px-3 py-2.5 text-sm transition-colors",
                              optionCorrect &&
                                "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
                              wrongSelection &&
                                "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
                              selected &&
                                !optionCorrect &&
                                "outline outline-2 outline-blue-500/50",
                              neutralSelection && "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-zinc-800",
                              !optionCorrect && !wrongSelection && !selected && "border-border bg-muted/20",
                            )}
                          >
                            {selected ? (
                              <CircleDot className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                            ) : (
                              <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="break-words">{option.option_text}</p>
                              <div className="mt-1 flex flex-wrap gap-2 text-xs font-medium">
                                {optionCorrect && (
                                  <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                                    <CheckCircle2 className="size-3.5" />
                                    Correct Answer
                                  </span>
                                )}
                                {selected && (
                                  <span className={cn(
                                    "inline-flex items-center gap-1",
                                    wrongSelection
                                      ? "text-red-700 dark:text-red-400"
                                      : "text-blue-700 dark:text-blue-400",
                                  )}>
                                    {wrongSelection ? (
                                      <XCircle className="size-3.5" />
                                    ) : (
                                      <CheckCircle2 className="size-3.5" />
                                    )}
                                    Your Answer
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="grid gap-3 rounded-md border border-border bg-muted/30 p-3 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium uppercase text-muted-foreground">Correct Answer</p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {correctAnswers.length ? correctAnswers.join(", ") : "Not available in this attempt"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase text-muted-foreground">Score Earned</p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {score} / {question.score}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      )}
    </section>
  )
}

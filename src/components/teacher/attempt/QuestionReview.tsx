import { CheckCircle2, XCircle } from "lucide-react"
import { StatusBadge } from "@/components/StatusBadge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { QuestionWithOptionsAndAnswers } from "@/models/quiz.interface"
import { formatEnum } from "@/utils/student-format"

interface QuestionReviewProps {
  questions: QuestionWithOptionsAndAnswers[]
}

function answerText(question: QuestionWithOptionsAndAnswers) {
  const answers = question.answers
    .map(answer => answer.selected_option?.option_text)
    .filter((answer): answer is string => Boolean(answer))
  return answers.length ? answers.join(", ") : "No answer"
}

export function QuestionReview({ questions }: QuestionReviewProps) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Question review</h2>
        <p className="text-sm text-muted-foreground">{questions.length} questions in this attempt</p>
      </div>
      {questions.map((question, index) => {
        const isCorrect = question.answers.length > 0 && question.answers.every(
          answer => answer.is_correct ?? answer.selected_option?.is_correct ?? false,
        )
        const reportedScores = question.answers
          .map(answer => answer.score_earned)
          .filter((score): score is number => score != null)
        const earnedScore = reportedScores.length
          ? reportedScores.reduce((total, score) => total + score, 0)
          : isCorrect ? question.score : 0
        const correctAnswers = question.options.filter(option => option.is_correct).map(option => option.option_text)

        return (
          <Card key={question.id ?? index}>
            <CardHeader className="gap-2">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <CardTitle className="text-base">Question {index + 1}</CardTitle>
                <StatusBadge variant={isCorrect ? "success" : "danger"}>
                  {isCorrect ? <CheckCircle2 className="size-3.5" /> : <XCircle className="size-3.5" />}
                  {isCorrect ? "Correct" : "Incorrect"}
                </StatusBadge>
              </div>
              <p className="text-sm leading-6">{question.question_text}</p>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <dt className="text-xs text-muted-foreground">Question type</dt>
                  <dd className="mt-1 text-sm">{formatEnum(question.question_type)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Correct answer</dt>
                  <dd className="mt-1 text-sm">{correctAnswers.join(", ") || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Student answer</dt>
                  <dd className="mt-1 text-sm">{answerText(question)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Score earned</dt>
                  <dd className="mt-1 text-sm font-medium">{earnedScore} / {question.score}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        )
      })}
    </section>
  )
}

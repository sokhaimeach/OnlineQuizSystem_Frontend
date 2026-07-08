import { ArrowLeft, CalendarClock, CheckCircle2, Clock3, Loader2, Target, Trophy, XCircle } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuizResult } from "@/hooks/api/useStudent"
import { cn } from "@/lib/utils"
import type { ResultWithAnswers } from "@/models/attempt.interface"
import { formatDateTime } from "@/utils/student-format"

export function StudentResultView() {
  const { attemptId = "" } = useParams()
  const query = useQuizResult(attemptId)
  const navigate = useNavigate()
  if (query.isLoading) return <div className="flex min-h-96 items-center justify-center gap-2 text-muted-foreground"><Loader2 className="animate-spin" /> Loading result…</div>
  if (query.isError || !query.data) return <div className="mx-auto max-w-xl rounded-xl border border-destructive/30 p-10 text-center"><h1 className="text-xl font-bold">Result unavailable</h1><p className="mt-2 text-sm text-muted-foreground">We could not load this result. Please try again.</p><Button className="mt-4" onClick={() => query.refetch()}>Try again</Button></div>
  const result = query.data
  if (!result.result_available) return <div className="mx-auto max-w-2xl space-y-5">
    <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft /> Back</Button>
    <Card><CardContent className="py-12 text-center"><span className="mx-auto grid size-14 place-items-center rounded-full bg-amber-500/10 text-amber-600"><Clock3 /></span><h1 className="mt-4 text-2xl font-bold">Result not available yet</h1><p className="mt-2 text-muted-foreground">Your teacher has chosen to release results later.</p><div className="mx-auto mt-5 max-w-sm rounded-lg border bg-muted/30 p-4"><p className="text-sm font-medium">{result.assignment.title}</p><p className="text-sm text-muted-foreground">{result.quiz.title}</p><p className="mt-3 flex items-center justify-center gap-2 text-sm"><CalendarClock className="size-4" /> Available {formatDateTime(result.available_at)}</p></div></CardContent></Card>
  </div>
  const detailed = result.show_correct_answers
  const score = detailed ? Number(result.total_score) : Number(result.score)
  const total = detailed ? Number(result.assignment.total_score || result.assignment.quiz.total_score) : Number(result.total_score)
  const passing = detailed ? result.assignment.passing_score ?? result.assignment.quiz.passing_score : result.passing_score
  const percentage = total ? (score / total) * 100 : 0
  const passed = percentage >= passing
  const assignmentTitle = detailed ? result.assignment.title : result.assignment.title
  const quizTitle = detailed ? result.assignment.quiz.title : result.quiz.title
  return <div className="mx-auto max-w-4xl space-y-6">
    <Button variant="ghost" className="-ml-3" onClick={() => navigate(-1)}><ArrowLeft /> Back</Button>
    <Card className="overflow-hidden"><div className={cn("h-2", passed ? "bg-emerald-500" : "bg-destructive")} /><CardContent className="py-8 text-center">
      <span className={cn("mx-auto grid size-16 place-items-center rounded-full", passed ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive")}><Trophy className="size-8" /></span>
      <Badge className="mt-4" variant={passed ? "default" : "destructive"}>{passed ? "Passed" : "Needs improvement"}</Badge>
      <h1 className="mt-3 text-2xl font-bold">{assignmentTitle}</h1><p className="text-muted-foreground">{quizTitle}</p>
      <p className="mt-5 text-4xl font-bold">{score}<span className="text-lg font-normal text-muted-foreground"> / {total}</span></p><p className="text-sm text-muted-foreground">{Math.round(percentage)}% · Passing score {passing}%</p>
    </CardContent></Card>
    <div className="grid grid-cols-3 gap-3"><Summary icon={Target} label="Score" value={`${score}/${total}`} /><Summary icon={CheckCircle2} label="Correct" value={result.correct_count} good /><Summary icon={XCircle} label="Wrong" value={result.wrong_count} /></div>
    {detailed && <QuestionReview result={result} />}
  </div>
}

function Summary({ icon: Icon, label, value, good }: { icon: typeof Target; label: string; value: string | number; good?: boolean }) {
  return <Card><CardContent className="p-4 text-center"><Icon className={cn("mx-auto size-5", good ? "text-emerald-600" : "text-muted-foreground")} /><p className="mt-2 text-xl font-bold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></CardContent></Card>
}

function QuestionReview({ result }: { result: ResultWithAnswers }) {
  const questions = [...result.assignment.quiz.questions].sort((a, b) => result.question_order.indexOf(a.id ?? "") - result.question_order.indexOf(b.id ?? ""))
  return <section className="space-y-4"><div><h2 className="text-xl font-bold">Question review</h2><p className="text-sm text-muted-foreground">Your answers and their grading details.</p></div>{questions.map((question, index) => {
    const answers = question.answers.filter(a => a.attempt_id === result.id)
    const correct = answers.length > 0 && answers.every(a => a.is_correct ?? a.selected_option?.is_correct)
    return <Card key={question.id}><CardHeader><div className="flex items-start justify-between gap-3"><div><p className="text-xs text-muted-foreground">Question {index + 1} · {question.score} points</p><CardTitle className="mt-1 text-base">{question.question_text}</CardTitle></div><Badge variant={correct ? "default" : "destructive"}>{correct ? "Correct" : "Incorrect"}</Badge></div></CardHeader><CardContent className="space-y-2">
      {!answers.length && <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">No answer selected</p>}
      {answers.map(answer => <div key={answer.id} className={cn("flex items-center gap-2 rounded-lg border p-3 text-sm", (answer.is_correct ?? answer.selected_option?.is_correct) ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300" : "border-destructive/40 bg-destructive/10 text-destructive")} >{(answer.is_correct ?? answer.selected_option?.is_correct) ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}<span><span className="font-medium">Your answer: </span>{answer.selected_option?.option_text ?? "Unknown option"}</span></div>)}
      <p className="pt-1 text-xs text-muted-foreground">Question score: {answers.reduce((sum, a) => sum + Number(a.score_earned ?? 0), 0)} / {question.score}</p>
    </CardContent></Card>
  })}</section>
}

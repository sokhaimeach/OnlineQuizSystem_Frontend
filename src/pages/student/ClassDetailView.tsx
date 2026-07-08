import { ArrowLeft, Calendar, CheckCircle2, Eye, Loader2, Target, XCircle } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useClassAttempts } from "@/hooks/api/useStudent"
import { formatDateTime } from "@/utils/student-format"

export function StudentClassDetailView() {
  const { classId = "" } = useParams()
  const attempts = useClassAttempts(classId)
  const navigate = useNavigate()
  return <div className="space-y-6">
    <div><Button variant="ghost" className="-ml-3 mb-2" onClick={() => navigate("/student/classes")}><ArrowLeft /> My Classes</Button><h1 className="text-2xl font-bold">Class attempts</h1><p className="text-muted-foreground">Your submitted quizzes and assignments for this class.</p></div>
    {attempts.isLoading ? <div className="flex items-center gap-2 py-16 justify-center text-muted-foreground"><Loader2 className="animate-spin" /> Loading attempts…</div>
    : attempts.isError ? <div className="rounded-lg border border-destructive/30 p-8 text-center">Attempts could not be loaded.</div>
    : !attempts.data?.length ? <div className="rounded-lg border border-dashed p-12 text-center"><Target className="mx-auto size-10 text-muted-foreground" /><h2 className="mt-3 font-semibold">No attempts yet</h2><p className="text-sm text-muted-foreground">Completed work will appear here.</p></div>
    : <div className="grid gap-4 md:grid-cols-2">{attempts.data.map(attempt => <Card key={attempt.id}>
      <CardHeader className="gap-2"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-medium uppercase tracking-wide text-primary">{attempt.assignment.type}</p><CardTitle className="mt-1">{attempt.assignment.title}</CardTitle><p className="mt-1 text-sm text-muted-foreground">{attempt.assignment.quiz.title}</p></div><Badge variant={attempt.submitted_at ? "default" : "secondary"}>{attempt.submitted_at ? "Submitted" : "In progress"}</Badge></div></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <Metric icon={Target} label="Score" value={attempt.total_score ?? "—"} />
          <Metric icon={CheckCircle2} label="Correct" value={attempt.correct_count} />
          <Metric icon={XCircle} label="Wrong" value={attempt.wrong_count} />
        </div>
        <p className="flex items-center gap-2 text-xs text-muted-foreground"><Calendar className="size-3.5" />{formatDateTime(attempt.submitted_at)}</p>
        <Button className="w-full" variant="outline" disabled={!attempt.submitted_at} onClick={() => navigate(`/student/result/${attempt.id}`)}><Eye /> View result</Button>
      </CardContent>
    </Card>)}</div>}
  </div>
}

function Metric({ icon: Icon, label, value }: { icon: typeof Target; label: string; value: string | number }) {
  return <div className="rounded-lg bg-muted/60 p-3 text-center"><Icon className="mx-auto size-4 text-muted-foreground" /><p className="mt-1 font-bold">{value}</p><p className="text-[11px] text-muted-foreground">{label}</p></div>
}

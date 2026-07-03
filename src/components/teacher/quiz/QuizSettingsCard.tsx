import { Check, Clock3, Eye, EyeOff, FileQuestion, Trophy, X } from "lucide-react"
import { StatusBadge } from "@/components/StatusBadge"
import type { QuizWithQuestions } from "@/models/quiz.interface"
import { formatDateTime } from "@/utils/student-format"

function BooleanSetting({ label, enabled }: { label: string; enabled: boolean }) {
  const Icon = enabled ? Check : X
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border py-2.5 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="flex items-center gap-1.5 text-sm font-medium">
        <Icon className="size-3.5" /> {enabled ? "Enabled" : "Disabled"}
      </span>
    </div>
  )
}

export function QuizSettingsCard({ quiz }: { quiz: QuizWithQuestions }) {
  const metadata = [
    { label: "Duration", value: `${quiz.duration_minutes} minutes`, icon: Clock3 },
    { label: "Passing score", value: `${quiz.passing_score}%`, icon: Trophy },
    { label: "Total score", value: String(quiz.total_score), icon: Trophy },
    { label: "Questions", value: String(quiz.questions.length), icon: FileQuestion },
    { label: "Created", value: formatDateTime(quiz.createdAt) },
    { label: "Updated", value: formatDateTime(quiz.updatedAt) },
  ]

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)]">
      <section className="rounded-md border border-border bg-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold">Quiz Information</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {quiz.description || "No description provided."}
            </p>
          </div>
          <StatusBadge variant={quiz.is_public ? "success" : "muted"} dot>
            {quiz.is_public ? "Published" : "Draft"}
          </StatusBadge>
        </div>
        <dl className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {metadata.map(item => (
            <div key={item.label} className="rounded-md border border-border bg-muted/20 p-3">
              <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {item.icon && <item.icon className="size-3.5" />} {item.label}
              </dt>
              <dd className="mt-1 text-sm font-medium">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-md border border-border bg-card p-5">
        <h2 className="text-base font-semibold">Behavior</h2>
        <div className="mt-3">
          <BooleanSetting label="Show results immediately" enabled={quiz.show_result_immediately} />
          <BooleanSetting label="Show correct answers" enabled={quiz.show_correct_answers} />
          <BooleanSetting label="Randomize questions" enabled={quiz.randomize_questions} />
          <div className="flex items-center justify-between gap-3 pt-2.5">
            <span className="text-sm text-muted-foreground">Visibility</span>
            <span className="flex items-center gap-1.5 text-sm font-medium">
              {quiz.is_public ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
              {quiz.is_public ? "Public" : "Private"}
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}

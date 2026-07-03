import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Quiz } from "@/models/quiz.interface"

interface QuizDetailHeaderProps {
  quiz: Quiz
  onBack: () => void
  onEdit: () => void
  onAddQuestions: () => void
  onDelete: () => void
}

export function QuizDetailHeader({
  quiz,
  onBack,
  onEdit,
  onAddQuestions,
  onDelete,
}: QuizDetailHeaderProps) {
  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2 gap-1.5 text-muted-foreground">
        <ArrowLeft className="size-4" /> Back to subject
      </Button>
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Quiz management</p>
          <h1 className="mt-1 truncate text-xl font-semibold tracking-tight">{quiz.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage quiz information, settings, and questions.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={onEdit} className="gap-1.5">
            <Pencil className="size-4" /> Edit quiz
          </Button>
          <Button size="sm" onClick={onAddQuestions} className="gap-1.5">
            <Plus className="size-4" /> Add questions
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive"
            aria-label="Delete quiz"
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    </div>
  )
}

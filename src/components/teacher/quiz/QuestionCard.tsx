import { Check, Pencil, Trash2 } from "lucide-react"
import { StatusBadge } from "@/components/StatusBadge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { QuestionWithOptions } from "@/models/quiz.interface"
import { formatEnum } from "@/utils/student-format"

interface QuestionCardProps {
  question: QuestionWithOptions
  index: number
  onEdit: () => void
  onDelete: () => void
}

export function QuestionCard({ question, index, onEdit, onDelete }: QuestionCardProps) {
  const correctCount = question.options.filter(option => option.is_correct).length

  return (
    <article className="rounded-lg border border-border bg-card">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
            {index + 1}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold leading-6">{question.question_text}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge variant="muted">{formatEnum(question.question_type)}</StatusBadge>
              <span className="text-xs text-muted-foreground">{question.score} points</span>
              <span className="text-xs text-muted-foreground">
                {correctCount} correct {correctCount === 1 ? "answer" : "answers"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1 self-end sm:self-start">
          <Button variant="ghost" size="sm" onClick={onEdit} className="gap-1.5">
            <Pencil className="size-3.5" /> Edit
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive"
            aria-label={`Delete question ${index + 1}`}
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      <div className="grid gap-2 p-4 sm:grid-cols-2">
        {question.options.map((option, optionIndex) => (
          <div
            key={option.id ?? optionIndex}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-md border px-3 py-2 text-sm",
              option.is_correct
                ? "border-primary/50 bg-primary/10 text-foreground"
                : "border-border bg-muted/20 text-muted-foreground",
            )}
          >
            <span className={cn(
              "flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-medium",
              option.is_correct
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border",
            )}>
              {option.is_correct ? <Check className="size-3" strokeWidth={3} /> : optionIndex + 1}
            </span>
            <span className="min-w-0 flex-1">{option.option_text}</span>
            {option.is_correct && <span className="text-xs font-medium text-primary">Correct</span>}
          </div>
        ))}
      </div>
    </article>
  )
}

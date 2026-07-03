import { useEffect, useState, type FormEvent } from "react"
import { SearchableSelectInput } from "@/components/SearchableSelectInput"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useGetSubjectOptions } from "@/hooks/api/useSubject"
import { cn } from "@/lib/utils"
import type { Quiz, UpdateQuizPayload } from "@/models/quiz.interface"

interface EditQuizDialogProps {
  quiz: Quiz | null
  saving: boolean
  error?: string
  onOpenChange: (open: boolean) => void
  onSave: (payload: UpdateQuizPayload) => void
}

function SettingSwitch({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-border p-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          checked ? "border-primary bg-primary" : "border-input bg-muted",
        )}
      >
        <span className={cn(
          "block size-4 rounded-full bg-background shadow-sm transition-transform",
          checked ? "translate-x-6" : "translate-x-1",
        )} />
      </button>
    </div>
  )
}

export function EditQuizDialog({
  quiz,
  saving,
  error,
  onOpenChange,
  onSave,
}: EditQuizDialogProps) {
  const { data: subjects = [], isLoading: loadingSubjects } = useGetSubjectOptions()
  const [form, setForm] = useState<UpdateQuizPayload | null>(null)

  useEffect(() => {
    if (!quiz) return
    setForm({
      subject_id: quiz.subject_id,
      title: quiz.title,
      description: quiz.description,
      duration_minutes: quiz.duration_minutes,
      is_public: quiz.is_public,
      passing_score: quiz.passing_score,
      show_result_immediately: quiz.show_result_immediately,
      show_correct_answers: quiz.show_correct_answers,
      randomize_questions: quiz.randomize_questions,
    })
  }, [quiz])

  if (!form) return null

  const setValue = <Key extends keyof UpdateQuizPayload>(key: Key, value: UpdateQuizPayload[Key]) => {
    setForm(current => current ? { ...current, [key]: value } : current)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!form.title.trim() || form.duration_minutes < 1 || form.passing_score < 0 || form.passing_score > 100) return
    onSave({ ...form, title: form.title.trim(), description: form.description.trim() })
  }

  return (
    <Dialog open={Boolean(quiz)} onOpenChange={open => !saving && onOpenChange(open)}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit quiz</DialogTitle>
          <DialogDescription>Update quiz information, scoring, visibility, and student feedback settings.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
              Subject
              <SearchableSelectInput
                options={subjects.map(subject => ({ value: subject.id, label: subject.subject_name }))}
                value={form.subject_id ?? undefined}
                onValueChange={value => setValue("subject_id", value ?? null)}
                disabled={loadingSubjects || saving}
                placeholder={loadingSubjects ? "Loading subjects…" : "Search or select a subject"}
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
              Quiz title <span className="text-destructive">*</span>
              <Input
                value={form.title}
                onChange={event => setValue("title", event.target.value)}
                disabled={saving}
                required
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
              Description
              <Textarea
                value={form.description}
                onChange={event => setValue("description", event.target.value)}
                disabled={saving}
                rows={3}
                className="resize-none"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              Duration (minutes)
              <Input
                type="number"
                min={1}
                value={form.duration_minutes}
                onChange={event => setValue("duration_minutes", Number(event.target.value))}
                disabled={saving}
                required
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              Passing score (%)
              <Input
                type="number"
                min={0}
                max={100}
                value={form.passing_score}
                onChange={event => setValue("passing_score", Number(event.target.value))}
                disabled={saving}
                required
              />
            </label>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <SettingSwitch
              label="Public quiz"
              description="Make this quiz available for assignments."
              checked={form.is_public}
              onChange={value => setValue("is_public", value)}
            />
            <SettingSwitch
              label="Show results immediately"
              description="Reveal scores after submission."
              checked={form.show_result_immediately}
              onChange={value => setValue("show_result_immediately", value)}
            />
            <SettingSwitch
              label="Show correct answers"
              description="Reveal correct options with results."
              checked={form.show_correct_answers}
              onChange={value => setValue("show_correct_answers", value)}
            />
            <SettingSwitch
              label="Randomize questions"
              description="Use a different order per attempt."
              checked={form.randomize_questions}
              onChange={value => setValue("randomize_questions", value)}
            />
          </div>

          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" disabled={saving} onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !form.title.trim() || form.duration_minutes < 1}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

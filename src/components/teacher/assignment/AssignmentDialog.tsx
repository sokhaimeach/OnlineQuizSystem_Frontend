import { useMemo, useState, type FormEvent } from "react"
import { CalendarDays, Clock3, FileQuestion, Settings2 } from "lucide-react"
import type { AssignmentWithQuiz, CreateAssignment } from "@/models/assignment.interface"
import type { QuizOption } from "@/models/quiz.interface"
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
import { cn } from "@/lib/utils"

interface AssignmentDialogProps {
  open: boolean
  classId: string
  assignment?: AssignmentWithQuiz | null
  quizzes: QuizOption[]
  loadingQuizzes?: boolean
  saving: boolean
  error?: string
  onOpenChange: (open: boolean) => void
  onSave: (payload: CreateAssignment) => void
}

function toInputDate(value?: string) {
  if (!value) return ""
  const isoDate = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0]
  if (isoDate) return isoDate
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  return match ? `${match[3]}-${match[1]}-${match[2]}` : ""
}

function toApiDate(value: string) {
  const [year, month, day] = value.split("-")
  return `${year}-${month}-${day}`
}

function AssignmentForm({
  classId,
  assignment,
  quizzes,
  loadingQuizzes,
  saving,
  error,
  onOpenChange,
  onSave,
}: Omit<AssignmentDialogProps, "open">) {
  const defaultQuizId = assignment?.quiz_id ?? quizzes[0]?.id ?? ""
  const [quizId, setQuizId] = useState(defaultQuizId)
  const [title, setTitle] = useState(assignment?.title ?? "")
  const [instructions, setInstructions] = useState(assignment?.instructions ?? "")
  const [type, setType] = useState<CreateAssignment["type"]>(assignment?.type ?? "QUIZ")
  const [status, setStatus] = useState<CreateAssignment["status"]>(assignment?.status ?? "DRAFT")
  const [startDate, setStartDate] = useState(toInputDate(assignment?.start_date))
  const [dueDate, setDueDate] = useState(toInputDate(assignment?.due_date))
  const [allowLateSubmission, setAllowLateSubmission] = useState(assignment?.allow_late_submission ?? false)
  const [touched, setTouched] = useState({
    quiz: false,
    title: false,
    startDate: false,
    dueDate: false,
  })

  const quizOptions = useMemo<QuizOption[]>(() => {
    const editingQuiz = assignment?.quiz
    if (!editingQuiz || quizzes.some(quiz => quiz.id === editingQuiz.id)) return quizzes
    return [{
      id: editingQuiz.id,
      title: editingQuiz.title,
      description: editingQuiz.description,
      duration_minutes: editingQuiz.duration_minutes,
      status: editingQuiz.status,
    }, ...quizzes]
  }, [assignment, quizzes])

  const selectedQuiz = quizOptions.find(quiz => quiz.id === quizId)
  const dateRangeError = startDate && dueDate && dueDate < startDate
    ? "Due date must be on or after the start date."
    : ""
  const isFormComplete = Boolean(quizId && title.trim() && startDate && dueDate && !dateRangeError)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setTouched({ quiz: true, title: true, startDate: true, dueDate: true })
    if (!isFormComplete) return

    onSave({
      quiz_id: quizId,
      class_id: classId,
      title: title.trim(),
      type,
      instructions: instructions.trim(),
      start_date: toApiDate(startDate),
      due_date: toApiDate(dueDate),
      allow_late_submission: allowLateSubmission,
      status,
    })
  }

  const isEditing = Boolean(assignment)

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <DialogHeader className="pr-6">
        <DialogTitle>{isEditing ? "Edit assignment" : "Create assignment"}</DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Update the assignment content, schedule, and availability."
            : "Choose a quiz, then configure how and when students can access it."}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <section className="grid content-start gap-5 rounded-lg border border-border bg-card p-4">
          <div className="flex items-start gap-3 border-b border-border pb-3">
            <div className="rounded-md border border-border bg-muted p-2">
              <FileQuestion className="size-4 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Assignment Details</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Select the resource and describe the work.
              </p>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">
              Quiz <span className="text-destructive">*</span>
            </label>
            <SearchableSelectInput
              options={quizOptions.map(quiz => ({
                value: quiz.id,
                label: quiz.title,
                description: quiz.description,
              }))}
              value={quizId}
              onValueChange={value => {
                setQuizId(value ?? "")
                setTouched(current => ({ ...current, quiz: true }))
              }}
              disabled={loadingQuizzes}
              placeholder={loadingQuizzes ? "Loading quizzes…" : "Search your quiz library"}
              emptyMessage="No matching quizzes found."
            />
            {touched.quiz && !quizId ? (
              <p className="text-xs text-destructive">Select a quiz to assign.</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Search by title or description to select an existing quiz.
              </p>
            )}

            {selectedQuiz && (
              <div className="mt-1 rounded-md border border-border bg-muted/30 p-3">
                <p className="truncate text-sm font-medium">{selectedQuiz.title}</p>
                {selectedQuiz.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {selectedQuiz.description}
                  </p>
                )}
                {(selectedQuiz.question_count !== undefined
                  || selectedQuiz.duration_minutes !== undefined
                  || selectedQuiz.difficulty_level) && (
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-3 text-xs text-muted-foreground">
                    {selectedQuiz.question_count !== undefined && (
                      <span className="flex items-center gap-1.5">
                        <FileQuestion className="size-3.5" />
                        {selectedQuiz.question_count} questions
                      </span>
                    )}
                    {selectedQuiz.duration_minutes !== undefined && (
                      <span className="flex items-center gap-1.5">
                        <Clock3 className="size-3.5" />
                        {selectedQuiz.duration_minutes} minutes
                      </span>
                    )}
                    {selectedQuiz.difficulty_level && (
                      <span className="capitalize">{selectedQuiz.difficulty_level}</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <label htmlFor="assignment-title" className="text-sm font-medium">
              Assignment title <span className="text-destructive">*</span>
            </label>
            <Input
              id="assignment-title"
              value={title}
              onChange={event => setTitle(event.target.value)}
              onBlur={() => setTouched(current => ({ ...current, title: true }))}
              aria-invalid={touched.title && !title.trim()}
              placeholder="e.g. Chapter 3 knowledge check"
              required
            />
            {touched.title && !title.trim() ? (
              <p className="text-xs text-destructive">Assignment title is required.</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Use a clear title students will recognize.
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <label htmlFor="assignment-instructions" className="text-sm font-medium">
              Instructions
            </label>
            <Textarea
              id="assignment-instructions"
              value={instructions}
              onChange={event => setInstructions(event.target.value)}
              placeholder="Add context, expectations, or preparation notes…"
              className="min-h-28 resize-none"
            />
            <p className="text-xs text-muted-foreground">Optional guidance shown to students.</p>
          </div>
        </section>

        <section className="grid content-start gap-5 rounded-lg border border-border bg-card p-4">
          <div className="flex items-start gap-3 border-b border-border pb-3">
            <div className="rounded-md border border-border bg-muted p-2">
              <Settings2 className="size-4 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Assignment Settings</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Configure publishing and availability.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              Type
              <select
                className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                value={type}
                onChange={event => setType(event.target.value as CreateAssignment["type"])}
              >
                <option value="QUIZ">Quiz</option>
                <option value="HOMEWORK">Homework</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Status
              <select
                className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                value={status}
                onChange={event => setStatus(event.target.value as CreateAssignment["status"])}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="CLOSED">Closed</option>
              </select>
            </label>
          </div>
          <p className="-mt-2 text-xs text-muted-foreground">
            Drafts remain hidden until you publish them.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid content-start gap-2">
              <label htmlFor="assignment-start-date" className="text-sm font-medium">
                Start date <span className="text-destructive">*</span>
              </label>
              <Input
                id="assignment-start-date"
                type="date"
                value={startDate}
                onChange={event => setStartDate(event.target.value)}
                onBlur={() => setTouched(current => ({ ...current, startDate: true }))}
                aria-invalid={touched.startDate && !startDate}
                required
              />
              {touched.startDate && !startDate && (
                <p className="text-xs text-destructive">Start date is required.</p>
              )}
            </div>
            <div className="grid content-start gap-2">
              <label htmlFor="assignment-due-date" className="text-sm font-medium">
                Due date <span className="text-destructive">*</span>
              </label>
              <Input
                id="assignment-due-date"
                type="date"
                min={startDate || undefined}
                value={dueDate}
                onChange={event => setDueDate(event.target.value)}
                onBlur={() => setTouched(current => ({ ...current, dueDate: true }))}
                aria-invalid={Boolean((touched.dueDate && !dueDate) || dateRangeError)}
                required
              />
              {touched.dueDate && !dueDate && (
                <p className="text-xs text-destructive">Due date is required.</p>
              )}
            </div>
          </div>
          {dateRangeError ? (
            <p className="-mt-2 text-xs text-destructive">{dateRangeError}</p>
          ) : (
            <p className="-mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5" />
              Students can access the assignment during this window.
            </p>
          )}

          <div className="flex items-center justify-between gap-4 rounded-md border border-border bg-muted/30 p-3">
            <div>
              <p className="text-sm font-medium">Allow late submissions</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Accept responses after the due date.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={allowLateSubmission}
              aria-label="Allow late submissions"
              onClick={() => setAllowLateSubmission(current => !current)}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                allowLateSubmission
                  ? "border-primary bg-primary"
                  : "border-input bg-muted",
              )}
            >
              <span
                className={cn(
                  "block size-4 rounded-full bg-background shadow-sm transition-transform",
                  allowLateSubmission ? "translate-x-6" : "translate-x-1",
                )}
              />
            </button>
          </div>
        </section>
      </div>

      {error && (
        <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <DialogFooter className="border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving || !isFormComplete}>
          {saving ? "Saving…" : isEditing ? "Save changes" : "Create assignment"}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function AssignmentDialog(props: AssignmentDialogProps) {
  const formKey = `${props.assignment?.id ?? "create"}-${props.open}`
  return (
    <Dialog open={props.open} onOpenChange={open => !props.saving && props.onOpenChange(open)}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        {props.open && <AssignmentForm key={formKey} {...props} />}
      </DialogContent>
    </Dialog>
  )
}

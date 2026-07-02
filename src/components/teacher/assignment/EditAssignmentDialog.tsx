import { useState, type FormEvent } from "react"
import type { AssignmentStatus, AssignmentWithQuiz, CreateAssignment } from "@/models/assignment.interface"
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

interface EditAssignmentDialogProps {
  assignment: AssignmentWithQuiz | null
  saving: boolean
  error?: string
  onClose: () => void
  onSave: (payload: Partial<CreateAssignment>) => void
}

function toLocalDateTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

function EditAssignmentForm({
  assignment,
  saving,
  error,
  onClose,
  onSave,
}: Omit<EditAssignmentDialogProps, "assignment"> & { assignment: AssignmentWithQuiz }) {
  const [title, setTitle] = useState(assignment.title)
  const [instructions, setInstructions] = useState(assignment.instructions ?? "")
  const [type, setType] = useState<CreateAssignment["type"]>(assignment.type)
  const [status, setStatus] = useState<AssignmentStatus>(assignment.status)
  const [startDate, setStartDate] = useState(toLocalDateTime(assignment.start_date))
  const [dueDate, setDueDate] = useState(toLocalDateTime(assignment.due_date))
  const [allowLateSubmission, setAllowLateSubmission] = useState(assignment.allow_late_submission)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSave({
      quiz_id: assignment.quiz_id,
      class_id: assignment.class_id,
      title: title.trim(),
      instructions: instructions.trim(),
      type,
      status,
      start_date: new Date(startDate).toISOString(),
      due_date: new Date(dueDate).toISOString(),
      allow_late_submission: allowLateSubmission,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <DialogHeader>
        <DialogTitle>Edit assignment</DialogTitle>
        <DialogDescription>Draft assignments can be changed until they are published.</DialogDescription>
      </DialogHeader>

      <div className="grid gap-3">
        <label className="grid gap-1.5 text-sm font-medium">
          Title
          <Input value={title} onChange={event => setTitle(event.target.value)} required />
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          Instructions
          <Textarea value={instructions} onChange={event => setInstructions(event.target.value)} />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-medium">
            Type
            <select
              className="h-8 rounded-md border border-input bg-background px-2.5 text-sm"
              value={type}
              onChange={event => setType(event.target.value as CreateAssignment["type"])}
            >
              <option value="QUIZ">Quiz</option>
              <option value="HOMEWORK">Homework</option>
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Status
            <select
              className="h-8 rounded-md border border-input bg-background px-2.5 text-sm"
              value={status}
              onChange={event => setStatus(event.target.value as AssignmentStatus)}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="CLOSED">Closed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-medium">
            Start date
            <Input type="datetime-local" value={startDate} onChange={event => setStartDate(event.target.value)} required />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Due date
            <Input type="datetime-local" value={dueDate} onChange={event => setDueDate(event.target.value)} required />
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            className="size-4 accent-primary"
            checked={allowLateSubmission}
            onChange={event => setAllowLateSubmission(event.target.checked)}
          />
          Allow late submissions
        </label>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
        <Button type="submit" disabled={saving || !title.trim()}>{saving ? "Saving…" : "Save changes"}</Button>
      </DialogFooter>
    </form>
  )
}

export function EditAssignmentDialog(props: EditAssignmentDialogProps) {
  return (
    <Dialog open={Boolean(props.assignment)} onOpenChange={open => !open && props.onClose()}>
      <DialogContent className="sm:max-w-xl">
        {props.assignment && <EditAssignmentForm key={props.assignment.id} {...props} assignment={props.assignment} />}
      </DialogContent>
    </Dialog>
  )
}

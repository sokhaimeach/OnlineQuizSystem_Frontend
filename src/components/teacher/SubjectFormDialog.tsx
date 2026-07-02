import { useEffect, useState, type FormEvent } from 'react'
import type { CreateSubjectPayload, Subject } from '@/models/subject.interface'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface SubjectFormDialogProps {
  open: boolean
  subject?: Subject | null
  isSubmitting: boolean
  error?: string
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: CreateSubjectPayload) => void
}

export function SubjectFormDialog({
  open,
  subject,
  isSubmitting,
  error,
  onOpenChange,
  onSubmit,
}: SubjectFormDialogProps) {
  const [subjectName, setSubjectName] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (!open) return
    setSubjectName(subject?.subject_name ?? '')
    setDescription(subject?.description ?? '')
  }, [open, subject])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = subjectName.trim()
    if (!trimmedName) return
    onSubmit({
      subject_name: trimmedName,
      description: description.trim(),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>{subject ? 'Edit subject' : 'Create subject'}</DialogTitle>
          <DialogDescription>
            {subject ? 'Update this subject’s details.' : 'Add a subject to organize your quizzes.'}
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-3" onSubmit={handleSubmit}>
          <label className="grid gap-1.5 text-xs font-medium">
            Subject Name
            <Input
              autoFocus
              required
              maxLength={100}
              value={subjectName}
              onChange={(event) => setSubjectName(event.target.value)}
              placeholder="e.g. Mathematics"
              disabled={isSubmitting}
            />
          </label>
          <label className="grid gap-1.5 text-xs font-medium">
            Description <span className="sr-only">(optional)</span>
            <Textarea
              rows={3}
              maxLength={500}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Optional description"
              disabled={isSubmitting}
              className="resize-none"
            />
          </label>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <DialogFooter className="mt-1">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !subjectName.trim()}>
              {isSubmitting ? 'Saving…' : subject ? 'Save changes' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

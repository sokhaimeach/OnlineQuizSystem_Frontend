import type { QuestionWithOptions } from "@/models/quiz.interface"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DeleteQuestionDialogProps {
  question: QuestionWithOptions | null
  deleting: boolean
  error?: string
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DeleteQuestionDialog({
  question,
  deleting,
  error,
  onOpenChange,
  onConfirm,
}: DeleteQuestionDialogProps) {
  return (
    <Dialog open={Boolean(question)} onOpenChange={open => !deleting && onOpenChange(open)}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete question?</DialogTitle>
          <DialogDescription>
            “{question?.question_text}” will be permanently removed from this quiz.
          </DialogDescription>
        </DialogHeader>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button type="button" variant="outline" disabled={deleting} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" disabled={deleting} onClick={onConfirm}>
            {deleting ? "Deleting…" : "Delete question"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

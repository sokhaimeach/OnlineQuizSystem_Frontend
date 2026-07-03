import type { Quiz } from "@/models/quiz.interface"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DeleteQuizDialogProps {
  quiz: Pick<Quiz, "id" | "title"> | null
  deleting: boolean
  error?: string
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DeleteQuizDialog({
  quiz,
  deleting,
  error,
  onOpenChange,
  onConfirm,
}: DeleteQuizDialogProps) {
  return (
    <Dialog open={Boolean(quiz)} onOpenChange={open => !deleting && onOpenChange(open)}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete quiz?</DialogTitle>
          <DialogDescription>
            “{quiz?.title}” and all of its questions will be permanently deleted. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button type="button" variant="outline" disabled={deleting} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" disabled={deleting} onClick={onConfirm}>
            {deleting ? "Deleting…" : "Delete quiz"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

import type { Class } from '@/models/class.interface'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface DeleteClassDialogProps {
  classItem: Class | null
  isDeleting: boolean
  error?: string
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DeleteClassDialog({
  classItem,
  isDeleting,
  error,
  onOpenChange,
  onConfirm,
}: DeleteClassDialogProps) {
  return (
    <Dialog open={Boolean(classItem)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>Delete class?</DialogTitle>
          <DialogDescription>
            “{classItem?.class_name}” will be permanently removed. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <DialogFooter>
          <Button type="button" variant="outline" disabled={isDeleting} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" disabled={isDeleting} onClick={onConfirm}>
            {isDeleting ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

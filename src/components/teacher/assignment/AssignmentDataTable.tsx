import { useMemo, useState } from "react"
import { Eye, Link2, MoreHorizontal, Pencil, QrCode, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { ColumnDef } from "@/components/data-table"
import { DataTable } from "@/components/data-table"
import { StatusBadge } from "@/components/StatusBadge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { AssignmentStatus, AssignmentWithQuiz } from "@/models/assignment.interface"
import { formatDateTime, formatEnum } from "@/utils/student-format"
import type { AssignmentShareMode } from "./AssignmentShareDialog"

interface AssignmentTableProps {
  assignments: AssignmentWithQuiz[]
  loading?: boolean
  deletingId?: string
  onViewAttempts: (assignmentId: string) => void
  onEdit: (assignment: AssignmentWithQuiz) => void
  onDelete: (assignment: AssignmentWithQuiz) => void
  onShare: (assignment: AssignmentWithQuiz, mode: AssignmentShareMode) => void
}

function copyShareLink(assignment: AssignmentWithQuiz) {
  const url = `${window.location.origin}/do-quiz/${assignment.id}`
  navigator.clipboard.writeText(url).then(
    () => toast.success("Link copied", { description: `Share link for "${assignment.title}" copied to clipboard.` }),
    () => toast.error("Could not copy link"),
  )
}

const statusVariant: Record<AssignmentStatus, "muted" | "success" | "danger" | "warning"> = {
  DRAFT: "muted",
  PUBLISHED: "success",
  CLOSED: "danger",
}

export function AssignmentTable({
  assignments,
  loading,
  deletingId,
  onViewAttempts,
  onEdit,
  onDelete,
  onShare,
}: AssignmentTableProps) {
  const [pendingDelete, setPendingDelete] = useState<AssignmentWithQuiz | null>(null)
  const columns = useMemo<ColumnDef<AssignmentWithQuiz>[]>(() => [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
    },
    {
      id: "quiz_title",
      header: "Quiz Title",
      accessorFn: assignment => assignment.quiz?.title ?? "",
      cell: ({ row }) => row.original.quiz?.title ?? "Quiz unavailable",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => formatEnum(row.original.type),
    },
    {
      accessorKey: "start_date",
      header: "Start Date",
      cell: ({ row }) => formatDateTime(row.original.start_date),
    },
    {
      accessorKey: "due_date",
      header: "Due Date",
      cell: ({ row }) => formatDateTime(row.original.due_date),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge variant={statusVariant[row.original.status]} dot>
          {formatEnum(row.original.status)}
        </StatusBadge>
      ),
    },
    {
      accessorKey: "allow_late_submission",
      header: "Late Submission Allowed",
      cell: ({ row }) => row.original.allow_late_submission ? "Yes" : "No",
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => {
        const assignment = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${assignment.title}`}>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onSelect={() => onViewAttempts(assignment.id)}>
                <Eye /> View attempts
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onEdit(assignment)}>
                <Pencil /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => copyShareLink(assignment)}>
                <Link2 /> Share link
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onShare(assignment, "qr")}>
                <QrCode /> Show QR code
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => setPendingDelete(assignment)}>
                <Trash2 /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ], [onEdit, onShare, onViewAttempts])

  const isDeleting = pendingDelete?.id === deletingId
  const confirmDelete = () => {
    if (!pendingDelete) return
    onDelete(pendingDelete)
    setPendingDelete(null)
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={assignments}
        loading={loading}
        getRowId={assignment => assignment.id}
        emptyState="No assignments match the current filters."
      />
      <Dialog open={Boolean(pendingDelete)} onOpenChange={open => !open && !isDeleting && setPendingDelete(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete assignment?</DialogTitle>
            <DialogDescription>
              “{pendingDelete?.title}” will be permanently deleted. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" disabled={isDeleting} onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" disabled={isDeleting} onClick={confirmDelete}>
              {isDeleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

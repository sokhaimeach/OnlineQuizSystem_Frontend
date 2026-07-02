import { useMemo } from "react"
import { Eye, Pencil, Trash2 } from "lucide-react"
import type { ColumnDef } from "@/components/data-table"
import { DataTable } from "@/components/data-table"
import { StatusBadge } from "@/components/StatusBadge"
import { Button } from "@/components/ui/button"
import type { AssignmentStatus, AssignmentWithQuiz } from "@/models/assignment.interface"
import { formatDateTime, formatEnum } from "@/utils/student-format"

interface ClassAssignmentTableProps {
  assignments: AssignmentWithQuiz[]
  loading?: boolean
  deletingId?: string
  onViewAttempts: (assignmentId: string) => void
  onEdit: (assignment: AssignmentWithQuiz) => void
  onDelete: (assignment: AssignmentWithQuiz) => void
}

const statusVariant: Record<AssignmentStatus, "muted" | "success" | "danger" | "warning"> = {
  DRAFT: "muted",
  PUBLISHED: "success",
  CLOSED: "danger",
  ARCHIVED: "warning",
}

export function ClassAssignmentTable({
  assignments,
  loading,
  deletingId,
  onViewAttempts,
  onEdit,
  onDelete,
}: ClassAssignmentTableProps) {
  const columns = useMemo<ColumnDef<AssignmentWithQuiz>[]>(() => [
    {
      accessorKey: "title",
      header: "Assignment",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.title}</p>
          <p className="text-xs text-muted-foreground">{row.original.quiz?.title ?? "Quiz unavailable"}</p>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => formatEnum(row.original.type),
    },
    {
      accessorKey: "start_date",
      header: "Starts",
      cell: ({ row }) => formatDateTime(row.original.start_date),
    },
    {
      accessorKey: "due_date",
      header: "Due",
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
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => {
        const assignment = row.original
        const isDraft = assignment.status === "DRAFT"
        return (
          <div className="flex flex-wrap gap-1">
            <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => onViewAttempts(assignment.id)}>
              <Eye className="size-4" /> Attempts
            </Button>
            {isDraft && (
              <>
                <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => onEdit(assignment)}>
                  <Pencil className="size-4" /> Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-destructive hover:text-destructive"
                  disabled={deletingId === assignment.id}
                  onClick={() => onDelete(assignment)}
                >
                  <Trash2 className="size-4" /> {deletingId === assignment.id ? "Deleting…" : "Delete"}
                </Button>
              </>
            )}
          </div>
        )
      },
    },
  ], [deletingId, onDelete, onEdit, onViewAttempts])

  return (
    <DataTable
      columns={columns}
      data={assignments}
      loading={loading}
      getRowId={assignment => assignment.id}
      emptyState="No assignments have been created for this class."
    />
  )
}

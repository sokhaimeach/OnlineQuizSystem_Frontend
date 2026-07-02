import { useMemo } from "react"
import { Eye } from "lucide-react"
import type { ColumnDef } from "@/components/data-table"
import { DataTable } from "@/components/data-table"
import { StatusBadge } from "@/components/StatusBadge"
import { Button } from "@/components/ui/button"
import type { Attempt } from "@/models/attempt.interface"
import { formatDateTime, formatEnum } from "@/utils/student-format"

interface AssignmentAttemptTableProps {
  attempts: Attempt[]
  loading?: boolean
  onView: (attemptId: string) => void
}

export function AssignmentAttemptTable({ attempts, loading, onView }: AssignmentAttemptTableProps) {
  const columns = useMemo<ColumnDef<Attempt>[]>(() => [
    {
      id: "student",
      accessorFn: attempt => attempt.guest_name || attempt.student_id,
      header: "Student",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.guest_name || row.original.student_id}</p>
          {row.original.guest_name && <p className="text-xs text-muted-foreground">Guest</p>}
        </div>
      ),
    },
    {
      accessorKey: "attempt_number",
      header: "Attempt",
    },
    {
      accessorKey: "total_score",
      header: "Score",
      cell: ({ row }) => row.original.total_score ?? "—",
    },
    {
      accessorKey: "started_at",
      header: "Started",
      cell: ({ row }) => formatDateTime(row.original.started_at),
    },
    {
      accessorKey: "submitted_at",
      header: "Submitted",
      cell: ({ row }) => formatDateTime(row.original.submitted_at),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge
          variant={row.original.status === "SUBMITTED" ? "success" : row.original.status === "TIMEOUT" ? "danger" : "warning"}
          dot
        >
          {formatEnum(row.original.status)}
        </StatusBadge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => onView(row.original.id)}>
          <Eye className="size-4" /> View attempt
        </Button>
      ),
    },
  ], [onView])

  return (
    <DataTable
      columns={columns}
      data={attempts}
      loading={loading}
      getRowId={attempt => attempt.id}
      emptyState="No attempts have been made for this assignment."
    />
  )
}

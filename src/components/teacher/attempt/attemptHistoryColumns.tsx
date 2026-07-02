import { Eye } from "lucide-react"
import type { ColumnDef } from "@/components/data-table"
import { StatusBadge } from "@/components/StatusBadge"
import { Button } from "@/components/ui/button"
import type { StudentAttemptsHistory } from "@/models/student.interface"
import {
  formatDateTime,
  formatDuration,
  formatEnum,
  getAttemptDuration,
  getAttemptPercentage,
} from "@/utils/student-format"

export function attemptHistoryColumns(onView: (attemptId: string) => void): ColumnDef<StudentAttemptsHistory>[] {
  return [
    {
      accessorFn: attempt => attempt.assignment.title,
      id: "assignment",
      header: "Assignment title",
      cell: ({ row }) => <span className="font-medium">{row.original.assignment.title}</span>,
    },
    {
      accessorFn: attempt => attempt.assignment.quiz.title,
      id: "quiz",
      header: "Quiz title",
    },
    {
      accessorKey: "attempt_number",
      header: "Attempt",
      cell: ({ row }) => row.original.attempt_number ?? "—",
    },
    {
      accessorKey: "total_score",
      header: "Score",
      cell: ({ row }) => row.original.total_score ?? "—",
    },
    {
      id: "percentage",
      header: "Percentage",
      accessorFn: attempt => getAttemptPercentage(attempt.total_score, undefined, attempt.percentage) ?? -1,
      cell: ({ row }) => {
        const percentage = getAttemptPercentage(row.original.total_score, undefined, row.original.percentage)
        return percentage == null ? "—" : `${percentage.toFixed(1)}%`
      },
    },
    {
      accessorKey: "submitted_at",
      header: "Submitted at",
      cell: ({ row }) => formatDateTime(row.original.submitted_at),
    },
    {
      id: "duration",
      header: "Duration",
      accessorFn: attempt => getAttemptDuration(attempt) ?? -1,
      cell: ({ row }) => formatDuration(getAttemptDuration(row.original)),
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
          <Eye className="size-4" />
          View attempt
        </Button>
      ),
    },
  ]
}

import { useMemo } from "react"
import { Eye } from "lucide-react"
import type { ColumnDef } from "@/components/data-table"
import { DataTable } from "@/components/data-table"
import { StatusBadge } from "@/components/StatusBadge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { AssignmentAttemptListItem } from "@/models/attempt.interface"
import { formatDateTime, formatEnum } from "@/utils/student-format"

interface AssignmentAttemptTableProps {
  attempts: AssignmentAttemptListItem[]
  loading?: boolean
  onView: (attemptId: string) => void
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

function formatScore(
  scoreValue: AssignmentAttemptListItem["total_score"],
  totalValue?: NonNullable<AssignmentAttemptListItem["assignment"]>["total_score"],
) {
  const score = Number(scoreValue)
  const total = Number(totalValue)

  if (!Number.isFinite(score)) return "-"
  if (!Number.isFinite(total) || total <= 0) return `${formatNumber(score)} pts`

  const percent = Math.round((score / total) * 100)
  return (
    <div className="flex min-w-24 flex-col">
      <span className="font-medium tabular-nums text-foreground">
        {formatNumber(score)} / {formatNumber(total)}
      </span>
      <span className="text-xs text-muted-foreground tabular-nums">
        {percent}%
      </span>
    </div>
  )
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join("")
    .toUpperCase() || "?"
}

function getStudentDisplay(attempt: AssignmentAttemptListItem) {
  const name = attempt.student?.full_name?.trim() || attempt.guest_name?.trim() || "Unknown student"
  const detail = attempt.student?.student_code || attempt.student?.email || (attempt.guest_name ? "Guest" : "No student details")
  const avatar = attempt.student?.avatar_url || undefined

  return { name, detail, avatar }
}

export function AssignmentAttemptTable({ attempts, loading, onView }: AssignmentAttemptTableProps) {
  const columns = useMemo<ColumnDef<AssignmentAttemptListItem>[]>(() => [
    {
      id: "number",
      header: "No.",
      enableSorting: false,
      size: 56,
      cell: ({ row }) => (
        <span className="text-sm font-medium tabular-nums text-muted-foreground">
          {row.index + 1}
        </span>
      ),
    },
    {
      id: "student",
      accessorFn: attempt => getStudentDisplay(attempt).name,
      header: "Student",
      size: 280,
      cell: ({ row }) => {
        const student = getStudentDisplay(row.original)
        return (
          <div className="flex min-w-56 max-w-72 items-center gap-3">
            <Avatar className="size-9 shrink-0">
              <AvatarImage src={student.avatar} alt={student.name} />
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                {getInitials(student.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground" title={student.name}>
                {student.name}
              </p>
              <p className="truncate text-xs text-muted-foreground" title={student.detail}>
                {student.detail}
              </p>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "attempt_number",
      header: "Attempt",
      cell: ({ row }) => {
        const attemptNumber = row.original.attempt_number
        return (
          <span className="whitespace-nowrap text-sm font-medium text-foreground">
            {attemptNumber ? `Attempt #${attemptNumber}` : `Attempt ${row.index + 1}`}
          </span>
        )
      },
    },
    {
      accessorKey: "total_score",
      header: "Score",
      cell: ({ row }) => formatScore(row.original.total_score, row.original.assignment?.total_score),
    },
    {
      accessorKey: "started_at",
      header: "Started",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-foreground">
          {formatDateTime(row.original.started_at)}
        </span>
      ),
    },
    {
      accessorKey: "submitted_at",
      header: "Submitted",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-foreground">
          {formatDateTime(row.original.submitted_at)}
        </span>
      ),
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
        <Button variant="ghost" size="sm" className="whitespace-nowrap gap-1.5" onClick={() => onView(row.original.id)}>
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
